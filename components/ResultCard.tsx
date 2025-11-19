import React, { useState } from 'react';
import { ProductAnalysis, AnchorSuggestion } from '../types';

interface ResultCardProps {
  item: ProductAnalysis;
}

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">{item.productName}</h3>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-indigo-600 truncate block max-w-xs md:max-w-md">
            {item.sourceUrl}
          </a>
        </div>
        <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100">Source Page</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {item.suggestions.map((suggestion, idx) => (
            <div key={idx} className="group relative flex items-start p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded 
                        ${suggestion.type === 'exact' ? 'bg-green-100 text-green-800' : 
                          suggestion.type === 'partial' ? 'bg-blue-100 text-blue-800' : 
                          suggestion.type === 'contextual' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {suggestion.type}
                    </span>
                </div>
                <p className="font-medium text-slate-900 text-lg mb-1 font-mono">"{suggestion.text}"</p>
                <p className="text-sm text-slate-500 leading-relaxed">{suggestion.reasoning}</p>
              </div>
              
              <button
                onClick={() => copyToClipboard(suggestion.text, idx)}
                className="ml-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-colors border border-transparent hover:border-slate-200 shadow-sm"
                title="Copy anchor text"
              >
                {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};