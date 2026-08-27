import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  UserCheck, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X, 
  Lock 
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { organization, currentUser, allUsers } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('ACCOUNTANT');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      orgId: organization.id,
      email: inviteEmail,
      fullName: inviteName,
      phone: invitePhone || '+229 97 00 00 00',
      role: inviteRole,
      avatarUrl: '',
      createdAt: new Date().toISOString(),
    };

    const users = storage.getUsers();
    users.push(newUser);
    storage.saveUsers(users);

    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePhone('');
    }, 1500);
  };

  const roleDescriptions: Record<UserRole, string> = {
    SUPER_ADMIN: 'Contrôle complet de la plateforme SaaS EBEN et de tous les comptes clients.',
    OWNER: 'Propriétaire de l\'entreprise : contrôle total sur les abonnements, l\'équipe et les finances.',
    ADMIN: 'Administrateur de l\'entreprise : accès total, gestion de l\'équipe et paramètres.',
    MANAGER: 'Gestionnaire : validation des devis et factures, suivi des clients et reporting.',
    ACCOUNTANT: 'Comptable : enregistrement des paiements, rapports financiers et exports.',
    SALES: 'Commercial : émission de devis et factures clients.',
    SALES_REP: 'Commercial : prospection, création de devis et suivi des ventes.',
    STAFF: 'Employé standard : consultation et opérations déléguées.',
    VIEWER: 'Consultant : lecture seule sans droit de modification.',
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'OWNER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'ACCOUNTANT':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SALES':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-emerald-400" />
            <span>Gestion de l'Équipe & Rôles (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Définissez les accès collaboratifs et autorisations sécurisées pour vos collaborateurs
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
        >
          <UserPlus className="h-4 w-4 stroke-[2.5]" />
          <span>Inviter un Membre</span>
        </button>
      </div>

      {/* Users List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden p-5">
        <h2 className="text-sm font-bold text-white mb-4">Membres Actifs ({allUsers.length})</h2>
        <div className="divide-y divide-slate-800/80">
          {allUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm border border-emerald-500/30">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{user.fullName}</span>
                    {user.id === currentUser.id && (
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400 font-medium">
                        Vous
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{user.email} • {user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
                <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-emerald-500" title="Actif" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permissions Matrix */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Matrice des Permissions & Rôles</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Chaque rôle dispose de droits précis pour garantir la séparation des pouvoirs comptables
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['OWNER', 'ADMIN', 'ACCOUNTANT', 'SALES', 'STAFF', 'VIEWER'] as UserRole[]).map(r => (
            <div key={r} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getRoleBadge(r)}`}>
                  {r}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {roleDescriptions[r]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Inviter un Collaborateur</h3>
                <p className="text-xs text-slate-400">
                  Un email d'invitation avec accès sécurisé lui sera envoyé
                </p>
              </div>
            </div>

            {inviteSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span>Invitation envoyée avec succès !</span>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nom & Prénom * :
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="Ex: Awa Diallo"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Adresse Email * :
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="adiallo@entreprise.bj"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Numéro Téléphone :
                </label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={e => setInvitePhone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Rôle Attribué :
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                >
                  <option value="ACCOUNTANT">Comptable (Encaissements, Bilans)</option>
                  <option value="SALES">Commercial (Devis, Factures)</option>
                  <option value="ADMIN">Administrateur (Accès Total)</option>
                  <option value="STAFF">Employé (Opérations standard)</option>
                  <option value="VIEWER">Consultant (Lecture seule)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  <span>Envoyer l'Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
