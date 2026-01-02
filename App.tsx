import React, { useState, useEffect } from 'react';
import { ThemeConfig, Problem, ThemeType } from './types';

// --- CONFIGURATION & THEMES ---

const THEMES: Record<ThemeType, ThemeConfig> = {
  apples: {
    id: 'apples',
    name: 'Яблоки',
    item: '🍎',
    container: '🧺',
    bg: 'bg-[#F0F4F8]', // Soft blue-grey
    primary: 'bg-rose-300',
    accent: 'text-rose-400',
  },
  trains: {
    id: 'trains',
    name: 'Поезда',
    item: '🚂',
    container: '🚉',
    bg: 'bg-[#F0F4F8]',
    primary: 'bg-sky-300',
    accent: 'text-sky-400',
  },
  dinos: {
    id: 'dinos',
    name: 'Динозавры',
    item: '🦕',
    container: '🌋',
    bg: 'bg-[#F0F4F8]',
    primary: 'bg-emerald-300',
    accent: 'text-emerald-400',
  },
};

// --- AUDIO HELPER (Soft Synth) ---
const playSoftChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine'; // Sine wave is soft, not harsh
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime); // Low volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) {
    // Silent fail if audio not supported
  }
};

// --- COMPONENTS ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('apples');
  const [mode, setMode] = useState<'menu' | 'abstract'>('menu');
  const [problem, setProblem] = useState<Problem>({ num1: 1, num2: 1, operation: '+', result: 2 });
  
  // Game State
  const [isSuccess, setIsSuccess] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState<number | null>(null); // For Abstract Mode shaking

  const theme = THEMES[currentTheme];

  // Auth bypass
  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  const generateProblem = () => {
    const operation = Math.random() > 0.5 ? '+' : '-';
    let n1 = Math.floor(Math.random() * 5) + 1; // 1-5
    let n2 = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // Simplify logic to ensure positive results within 1-5 range mostly
    if (operation === '-') {
      if (n1 < n2) [n1, n2] = [n2, n1]; // Swap so larger is first
    } else {
      // Addition: ensure sum <= 10 (or 6 for simple start)
      while (n1 + n2 > 6) {
        n1 = Math.floor(Math.random() * 3) + 1;
        n2 = Math.floor(Math.random() * 3) + 1;
      }
    }

    setProblem({
      num1: n1,
      num2: n2,
      operation,
      result: operation === '+' ? n1 + n2 : n1 - n2
    });
    setIsSuccess(false);
    setWrongAttempt(null);
  };

  const handleModeSelect = (selectedMode: 'abstract') => {
    setMode(selectedMode);
    generateProblem();
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    playSoftChime();
    setTimeout(() => {
      generateProblem();
    }, 2000); // 2 seconds to enjoy the success
  };

  // --- ABSTRACT MODE LOGIC ---
  const checkAnswer = (answer: number) => {
    if (answer === problem.result) {
      handleSuccess();
    } else {
      // Errorless: Just a subtle shake, no sound, no red color.
      setWrongAttempt(answer);
      setTimeout(() => setWrongAttempt(null), 500);
    }
  };

  // Generate Abstract Options (1 correct, 2 distractors)
  const getOptions = () => {
    const opts = new Set<number>();
    opts.add(problem.result);
    while (opts.size < 3) {
      const r = Math.floor(Math.random() * 7); // 0-6
      if (r !== problem.result) opts.add(r);
    }
    return Array.from(opts).sort((a, b) => a - b);
  };

  // --- RENDER HELPERS ---

  if (mode === 'menu') {
    return (
      <div className={`min-h-screen ${theme.bg} text-slate-600 font-sans p-6 flex flex-col items-center justify-center transition-colors duration-500`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">{theme.item}</div>
            <h1 className="text-4xl font-bold text-slate-700 tracking-tight">Давай считать!</h1>
            <p className="text-slate-500 mt-2 text-lg">Выбери игру</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <button 
              onClick={() => handleModeSelect('abstract')}
              className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="text-left">
                <span className="block text-2xl font-bold text-slate-700">Примеры</span>
                <span className="text-slate-400">1 + 2 = 3</span>
              </div>
              <div className="text-4xl opacity-50 group-hover:opacity-100 bg-slate-100 rounded-lg p-2 font-bold text-slate-400 group-hover:text-slate-600 transition-all">123</div>
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="mt-12 flex justify-center gap-4">
            {(Object.keys(THEMES) as ThemeType[]).map((t) => (
              <button
                key={t}
                onClick={() => setCurrentTheme(t)}
                className={`p-3 rounded-full text-2xl transition-transform hover:scale-110 ${currentTheme === t ? 'bg-white shadow-md scale-110 ring-2 ring-slate-200' : 'opacity-50'}`}
              >
                {THEMES[t].item}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} text-slate-600 font-sans flex flex-col`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={() => setMode('menu')}
          className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full p-4">
        
        {/* The Problem Equation */}
        <div className="mb-12 flex items-center gap-4 text-6xl sm:text-8xl font-bold text-slate-700 select-none">
          <span>{problem.num1}</span>
          <span className="text-slate-300">{problem.operation}</span>
          <span>{problem.num2}</span>
          <span className="text-slate-300">=</span>
          <span className={`${isSuccess ? theme.accent + ' animate-pulse' : 'text-slate-300'}`}>?</span>
        </div>

        {/* --- ABSTRACT MODE RENDER --- */}
        {mode === 'abstract' && (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {getOptions().map((opt) => (
                <button
                  key={opt}
                  onClick={() => checkAnswer(opt)}
                  disabled={isSuccess}
                  className={`
                    h-32 rounded-3xl text-5xl sm:text-6xl font-bold shadow-sm border-b-4 transition-all
                    flex items-center justify-center
                    ${isSuccess && opt === problem.result 
                       ? 'bg-emerald-100 text-emerald-600 border-emerald-200 scale-110' 
                       : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:border-b-0 active:translate-y-1'}
                    ${wrongAttempt === opt ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
            {isSuccess && <div className="mt-8 text-center text-3xl text-emerald-400 font-bold animate-pulse">Молодец!</div>}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;