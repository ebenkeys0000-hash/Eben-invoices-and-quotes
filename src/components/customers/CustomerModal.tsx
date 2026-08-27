import React, { useState } from 'react';
import { Customer } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { X, UserPlus, Building, Phone, Mail, MapPin, Hash, Check } from 'lucide-react';

interface CustomerModalProps {
  customerToEdit?: Customer | null;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customerToEdit,
  onClose,
  onSaved,
}) => {
  const { organization } = useApp();
  const isEditing = !!customerToEdit;

  const [name, setName] = useState(customerToEdit?.name || '');
  const [companyName, setCompanyName] = useState(customerToEdit?.companyName || '');
  const [email, setEmail] = useState(customerToEdit?.email || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '+229 ');
  const [address, setAddress] = useState(customerToEdit?.address || 'Cotonou, Bénin');
  const [taxId, setTaxId] = useState(customerToEdit?.taxId || '');
  const [notes, setNotes] = useState(customerToEdit?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner le nom du client.');
      return;
    }

    const newCustomer: Customer = {
      id: customerToEdit?.id || `cust_${Date.now()}`,
      orgId: organization.id,
      name,
      companyName,
      email,
      phone,
      address,
      country: 'Bénin',
      taxId,
      notes,
      totalInvoiced: customerToEdit?.totalInvoiced || 0,
      totalPaid: customerToEdit?.totalPaid || 0,
      outstandingBalance: customerToEdit?.outstandingBalance || 0,
      createdAt: customerToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = storage.saveCustomer(newCustomer);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isEditing ? 'Modifier la Fiche Client' : 'Nouveau Client'}
            </h3>
            <p className="text-xs text-slate-400">
              Enregistrez les coordonnées et le N° IFU fiscal du client
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nom complet du Contact / Entreprise * :
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: SOBEBRA SA ou Jean Dupont"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Raison Sociale :
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Ex: SOBEBRA"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                N° IFU Bénin :
              </label>
              <input
                type="text"
                value={taxId}
                onChange={e => setTaxId(e.target.value)}
                placeholder="0201910848839"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Téléphone (+229) :
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email :
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@entreprise.bj"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Adresse physique :
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Zone Industrielle, Akpakpa, Cotonou"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Notes internes :
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Conditions particulières de paiement..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer le Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
