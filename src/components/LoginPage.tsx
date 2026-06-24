import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, UserCheck, HelpCircle, Sparkles, UserPlus, MapPin, BadgeCheck, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { CURRENT_USER_PROFILES } from '../data';
import { registerCustomUser, fetchCustomUsers } from '../lib/firebase';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'resident' | 'admin'>('resident');
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regArea, setRegArea] = useState('Maple Heights (West Side)');
  const [regBio, setRegBio] = useState('');
  const [regSkills, setRegSkills] = useState('');
  const [regRole, setRegRole] = useState<'resident' | 'admin'>('resident');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check custom registered users first from Firestore
      const customUsers = await fetchCustomUsers();
      
      // Find matching user
      const matchedCustom = customUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedCustom) {
        if (!password.trim()) {
          setError('Password is required');
          setLoading(false);
          return;
        }
        onLogin(matchedCustom);
        setLoading(false);
        return;
      }

      // Otherwise check default hardcoded profiles
      if (email.toLowerCase() === 'sarah.j@gmail.local' && password === 'password123') {
        onLogin(CURRENT_USER_PROFILES.resident);
      } else if (email.toLowerCase() === 'elena.admin@neighborhub.org' && password === 'admin123') {
        onLogin(CURRENT_USER_PROFILES.admin);
      } else if (email.toLowerCase() === 'marcus.v@neighborhub.local' && password === 'mod123') {
        onLogin(CURRENT_USER_PROFILES.moderator);
      } else if (email.toLowerCase() === 'guest@neighborhub.local' && password === 'guest123') {
        onLogin(CURRENT_USER_PROFILES.guest);
      } else {
        setError('Invalid email address or passcode. Please check credentials or register a new profile.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);

    // Build registered user profile
    const newUser: User = {
      id: `custom_user_${Date.now()}`,
      name: regName,
      email: regEmail,
      avatar: regRole === 'admin' 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
        : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      area: regArea,
      bio: regBio || `New neighborhood ${regRole === 'admin' ? 'organizer' : 'resident'}. Let's make our block great!`,
      skills: regSkills ? regSkills.split(',').map(s => s.trim()) : [],
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      trustScore: regRole === 'admin' ? 100 : 80,
      badges: regRole === 'admin' ? ["Admin", "Founding Neighbor"] : ["New Resident"],
      isVerified: true,
      postsCount: 0,
      filesCount: 0,
      role: regRole
    };

    try {
      // Store custom user in Firestore so they can log in from any device
      await registerCustomUser(newUser);

      setRegSuccess(true);
      setTimeout(() => {
        // Auto fill and switch to login tab
        setEmail(regEmail);
        setPassword(regPassword);
        setActiveTab('login');
        setRegSuccess(false);
        // Reset inputs
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegBio('');
        setRegSkills('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased selection:bg-indigo-500 selection:text-white font-sans">
      {/* Decorative top grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Left Informative Column - Visual Branding */}
        <div className="md:col-span-5 bg-indigo-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-800/80 to-indigo-950/95 z-0" />
          <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl z-0" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white text-indigo-900 rounded-2xl flex items-center justify-center font-display font-black text-2xl shadow-lg">
                N
              </div>
              <div>
                <span className="text-2xl font-black font-display tracking-tight text-white">Neighbor<span className="text-amber-400">Hub</span></span>
                <span className="block text-[10px] text-indigo-200 uppercase tracking-widest font-bold -mt-1">Maple Heights Sim</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight text-white">
                Connecting blocks, builders, and administrators.
              </h1>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Welcome back to Maple Heights' verified neighborhood board. Report safety issues, access the HOA Document Vault, swap household tools, or request emergency assistance.
              </p>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="relative z-10 space-y-4 pt-12 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-white/10 rounded-lg text-amber-300">✓</span>
              <div>
                <p className="font-bold">Two Mock Framework Roles Included</p>
                <p className="text-[10px] text-indigo-200">Log in as a standard Resident or System Administrator.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-white/10 rounded-lg text-amber-300">✓</span>
              <div>
                <p className="font-bold">Hyperlocal Safety Bulletins</p>
                <p className="text-[10px] text-indigo-200">Verify water disruptions, heatwaves, or missing pet alerts.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-indigo-300/80 font-mono mt-8">
            © 2026 NeighborHub Inc. • Local Simulation Active
          </div>
        </div>

        {/* Right Tabbed Form Container */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 text-left flex flex-col justify-between">
          <div className="space-y-6">
            {/* Upper Tab controllers */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex gap-4">
                <button
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`text-sm font-bold pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'login' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`text-sm font-bold pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'register' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
                <Sparkles size={11} className="text-indigo-500" />
                <span>Simulation Active</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM VIEW */}
            {activeTab === 'login' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-black text-slate-800">Welcome Back, Neighbor</h2>
                  <p className="text-xs text-slate-400">Provide your verified login credentials below.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Verified Email Address *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-600 block">Passcode / Key *</label>
                      <span className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer" onClick={() => alert("Simulation Tip:\n- Resident: sarah.j@gmail.local / password123\n- Administrator: elena.admin@neighborhub.org / admin123\n- Moderator: marcus.v@neighborhub.local / mod123")}>
                        Forgot password?
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={14} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span>Authorize & Secure Sign In</span>
                  </button>
                </form>
              </div>
            )}

            {/* SIGN UP / REGISTER VIEW */}
            {activeTab === 'register' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-lg font-black text-slate-800">Register Resident Profile</h2>
                  <p className="text-xs text-slate-400">Add a brand new profile to Maple Heights. You can select your role to immediately explore custom permissions!</p>
                </div>

                {regSuccess ? (
                  <div className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center space-y-2">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                      <UserCheck size={20} />
                    </div>
                    <p className="text-xs font-bold text-green-800">Registration Successful!</p>
                    <p className="text-[10px] text-slate-500">Redirecting to Sign In form with pre-filled credentials. Please wait...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-600 block">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Sarah Jenkins"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-600 block">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="sarah.j@gmail.local"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-600 block">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="password123"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-600 block">Neighborhood Block *</label>
                        <input
                          type="text"
                          required
                          placeholder="Maple Heights (West Side)"
                          value={regArea}
                          onChange={(e) => setRegArea(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Role selector inside Registration */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-600 block">Simulation Account Role *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRegRole('resident')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            regRole === 'resident'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                              : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                          }`}
                        >
                          User (Resident)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole('admin')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            regRole === 'admin'
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                          }`}
                        >
                          System Admin
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-600 block">Short Biography (Bio)</label>
                      <textarea
                        rows={2}
                        placeholder="Mom of two, organic baker, happy to water garden planters..."
                        value={regBio}
                        onChange={(e) => setRegBio(e.target.value)}
                        className="w-full px-3 py-1.8 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-600 block">Service Skills / Mutual-Aid Pledges (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Baking, Gardener, Electrician, Plumber"
                        value={regSkills}
                        onChange={(e) => setRegSkills(e.target.value)}
                        className="w-full px-3 py-1.8 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>Create Profile & Continue</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <ShieldCheck size={11} className="text-green-500" />
              Verified sandbox auth loop.
            </span>
            <span>All mock sessions are persisted in localStorage.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
