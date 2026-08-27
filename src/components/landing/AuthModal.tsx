import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { User } from '../../types';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Building, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose, onSuccess }) => {
  const { allUsers, setCurrentUser, organization } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('EBEN Technologies SARL');
  const [password, setPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>(allUsers[1]?.id || allUsers[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (user: User) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser(user);
      setIsLoading(false);
      onSuccess();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          setCurrentUser(found);
        } else {
          // If custom email, pick current or build quick session
          const userToUse = allUsers[1] || allUsers[0];
          setCurrentUser(userToUse);
        }
      } else {
        // Signup: create user profile
        const newUser: User = {
          id: `user_${Date.now()}`,
          fullName: fullName || 'Nouvel Utilisateur',
          email: email || 'contact@entreprise.bj',
          role: 'OWNER',
          orgId: organization.id,
          createdAt: new Date().toISOString(),
        };
        storage.saveUser(newUser);
        setCurrentUser(newUser);
      }
      setIsLoading(false);
      onSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Badge & Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-mono font-black text-lg shadow-md shadow-blue-900/50">
            E
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {mode === 'login' ? 'Connexion Espace Entreprise' : 'Créer un Compte Professionnel'}
            </h2>
            <p className="text-xs text-slate-400">
              EBEN Technologies SARL • Facturation Bénin
            </p>
          </div>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Accès Rapide Démo / Équipe EBEN
            </span>
            <span className="text-[10px] text-blue-400 font-mono">1-Clic</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user)}
                className="flex flex-col items-start p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-blue-600/20 hover:border-blue-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                    {user.fullName}
                  </span>
                  {user.role === 'SUPER_ADMIN' && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">BOSS</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate w-full">
                  {user.role === 'OWNER' ? 'Directeur' : user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role} • {user.email}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom complet & Fonction
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Eben Keys (Directeur)"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Adresse Email Professionnelle
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eben@eben-tech.bj"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/50 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Connexion en cours...' : mode === 'login' ? 'Se Connecter à l\'Espace' : 'Créer mon Espace Pro'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-blue-400 hover:underline cursor-pointer"
              >
                Créer un compte professionnel
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-blue-400 hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
