import React, { useState } from 'react';
import { Organization, DocumentTemplateId, CurrencyCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { DataExportUtility } from './DataExportUtility';
import { StorePublicationHub } from '../store/StorePublicationHub';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../compliance/TermsOfServiceModal';
import { AccountDeletionModal } from '../compliance/AccountDeletionModal';
import { 
  Settings, 
  Building, 
  FileText, 
  Palette, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Smartphone,
  ShieldCheck,
  Trash2,
  Lock,
  ExternalLink
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { organization, refreshOrganization, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'exports' | 'store' | 'compliance'>('profile');

  // Modals for legal & store compliance
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const [name, setName] = useState(organization.name);
  const [businessType, setBusinessType] = useState(organization.businessType || '');
  const [ifuNumber, setIfuNumber] = useState(organization.ifuNumber || '');
  const [rccmNumber, setRccmNumber] = useState(organization.rccmNumber || '');
  const [email, setEmail] = useState(organization.email);
  const [phone, setPhone] = useState(organization.phone);
  const [address, setAddress] = useState(organization.address);
  const [website, setWebsite] = useState(organization.website || '');

  // Invoicing Settings
  const [invoicePrefix, setInvoicePrefix] = useState(organization.settings.invoicePrefix);
  const [quotePrefix, setQuotePrefix] = useState(organization.settings.quotePrefix);
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>(organization.settings.defaultCurrency);
  const [defaultTaxRate, setDefaultTaxRate] = useState<number>(organization.settings.defaultTaxRate);
  const [defaultPaymentTermsDays, setDefaultPaymentTermsDays] = useState<number>(organization.settings.defaultPaymentTermsDays);
  const [paymentInstructions, setPaymentInstructions] = useState(organization.settings.paymentInstructions || '');
  const [templateId, setTemplateId] = useState<DocumentTemplateId>(organization.settings.templateId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedOrg: Organization = {
      ...organization,
      name,
      businessType,
      ifuNumber,
      rccmNumber,
      email,
      phone,
      address,
      website,
      settings: {
        ...organization.settings,
        invoicePrefix,
        quotePrefix,
        defaultCurrency,
        defaultTaxRate,
        defaultPaymentTermsDays,
        paymentInstructions,
        templateId,
      },
    };

    storage.saveOrganization(updatedOrg);
    refreshOrganization();

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const templates: { id: DocumentTemplateId; name: string; desc: string; color: string }[] = [
    { id: 'modern_emerald', name: 'Émeraude Moderne (Défaut)', desc: 'Vert émeraude & ardoise, style Fintech dynamique', color: 'bg-emerald-600' },
    { id: 'bold_indigo', name: 'Indigo SaaS', desc: 'Bleu indigo corporate pour entreprises tech', color: 'bg-indigo-600' },
    { id: 'executive_dark', name: 'Exécutif Sombre & Or', desc: 'En-tête noir ardoise avec touches dorées', color: 'bg-slate-900' },
    { id: 'classic_clean', name: 'Classique Épuré', desc: 'Format standard noir et blanc avec bordures fines', color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            <span>Paramètres, Exports & Stores</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mentions légales, exports comptables, publication Stores (Google Play / App Store) et conformité
          </p>
        </div>

        {savedSuccess && activeSubTab === 'profile' && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Modifications enregistrées !</span>
          </div>
        )}
      </div>

      {/* Main Settings & Reports Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 text-xs font-bold gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Building className="h-4 w-4 shrink-0" />
          <span className="truncate">Identité & Thèmes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('exports')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 transition-all cursor-pointer ${
            activeSubTab === 'exports'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Download className="h-4 w-4 shrink-0" />
          <span className="truncate">Exports Comptables</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('store')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 transition-all cursor-pointer ${
            activeSubTab === 'store'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Smartphone className="h-4 w-4 shrink-0" />
          <span className="truncate">Publication Stores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('compliance')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 transition-all cursor-pointer ${
            activeSubTab === 'compliance'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="truncate">Conformité & Légal</span>
        </button>
      </div>

      {/* Sub-Tab 1: Profile & Legal Settings View */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
          {/* Section 1: Business Profile & Legal */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Identité de l'Entreprise & Mentions Fiscales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nom Commercial ou Raison Sociale * :
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Activité / Secteur :
                </label>
                <input
                  type="text"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  placeholder="Ex: Solutions Digitales & Services Informatiques"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Numéro IFU Bénin (Identifiant Fiscal Unique) * :
                </label>
                <input
                  type="text"
                  value={ifuNumber}
                  onChange={e => setIfuNumber(e.target.value)}
                  placeholder="Ex: 0201910848839"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Numéro RCCM :
                </label>
                <input
                  type="text"
                  value={rccmNumber}
                  onChange={e => setRccmNumber(e.target.value)}
                  placeholder="Ex: RB/COT/20-B-12345"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Téléphone de Contact :
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Professionnel :
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Adresse Physique du Siège :
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Invoicing Parameters */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Paramètres de Numérotation & Taxes</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Préfixe Factures :</label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={e => setInvoicePrefix(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Préfixe Devis :</label>
                <input
                  type="text"
                  value={quotePrefix}
                  onChange={e => setQuotePrefix(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Devise Principale :</label>
                <select
                  value={defaultCurrency}
                  onChange={e => setDefaultCurrency(e.target.value as CurrencyCode)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                >
                  <option value="XOF">Franc CFA (XOF / FCFA)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar US ($)</option>
                  <option value="CAD">Dollar Canadien (CAD)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Taux TVA par Défaut (%) :</label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={e => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Coordonnées & Modalités de Règlement (affichées en bas de chaque facture) :
              </label>
              <textarea
                rows={3}
                value={paymentInstructions}
                onChange={e => setPaymentInstructions(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white outline-hidden focus:border-emerald-500"
                placeholder="Ex: MTN Mobile Money : +229 97 00 00 00 / RIB Bancaire BOA : BJ061 01001..."
              />
            </div>
          </div>

          {/* Section 3: PDF Document Theme Styling */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Thème Graphique des Documents PDF</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {templates.map(t => (
                <div
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    templateId === t.id
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-6 w-full rounded-lg ${t.color} mb-3`} />
                  <h3 className="text-xs font-bold text-white">{t.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save CTA */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer tous les Paramètres</span>
            </button>
          </div>
        </form>
      )}

      {/* Sub-Tab 2: Exports & Reports View */}
      {activeSubTab === 'exports' && (
        <div className="animate-in fade-in">
          <DataExportUtility />
        </div>
      )}

      {/* Sub-Tab 3: Store Publication View */}
      {activeSubTab === 'store' && (
        <div className="animate-in fade-in">
          <StorePublicationHub />
        </div>
      )}

      {/* Sub-Tab 4: Compliance, Privacy & Account Deletion */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Centre de Conformité Légale & Données Personnelles</h2>
                <p className="text-xs text-slate-400">
                  Transparence des données, directives Apple / Google Play et gestion de vos droits
                </p>
              </div>
            </div>

            {/* Legal Documents Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Lock className="h-4 w-4" />
                    <span>Politique de Confidentialité</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Protection des Données (APDP / RGPD)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Découvrez comment vos données d'entreprise et financières sont chiffrées en local et jamais vendues ni partagées avec des tiers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-all cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Consulter la Politique</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <FileText className="h-4 w-4" />
                    <span>Conditions Générales (EULA)</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Contrat d'Utilisation & Abonnement</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Détails des formules tarifaires, du renouvellement automatique et des modalités d'annulation sans engagement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition-all cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Consulter les Conditions</span>
                </button>
              </div>
            </div>

            {/* Apple Guideline 5.1.1(v) & Google Play Account Deletion Section */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Trash2 className="h-4 w-4" />
                <span>Suppression Définitive du Compte (Exigence Obligatoire Stores)</span>
              </div>
              <h3 className="text-sm font-bold text-white">Droit à l'Oubli & Purge Instantanée</h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Conformément aux directives de publication Google Play et Apple App Store (Guideline 5.1.1(v)), vous pouvez à tout moment effacer immédiatement l'intégralité de votre compte, de vos factures et de votre historique client.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeletionModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer Définitivement mon Compte et mes Données</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Modals */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onRequestDeleteAccount={() => {
          setShowPrivacyModal(false);
          setShowDeletionModal(true);
        }}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <AccountDeletionModal
        isOpen={showDeletionModal}
        onClose={() => setShowDeletionModal(false)}
      />
    </div>
  );
};
