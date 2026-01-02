import React, { useState } from 'react';

// Authorization Credentials (kept as requested)
const AUTH_USER = "admin";
const AUTH_PASS = "PYgzAHj5WgI9Sz";

interface Course {
  id: string;
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  shadowColor: string;
}

const COURSES: Course[] = [
  { 
    id: 'counting', 
    title: 'Counting 1-10', 
    icon: '1️⃣2️⃣3️⃣', 
    color: 'bg-emerald-400 text-white', 
    borderColor: 'border-emerald-600',
    shadowColor: 'shadow-emerald-200'
  },
  { 
    id: 'addition', 
    title: 'Simple Addition', 
    icon: '➕', 
    color: 'bg-blue-400 text-white', 
    borderColor: 'border-blue-600',
    shadowColor: 'shadow-blue-200'
  },
  { 
    id: 'subtraction', 
    title: 'Take Away', 
    icon: '➖', 
    color: 'bg-orange-400 text-white', 
    borderColor: 'border-orange-600',
    shadowColor: 'shadow-orange-200'
  },
  { 
    id: 'shapes', 
    title: 'Fun Shapes', 
    icon: '🔺', 
    color: 'bg-purple-400 text-white', 
    borderColor: 'border-purple-600',
    shadowColor: 'shadow-purple-200'
  },
];

const App: React.FC = () => {
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
      setAuthError("Whoops! Wrong secret code 🤫");
    }
  };

  if (!isAuthenticated) {
    // Playful Login Screen
    return (
      <div className="min-h-screen bg-sky-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="flex justify-center mb-6">
             <div className="bg-white p-5 rounded-full shadow-xl border-4 border-yellow-400 animate-bounce">
                <span className="text-5xl">🎓</span>
             </div>
           </div>
          <h2 className="text-center text-4xl font-black tracking-tight text-sky-900 drop-shadow-sm">
            Math Adventure
          </h2>
          <p className="mt-2 text-center text-lg text-sky-700 font-bold">
            Let's learn together!
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl sm:rounded-3xl border-b-8 border-sky-200 sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold text-sky-900 uppercase tracking-wide">Username</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full appearance-none rounded-xl border-2 border-sky-100 px-4 py-3 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200 sm:text-lg transition-all font-bold text-sky-800"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-sky-900 uppercase tracking-wide">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-xl border-2 border-sky-100 px-4 py-3 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200 sm:text-lg transition-all font-bold text-sky-800"
                    placeholder="Secret code"
                  />
                </div>
              </div>

              {authError && (
                <div className="text-red-500 text-sm font-black text-center bg-red-50 p-3 rounded-xl border-2 border-red-100 flex items-center justify-center gap-2 animate-pulse">
                    <span>🚫</span> {authError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-2xl border-transparent bg-yellow-400 py-4 text-lg font-black text-yellow-900 shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all transform active:scale-95 active:translate-y-1 border-b-8 border-yellow-500 active:border-b-0 uppercase tracking-widest"
                >
                  Start Playing! 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard (Authenticated)
  return (
    <div className="min-h-screen bg-sky-50 p-4 sm:p-8 select-none">
       <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-5xl font-black text-sky-900 drop-shadow-sm">Hi, Explorer! 👋</h1>
                <p className="text-sky-600 font-bold text-lg mt-2">Pick a game to start learning</p>
            </div>
            <button 
                onClick={() => setIsAuthenticated(false)}
                className="bg-white text-sky-900 px-6 py-3 rounded-2xl font-bold shadow-sm border-b-4 border-sky-200 hover:bg-sky-50 active:border-b-0 active:translate-y-1 transition-all"
            >
                Exit Game
            </button>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COURSES.map((course) => (
                <button 
                    key={course.id}
                    onClick={() => console.log(`Selected ${course.title}`)}
                    className={`relative group overflow-hidden ${course.color} p-8 rounded-[2rem] border-b-[12px] ${course.borderColor} shadow-xl hover:brightness-110 active:border-b-0 active:translate-y-3 transition-all duration-150 text-left w-full h-64 flex flex-col justify-between`}
                >
                    <div className="absolute top-4 right-4 opacity-20 text-8xl transform rotate-12 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500">
                      {course.icon}
                    </div>
                    
                    <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 origin-left drop-shadow-md">
                        {course.icon}
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black tracking-tight drop-shadow-sm leading-tight">{course.title}</h3>
                        <div className="mt-3 flex items-center gap-2">
                           <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-white/20">
                             Play Now
                           </span>
                           <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">
                             ➜
                           </span>
                        </div>
                    </div>
                </button>
            ))}
          </div>
       </div>
    </div>
  );
};

export default App;