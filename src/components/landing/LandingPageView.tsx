import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  FileText, 
  Lock, 
  Building, 
  Zap, 
  Globe, 
  Download, 
  Printer, 
  Check, 
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  CreditCard,
  WifiOff,
  UserCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { AuthModal } from './AuthModal';

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenNewInvoice?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  const { organization, currentUser, setCurrentUser, setViewMode } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleStartFree = () => {
    onEnterApp();
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(
      "Bonjour EBEN Technologies SARL, je souhaite des informations sur votre logiciel de facturation professionnelle pour mon entreprise au Bénin."
    );
    window.open(`https://wa.me/22997456012?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs font-semibold py-2 px-4 text-center border-b border-blue-500/30 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span>🇧🇯 <strong>EBEN Technologies SARL</strong> — Logiciel de Facturation Conforme UEMOA & DGI Bénin</span>
        <span className="hidden sm:inline opacity-80">• Support Local à Abomey-Calavi & Cotonou</span>
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Placeholder: EBEN Technologies SARL */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-0.5 shadow-lg shadow-blue-900/40 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="font-mono font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                  E
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  EBEN <span className="text-blue-400">TECHNOLOGIES</span>
                </span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  SARL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                Facturation & Solutions Digitales • Bénin
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">
              Fonctionnalités
            </a>
            <a href="#trust" className="hover:text-blue-400 transition-colors">
              Sécurité & Entreprises
            </a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">
              Tarifs
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">
              Contact & Siège
            </a>
            <button 
              onClick={handleWhatsAppChat}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp 24/7</span>
            </button>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-blue-400" />
              <span>Espace Client</span>
            </button>

            <button
              onClick={handleStartFree}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 transition-all cursor-pointer transform active:scale-95"
            >
              <span>Accéder à l'App</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH 3 TRUST BADGES */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-4 py-1.5 text-xs font-bold text-blue-300 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>La solution de gestion commerciale N°1 au Bénin</span>
            </div>
          </div>

          {/* Hero Main Heading & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Facturation Professionnelle pour le Bénin
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Créez des factures et devis normalisés IFU en 30 secondes, encaissez par 
              <strong className="text-white"> MTN Mobile Money</strong> et <strong className="text-white">Moov Money</strong>, 
              et gérez votre entreprise en toute conformité fiscale à Cotonou, Abomey-Calavi et dans tout le Bénin.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={handleStartFree}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-900/50 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer transform active:scale-95"
              >
                <span>Démarrer Gratuitement</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleWhatsAppChat}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-6 py-4 text-sm font-bold text-emerald-300 hover:bg-emerald-900/40 transition-all cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Assistance WhatsApp 24/7</span>
              </button>
            </div>
          </div>

          {/* 3 TRUST BADGES (Requested by User) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-14 max-w-5xl mx-auto">
            
            {/* Badge 1: 100% Sécurisé */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/50 to-slate-900/90 p-6 shadow-xl shadow-blue-950/40 flex items-start gap-4 transition-all hover:border-blue-400/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>100% Sécurisé</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">PCI-DSS</span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chiffrement bancaire AES-256, sauvegarde cloud & locale, conformité avec l'APDP Bénin. Vos données financières restent strictement confidentielles.
                </p>
              </div>
            </div>

            {/* Badge 2: Utilisé par 50+ entreprises au Bénin */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/50 to-slate-900/90 p-6 shadow-xl shadow-blue-950/40 flex items-start gap-4 transition-all hover:border-blue-400/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>Utilisé par 50+ entreprises au Bénin</span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Adopté par les PME, commerçants, consultants et prestataires à Cotonou, Abomey-Calavi, Porto-Novo et Parakou pour structurer leur trésorerie.
                </p>
              </div>
            </div>

            {/* Badge 3: Support WhatsApp 24/7 */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-slate-900/90 p-6 shadow-xl shadow-emerald-950/30 flex items-start gap-4 transition-all hover:border-emerald-400/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>Support WhatsApp 24/7</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">+229</span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Une équipe locale basée à Abomey-Calavi disponible 24h/24 et 7j/7 pour vous assister et configurer vos documents d'entreprise.
                </p>
              </div>
            </div>

          </div>

          {/* 4. INTERACTIVE LIVE PRODUCT PREVIEW (WAVE-BLUE STYLE) */}
          <div className="mt-16 rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-6 shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Mac Browser Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[11px] font-mono text-slate-400 hidden sm:inline">
                  https://app.eben-tech.bj • EBEN Invoices & Quotes v2.4 (Abomey-Calavi)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Mode 100% Hors-Ligne & Cloud Actif</span>
              </div>
            </div>

            {/* Dashboard Snapshot Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left: Key Metrics Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Chiffre d'Affaires</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">+34% ce mois</span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono">14 750 000 FCFA</p>
                  <p className="text-xs text-slate-400 mt-1">95% encaissés par MTN MoMo & Virement BOA</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Factures Émises :</span>
                    <strong className="text-white font-mono">104 factures</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taux d'Encaissement :</span>
                    <strong className="text-emerald-400 font-mono">92.4%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TVA Collectée (18%) :</span>
                    <strong className="text-blue-400 font-mono">2 655 000 FCFA</strong>
                  </div>
                </div>

                <button
                  onClick={handleStartFree}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <span>Créer une Facture Pro</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Center & Right: Live Beninese Invoice Preview */}
              <div className="lg:col-span-2 rounded-2xl bg-white text-slate-900 p-5 sm:p-7 shadow-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                        E
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        EBEN TECHNOLOGIES SARL
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      N° IFU : 3201948572834 • RCCM : RB/ABC/22 B 31094
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Carrefour IITA, Tankpè, Abomey-Calavi, Bénin • Tél : +229 97 45 60 12
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block rounded-lg bg-blue-50 text-blue-800 px-2.5 py-1 text-xs font-bold border border-blue-200">
                      FACTURE N° FAC-2026-104
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Émise le 27/08/2026 • Client : Bénin Digital Hub SARL</p>
                  </div>
                </div>

                {/* Items Sample */}
                <div className="my-3 text-xs">
                  <div className="grid grid-cols-12 font-bold text-slate-700 bg-slate-100 py-1.5 px-2 rounded-md">
                    <span className="col-span-6">Désignation</span>
                    <span className="col-span-2 text-center">Qté</span>
                    <span className="col-span-4 text-right">Total HT</span>
                  </div>
                  <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 text-slate-800">
                    <span className="col-span-6 font-medium">Développement Plateforme Web & Intégration MoMo</span>
                    <span className="col-span-2 text-center">1</span>
                    <span className="col-span-4 text-right font-mono font-bold">1 500 000 FCFA</span>
                  </div>
                  <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 text-slate-800">
                    <span className="col-span-6 font-medium">Maintenance & Hébergement Sécurisé (Annuel)</span>
                    <span className="col-span-2 text-center">1</span>
                    <span className="col-span-4 text-right font-mono font-bold">350 000 FCFA</span>
                  </div>
                </div>

                {/* Invoice Footer Total */}
                <div className="flex justify-between items-center bg-slate-950 text-white rounded-xl p-3 mt-3">
                  <span className="text-xs font-bold uppercase text-slate-300">Net à Payer TTC :</span>
                  <span className="text-lg font-black font-mono text-blue-400">2 183 000 FCFA</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. LOCAL COMPANIES SOCIAL PROOF */}
      <section id="trust" className="py-14 border-y border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Ils gèrent leur facturation avec EBEN Technologies SARL à travers le Bénin
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl">
              <Building className="h-4 w-4 text-blue-400" />
              <span>Atlantique Conseil SARL (Cotonou)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl">
              <Building className="h-4 w-4 text-blue-400" />
              <span>Calavi Digital Agency (Tankpè)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl">
              <Building className="h-4 w-4 text-blue-400" />
              <span>Bénin Agro-Logistics (Sèmè-Kpodji)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl">
              <Building className="h-4 w-4 text-blue-400" />
              <span>Bohicon Distribution UEMOA</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES IN WAVE-BLUE STYLE */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Tout ce dont votre entreprise a besoin pour facturer sereinement
          </h2>
          <p className="text-sm text-slate-400">
            Conçu sur mesure pour les réalités économiques et fiscales de la République du Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Factures & Devis Normalisés</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Générez en quelques clics des factures avec mentions légales obligatoires (Numéro IFU, RCCM, calcul automatique de la TVA à 18% UEMOA).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">MTN MoMo & Moov Money</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intégration directe des numéros marchands Mobile Money. Vos clients reçoivent la demande de paiement directement sur leur téléphone.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <WifiOff className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mode 100% Hors-Ligne Réel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pas d'internet ? Pas de problème. Émettez des factures sur le terrain en continu. Tout se synchronise automatiquement dès le retour du réseau.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Exports Comptables & DGI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exportez vos journaux des ventes, bordereaux de TVA et listes clients en fichiers Excel et CSV compatibles avec les logiciels des experts-comptables.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Envoi WhatsApp Instantané</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transmettez vos devis et factures en 1 clic directement sur le compte WhatsApp de vos clients avec un message professionnel pré-rédigé.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Printer className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Impression PDF Haute Résolution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mise en page A4 ultra-nette avec en-tête d'entreprise, logo, cachet, coordonnées bancaires BOA / Ecobank et mentions fiscales légales.
            </p>
          </div>

        </div>
      </section>

      {/* 7. PRICING SECTION (WAVE SPIRIT) */}
      <section id="pricing" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Tarification Simple et Transparente
            </h2>
            <p className="text-sm text-slate-400">
              Aucun frais caché, aucun engagement. Paiement facile par MTN MoMo ou Moov Money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Free Tier */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-slate-300 bg-slate-800">
                  Formule Découverte
                </div>
                <h3 className="text-3xl font-black text-white font-mono">0 FCFA</h3>
                <p className="text-xs text-slate-400">
                  Idéal pour tester la solution et émettre vos premières factures en toute simplicité.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Jusqu'à 5 factures & 5 devis complets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>En-tête et mentions IFU / Bénin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Téléchargement PDF & Impression A4</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Mode Hors-Ligne local</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStartFree}
                className="w-full py-3.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Démarrer Gratuitement
              </button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl border-2 border-blue-500 bg-gradient-to-b from-blue-950/60 to-slate-950 p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-blue-950/60">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Recommandé pour les Entreprises
              </div>

              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30">
                  Formule Entreprise Illimitée
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-white font-mono">10 000 FCFA</h3>
                  <span className="text-xs text-slate-400">/ mois</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tout illimité pour propulser votre entreprise béninoise sans aucune contrainte.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-blue-900/60">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-400" />
                    <strong className="text-white">Factures & Devis illimités</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Intégration MTN MoMo & Moov automatique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Multi-utilisateurs (Comptables & Commerciaux)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Exports Comptables Excel / CSV DGI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <strong className="text-emerald-300">Support WhatsApp 24/7 Dédié</strong>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStartFree}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-black text-white shadow-lg shadow-blue-900/50 transition-all cursor-pointer"
              >
                Activer l'Accès Entreprise
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. WHATSAPP & DIRECT CONTACT BANNER */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-blue-950/70 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Assistance Directe & Démonstration</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Une question ? Notre équipe locale à Abomey-Calavi vous répond.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Contactez directement notre direction technique et support par WhatsApp au <strong>+229 97 45 60 12</strong> pour une démonstration personnalisée ou une assistance à la mise en place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleWhatsAppChat}
              className="flex items-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-xs font-black text-white shadow-xl shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Discuter sur WhatsApp</span>
            </button>

            <button
              onClick={handleOpenLogin}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-6 py-3.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
            >
              <span>Se Connecter</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. CORPORATE FOOTER (EBEN TECHNOLOGIES SARL) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-14 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-black text-sm">
                  E
                </div>
                <span className="font-black text-sm text-white">
                  EBEN TECHNOLOGIES SARL
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Société de solutions numériques et d'ingénierie logicielle enregistrée en République du Bénin.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                RCCM : RB/ABC/22 B 31094<br />
                N° IFU : 3201948572834
              </p>
            </div>

            {/* Col 2: Siège & Localisation */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Siège Social & Contact
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Carrefour IITA, Quartier Tankpè<br />
                Commune d'Abomey-Calavi<br />
                République du Bénin
              </p>
              <p className="text-xs text-slate-300 pt-1">
                Tél : <strong className="text-white">+229 97 45 60 12</strong>
              </p>
              <p className="text-xs text-slate-300">
                Email : <span className="text-blue-400">contact@eben-tech.bj</span>
              </p>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Plateforme & Services
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={handleStartFree} className="hover:text-blue-400 cursor-pointer">
                    Éditeur de Factures
                  </button>
                </li>
                <li>
                  <button onClick={handleStartFree} className="hover:text-blue-400 cursor-pointer">
                    Éditeur de Devis
                  </button>
                </li>
                <li>
                  <button onClick={handleStartFree} className="hover:text-blue-400 cursor-pointer">
                    Encaissements Mobile Money
                  </button>
                </li>
                <li>
                  <button onClick={handleStartFree} className="hover:text-blue-400 cursor-pointer">
                    Exports Comptables UEMOA
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Badges */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Conformité & Sécurité
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Sécurisé (Chiffrement 256-bit)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>50+ Entreprises au Bénin</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>Support WhatsApp 24/7</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>
              © 2026 <strong>EBEN Technologies SARL</strong>. Tous droits réservés. Abomey-Calavi, Bénin.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Facturation Conforme DGI & UEMOA</span>
              <span>•</span>
              <span>Protection des Données APDP</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            onEnterApp();
          }}
        />
      )}

    </div>
  );
};
