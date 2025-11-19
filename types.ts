export interface AnchorSuggestion {
  text: string;
  type: 'exact' | 'partial' | 'contextual' | 'branded';
  reasoning: string;
}

export interface ProductAnalysis {
  sourceUrl: string;
  productName: string;
  suggestions: AnchorSuggestion[];
}

export interface GenerateAnchorsRequest {
  targetUrl: string;
  targetKeyword: string;
  productUrls: string[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}