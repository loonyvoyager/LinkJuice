import React, { useState, useCallback } from 'react';
import { LoadingState, ProductAnalysis, GenerateAnchorsRequest } from './types';
import { generateSEOAnchors } from './services/gemini';
import { ResultCard } from './components/ResultCard';

// Authorization Credentials
const AUTH_USER = "admin";
const AUTH_PASS = "PYgzAHj5WgI9Sz";

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Application State
  const [targetUrl, setTargetUrl] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [productsText, setProductsText] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [results, setResults] = useState<ProductAnalysis[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === AUTH_USER && password === AUTH_PASS) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials");
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResults([]);
    
    // Validate Target URL
    if (!targetUrl || !isValidUrl(targetUrl)) {
        setErrorMsg("Please enter a valid Target Category URL (e.g., https://example.com/category).");
        setLoadingState(LoadingState.ERROR);
        return;
    }

    if (!targetKeyword.trim()) {
        setErrorMsg("Please enter a Target Keyword.");
        setLoadingState(LoadingState.ERROR);
        return;
    }

    const productUrls = productsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (productUrls.length === 0) {
      setErrorMsg("Please enter at least one valid product URL.");
      setLoadingState(LoadingState.ERROR);
      return;
    }

    // Validate Product URLs
    const invalidUrls = productUrls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setErrorMsg(`Invalid product URLs found: ${invalidUrls.slice(0, 2).join(', ')}${invalidUrls.length > 2 ? '...' : ''}`);
      setLoadingState(LoadingState.ERROR);
      return;
    }

    setLoadingState(LoadingState.LOADING);

    const request: GenerateAnchorsRequest = {
      targetUrl,
      targetKeyword,
      productUrls
    };

    try {
      const analysis = await generateSEOAnchors(request);
      setResults(analysis);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate recommendations. Please check your network and API configuration.");
      setLoadingState(LoadingState.ERROR);
    }
  }, [targetUrl, targetKeyword, productsText]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-neutral-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="flex justify-center mb-6">
             <div className="bg-neutral-900 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
             </div>
           </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
            LinkJuice AI
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Internal Linking Intelligence
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-200/50 sm:rounded-xl sm:px-10 border border-neutral-100">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-neutral-700">Username</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm transition-all"
                  />
                </div>
              </div>

              {authError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {authError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg border border-transparent bg-neutral-900 py-2.5 px-4 text-sm font-bold text-white shadow-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all transform active:scale-[0.98]"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-neutral-900 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
             </div>
             <span className="font-bold text-lg tracking-tight text-neutral-900">LinkJuice AI</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               Gemini 3 Pro Active
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-neutral-800">Configuration</h2>
                  {results.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => { setResults([]); setTargetUrl(""); setTargetKeyword(""); setProductsText(""); }}
                        className="text-xs text-neutral-400 hover:text-neutral-900 font-medium"
                      >
                        Reset
                      </button>
                  )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Target Category URL</label>
                  <div className="relative">
                    <input
                        type="url"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full rounded-lg border-neutral-200 bg-neutral-50 shadow-sm focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm py-2.5 px-3 border transition-all outline-none pl-9"
                        placeholder="https://site.com/category"
                    />
                    <div className="absolute left-3 top-2.5 text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-neutral-400">The page you want to boost authority for.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Target Keyword</label>
                  <div className="relative">
                    <input
                        type="text"
                        required
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        className="w-full rounded-lg border-neutral-200 bg-neutral-50 shadow-sm focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm py-2.5 px-3 border transition-all outline-none pl-9"
                        placeholder="e.g. Vintage Leather Jackets"
                    />
                    <div className="absolute left-3 top-2.5 text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-neutral-400">Main search term for the category.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Source Product URLs</label>
                  <textarea
                    required
                    value={productsText}
                    onChange={(e) => setProductsText(e.target.value)}
                    className="w-full rounded-lg border-neutral-200 bg-neutral-50 shadow-sm focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs py-2.5 px-3 border font-mono h-48 transition-all outline-none resize-none leading-relaxed"
                    placeholder={`https://site.com/product-a\nhttps://site.com/product-b\nhttps://site.com/product-c`}
                  />
                  <p className="mt-1.5 text-[11px] text-neutral-400">One URL per line. These pages will link TO the target.</p>
                </div>

                <button
                  type="submit"
                  disabled={loadingState === LoadingState.LOADING}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all transform
                    ${loadingState === LoadingState.LOADING ? 'bg-neutral-800 cursor-not-allowed opacity-90' : 'bg-neutral-900 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {loadingState === LoadingState.LOADING ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing & Generating...
                    </>
                  ) : (
                    'Generate SEO Strategy'
                  )}
                </button>
              </form>

              {errorMsg && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-start gap-3 animate-fade-in">
                   <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                   <span className="leading-snug">{errorMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-8 space-y-6">
            {loadingState === LoadingState.IDLE && (
               <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center flex flex-col items-center justify-center min-h-[500px] border-dashed">
                  <div className="h-20 w-20 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">Awaiting Input</h3>
                  <p className="mt-3 text-neutral-500 max-w-md mx-auto leading-relaxed">
                    Enter your target category and product URLs to begin. 
                    <br/>We'll analyze your content and generate high-value internal links.
                  </p>
               </div>
            )}

            {loadingState === LoadingState.LOADING && (
                <div className="space-y-6">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="bg-white rounded-xl border border-neutral-200 p-8 animate-pulse shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 bg-neutral-100 rounded w-1/3"></div>
                            <div className="h-5 bg-neutral-50 rounded w-24"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-neutral-50 rounded w-full"></div>
                            <div className="h-4 bg-neutral-50 rounded w-5/6"></div>
                            <div className="h-4 bg-neutral-50 rounded w-4/6"></div>
                        </div>
                     </div>
                   ))}
                </div>
            )}

            {loadingState === LoadingState.SUCCESS && (
              <div className="space-y-8 animate-fade-in-up">
                 <div className="flex items-center justify-between bg-neutral-900 text-white p-4 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold pl-2">Strategy Recommendations</h2>
                    <span className="text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/10">{results.length} Pages Analyzed</span>
                 </div>
                 {results.map((item, idx) => (
                   <ResultCard key={idx} item={item} />
                 ))}
              </div>
            )}
            
            {loadingState === LoadingState.ERROR && !errorMsg && (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                 <p className="text-neutral-500">Something went wrong. Please check your inputs and try again.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;