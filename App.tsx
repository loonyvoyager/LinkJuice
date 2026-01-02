import React, { useState } from 'react';

// Authorization Credentials
const AUTH_USER = "admin";
const AUTH_PASS = "PYgzAHj5WgI9Sz";

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === AUTH_USER && password === AUTH_PASS) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials");
    }
  };

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
            System Reset. Login to configure.
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

  // Authenticated State (App logic erased)
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
       <div className="text-center p-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 max-w-sm mx-auto">
             <div className="h-16 w-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
             </div>
             <h1 className="text-xl font-bold text-neutral-900 mb-2">Welcome, Admin</h1>
             <p className="text-neutral-500 mb-6 text-sm">The application has been reset and is ready for new features.</p>
             <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full py-2 px-4 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-neutral-800 transition-colors"
             >
                Sign out
             </button>
          </div>
       </div>
    </div>
  );
};

export default App;