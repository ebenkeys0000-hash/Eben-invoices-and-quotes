import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Sparkles, 
  Check, 
  FileText, 
  CreditCard, 
  WifiOff, 
  ShieldCheck, 
  FileSpreadsheet,
  QrCode,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const StoreScreenshotsPreview: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Devis & Factures Professionnels',
      subtitle: 'Création en 30 secondes & Export PDF vectoriel A4',
      badge: 'Capture d\'écran 1/5 • Store Ready',
      color: 'from-emerald-600 to-teal-800',
      tagline: 'Générez des factures conformes avec votre logo et vos couleurs',
      content: (
        <div className="space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                E
              </div>
              <span className="text-[11px] font-bold text-white">EBEN TECH SARL</span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              FAC-2026-0042
            </span>
          </div>

          <div className="text-[10px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Client :</span>
              <span className="text-white font-medium">SOBEPEC SARL (Cotonou)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>IFU :</span>
              <span className="text-amber-400 font-mono">3202112345678</span>
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-800 pt-2 text-[10px]">
            <div className="flex justify-between text-slate-300">
              <span>Maintenance Serveurs Cloud</span>
              <span className="font-mono">150 000 F</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Licence Logicielle Annuelle</span>
              <span className="font-mono">200 000 F</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[11px]">
            <span className="font-bold text-slate-300">Total TTC (TVA 18%)</span>
            <span className="font-mono font-black text-emerald-400 text-sm">413 000 XOF</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Encaissements Mobile Money & Cartes',
      subtitle: 'MTN MoMo (*880#), Moov Money (*855#) & FedaPay',
      badge: 'Capture d\'écran 2/5 • Store Ready',
      color: 'from-amber-600 to-orange-800',
      tagline: 'Recevez vos règlements instantanément et envoyez le reçu WhatsApp',
      content: (
        <div className="space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white">Règlement Reçu</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              Confirmé ✓
            </span>
          </div>

          <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-400 font-bold block">MONTANT ENCAISSÉ</span>
            <span className="font-mono text-xl font-black text-white">413 000 FCFA</span>
            <span className="text-[9px] text-slate-400 block mt-1">via MTN MoMo (+229 97 45 60 12)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-300 font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Réf :</span>
              <span className="text-slate-200">PAY-MOMO-9418</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Solde Dû :</span>
              <span className="text-emerald-400 font-bold">0 FCFA</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Mode 100% Hors-Ligne (Offline)',
      subtitle: 'Facturez sur le terrain même sans connexion internet',
      badge: 'Capture d\'écran 3/5 • Store Ready',
      color: 'from-blue-600 to-indigo-800',
      tagline: 'Synchronisation automatique et transparente dès le retour du réseau',
      content: (
        <div className="space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
            <WifiOff className="h-4 w-4" />
            <span>Mode Hors-Ligne Actif</span>
          </div>

          <p className="text-[10px] text-slate-300">
            3 nouvelles factures créées en local. Vos données sont sécurisées sur cet appareil.
          </p>

          <div className="space-y-1.5 text-[9px]">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-200">FAC-2026-0043 (Pharmacie du Port)</span>
              <span className="text-blue-400 font-medium">En attente synchro</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-200">FAC-2026-0044 (Bénin Transit)</span>
              <span className="text-blue-400 font-medium">En attente synchro</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-1">
            <Check className="h-3.5 w-3.5" />
            <span>Synchronisation automatique prête</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Conformité Fiscale Bénin & QR Code',
      subtitle: 'Numéros IFU, RCCM, TVA UEMOA 18% & Sécurisation',
      badge: 'Capture d\'écran 4/5 • Store Ready',
      color: 'from-purple-600 to-violet-800',
      tagline: 'Respectez toutes les obligations de la Direction Générale des Impôts',
      content: (
        <div className="space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white">Mentions Légales Obligatoires</span>
            <QrCode className="h-5 w-5 text-purple-400" />
          </div>

          <div className="space-y-1 text-[9px] font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300">
            <div><span className="text-slate-500">IFU Émetteur :</span> 3201910847291</div>
            <div><span className="text-slate-500">RCCM :</span> RB/COT/20-B-12849</div>
            <div><span className="text-slate-500">Taux TVA :</span> 18% (Régime Réel UEMOA)</div>
            <div><span className="text-slate-500">QR Code :</span> SHA-256 Validé ✓</div>
          </div>

          <div className="rounded-lg bg-purple-950/30 p-2 border border-purple-500/30 text-[9px] text-purple-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-purple-400" />
            <span>Prêt pour l'intégration e-MECeF / DGI Bénin</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Exports Comptables SYSCOHADA',
      subtitle: 'Grand Livre, Journal des Ventes & Répertoire Clients',
      badge: 'Capture d\'écran 5/5 • Store Ready',
      color: 'from-pink-600 to-rose-800',
      tagline: 'Transmettez directement vos écritures comptables à votre expert-comptable',
      content: (
        <div className="space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white">Journal des Ventes</span>
            <FileSpreadsheet className="h-4 w-4 text-pink-400" />
          </div>

          <div className="space-y-1 text-[9px] font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300">
            <div className="flex justify-between"><span className="text-slate-400">411000 Clients (Débit) :</span> <span className="text-white">413 000 F</span></div>
            <div className="flex justify-between"><span className="text-slate-400">706000 Services (Crédit) :</span> <span className="text-white">350 000 F</span></div>
            <div className="flex justify-between"><span className="text-slate-400">443100 TVA Facturée (Crédit) :</span> <span className="text-white">63 000 F</span></div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold pt-1">
            <span>Équilibre Débit / Crédit</span>
            <span>0,00 F (Parfait) ✓</span>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[activeSlide];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Générateur de Captures d'Écran Officielles (Store Mockups)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Visuels marketing optimisés pour Google Play (1080x2400) et Apple App Store (iPhone 6.7" & 5.5")
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-300">
            {activeSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Screen Frame Simulation Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
        {/* Smartphone Mockup */}
        <div className="relative w-[280px] sm:w-[310px] rounded-[42px] border-[6px] border-slate-700 bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-600/30">
          {/* Dynamic Island / Notch */}
          <div className="mx-auto mb-3 h-4 w-24 rounded-full bg-slate-800 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-950 mr-2" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Screenshot Content Canvas */}
          <div className={`rounded-3xl bg-gradient-to-b ${slide.color} p-4 text-center text-white space-y-4 shadow-inner min-h-[460px] flex flex-col justify-between`}>
            <div>
              <span className="inline-block rounded-full bg-black/30 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs">
                EBEN INVOICES
              </span>
              <h4 className="mt-2 text-base font-black leading-tight tracking-tight">
                {slide.title}
              </h4>
              <p className="mt-1 text-[10px] text-white/80 font-medium">
                {slide.subtitle}
              </p>
            </div>

            {/* In-app mockup card */}
            <div className="my-auto">
              {slide.content}
            </div>

            {/* Bottom Tagline */}
            <div className="rounded-xl bg-black/40 p-2 text-[9px] text-white/90 font-semibold backdrop-blur-xs">
              {slide.tagline}
            </div>
          </div>

          {/* Home indicator bar */}
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-slate-700" />
        </div>

        {/* Details & Copy tools */}
        <div className="max-w-md space-y-4 text-xs text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 block">{slide.badge}</span>
            <h4 className="text-sm font-bold text-white">{slide.title}</h4>
            <p className="text-slate-400">{slide.subtitle}</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Spécifications pour les Stores :</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li><strong>Google Play Store :</strong> 1080 x 2400 px (Format 16:9 ou 20:9), PNG sans transparence.</li>
              <li><strong>Apple App Store 6.7" (iPhone 15/16 Pro Max) :</strong> 1290 x 2796 px.</li>
              <li><strong>Apple App Store 6.5" / 5.5" :</strong> 1242 x 2688 px & 1242 x 2208 px.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  idx === activeSlide
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Slide {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
