import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductAnalysis, GenerateAnchorsRequest } from "../types";

// Initialize the Gemini API client
// The API key is guaranteed to be available in process.env.API_KEY per environment settings.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANCHOR_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      sourceUrl: { type: Type.STRING, description: "The original product URL provided." },
      productName: { type: Type.STRING, description: "The extracted or inferred name of the product." },
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The suggested anchor text." },
            type: { 
              type: Type.STRING, 
              enum: ['exact', 'partial', 'contextual', 'branded'],
              description: "The classification of this anchor text."
            },
            reasoning: { type: Type.STRING, description: "Brief explanation of why this anchor works for SEO." }
          },
          required: ["text", "type", "reasoning"]
        }
      }
    },
    required: ["sourceUrl", "productName", "suggestions"]
  }
};

export const generateSEOAnchors = async (request: GenerateAnchorsRequest): Promise<ProductAnalysis[]> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are a world-class SEO Specialist and Content Strategist.
      
      GOAL: Generate internal linking anchor texts to boost the ranking of a specific Category Page.
      
      TARGET CONFIGURATION:
      - Target Category URL: ${request.targetUrl}
      - Target Primary Keyword: ${request.targetKeyword}
      
      SOURCE PAGES (Products):
      ${request.productUrls.map(url => `- ${url}`).join('\n')}
      
      INSTRUCTIONS:
      1. Analyze each Source Page URL to understand what product it is.
      2. For EACH source page, generate 5 distinct anchor text suggestions to link TO the Target Category.
      3. Ensure diversity:
         - Exact Match: Includes the target keyword directly.
         - Partial Match: Includes the keyword + modifiers naturally.
         - Contextual: Describes the category naturally within a sentence about the product.
      4. The anchors must be natural and high-quality for Google's latest algorithms.
      
      Return the result strictly as a JSON array matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANCHOR_SCHEMA,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(response.text) as ProductAnalysis[];
    return data;

  } catch (error) {
    console.error("Error generating SEO anchors:", error);
    throw error;
  }
};