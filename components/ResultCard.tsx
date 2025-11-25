import React, { useState } from 'react';
import { ProductAnalysis, AnchorSuggestion } from '../types';

interface ResultCardProps {
  item: ProductAnalysis;
}

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
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
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-neutral-50/50 px-6 py-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-neutral-900 text-lg truncate pr-4" title={item.productName}>{item.productName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-neutral-200 text-neutral-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Source</span>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-900 truncate block max-w-md transition-colors font-mono">
                {item.sourceUrl}
            </a>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {item.suggestions.map((suggestion, idx) => (
            <div key={idx} className="group relative flex items-start p-4 rounded-xl border border-neutral-100 bg-white hover:bg-neutral-50 hover:border-neutral-200 transition-all duration-200">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border
                        ${suggestion.type === 'exact' ? 'bg-neutral-900 text-white border-neutral-900' : ''}
                        ${suggestion.type === 'partial' ? 'bg-neutral-200 text-neutral-700 border-neutral-300' : ''}
                        ${suggestion.type === 'contextual' ? 'bg-white text-neutral-500 border-neutral-200' : ''}
                        ${suggestion.type === 'branded' ? 'bg-neutral-100 text-neutral-800 border-neutral-200' : ''}
                    `}>
                        {suggestion.type}
                    </span>
                </div>
                <div className="flex items-baseline gap-3 mb-1">
                    <p className="font-bold text-neutral-900 text-base md:text-lg font-mono tracking-tight group-hover:text-blue-600 transition-colors">
                        "{suggestion.text}"
                    </p>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">{suggestion.reasoning}</p>
              </div>
              
              <div className="flex-shrink-0 self-center">
                  <button
                    onClick={() => copyToClipboard(suggestion.text, idx)}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
                        ${copiedIndex === idx 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                            : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-300 hover:shadow-sm'
                        }`}
                    title="Copy anchor text"
                  >
                    {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};