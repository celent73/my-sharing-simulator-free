/// <reference types="vite/client" />
/*
 * --------------------------------------------------------------------------
 * COPYRIGHT NOTICE
 * * Copyright (c) 2025 Simulatore Sharing. Tutti i diritti riservati.
 * --------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './utils/supabaseClient';
import { PlanInput, CondoInput, ViewMode } from './types';
import { useCompensationPlan } from './hooks/useSimulation';
import { useCondoSimulation } from './hooks/useCondoSimulation';
import InputPanel from './components/InputPanel';
import CondoInputPanel from './components/CondoInputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import CondoResultsDisplay from './components/CondoResultsDisplay';
import { useSmartState } from './hooks/useSmartState';
import TargetCalculatorModal from './components/TargetCalculatorModal';
import { NetworkVisualizerModal } from './components/NetworkVisualizerModal';
import DetailedGuideModal from './components/DetailedGuideModal';
import ContractInfoModal from './components/ContractInfoModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { InstallModal } from './components/InstallModal';
import FutureTicketModal from './components/FutureTicketModal';

// --- IMPORTAZIONI LEGALI E UI ---
import { LegalFooter } from './components/LegalFooter';
import { LegalModal } from './components/LegalModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PremiumModal } from './components/PremiumModal';
import { InAppBrowserOverlay } from './components/InAppBrowserOverlay';
import { Lock, Copy, Check, PartyPopper, Gem, Building2, ExternalLink, Download, Users } from 'lucide-react';

import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import TargetIcon from './components/icons/TargetIcon';
import { ClientModeIcon, FamilyModeIcon, CondoModeIcon } from './components/icons/ModeIcons';
import { ItalyFlag, GermanyFlag } from './components/icons/Flags';
import CrownIconSVG from './components/icons/CrownIcon';
import BackgroundMesh from './components/BackgroundMesh';
import DisclaimerModal from './components/DisclaimerModal';
import PaymentSuccessModal from './components/PaymentSuccessModal';

const initialInputs: PlanInput = {
  directRecruits: 0, contractsPerUser: 0, indirectRecruits: 0, networkDepth: 1, realizationTimeMonths: 12,
  personalClientsGreen: 0, personalClientsLight: 0, personalClientsBusinessGreen: 0, personalClientsBusinessLight: 0,
  myPersonalUnitsGreen: 0, myPersonalUnitsLight: 0, cashbackSpending: 0, cashbackPercentage: 0
};
const initialCondoInputs: CondoInput = {
  greenUnits: 0,
  lightUnits: 0,
  yearlyNewUnitsGreen: 0,
  yearlyNewUnitsLight: 0,
  familiesPerCondo: 0,
  networkConversionRate: 0,
  managedCondos: 0
};

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isTargetCalcOpen, setIsTargetCalcOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [canInstall, setCanInstall] = useState(false); // New state to track if install is possible
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms' | 'cookie' | 'none'>('none');
  const [legalMode, setLegalMode] = useState<'startup' | 'view'>('startup');

  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFutureTicketOpen, setIsFutureTicketOpen] = useState(false);

  // --- NUOVI STATI PER LA VERIFICA SUPABASE ---
  const [licenseCode, setLicenseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { state: viewMode, set: setViewMode } = useSmartState<ViewMode>('family', 'sim_view_mode_v1');
  const { state: condoInputs, set: setCondoInputs } = useSmartState<CondoInput>(initialCondoInputs, 'condo_sim_state_v1');
  const [isContractInfoModalOpen, setIsContractInfoModalOpen] = useState(false);
  const [cashbackPeriod, setCashbackPeriod] = useState<'monthly' | 'annual'>('monthly');
  const isInitialMount = useRef(true);
  const installTimerRef = useRef<any>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null); // State for the prompt event

  const { language, setLanguage, t } = useLanguage();
  const { state: inputs, set: setInputs, undo, redo, canUndo, canRedo, reset } = useSmartState<PlanInput>(initialInputs, 'sim_state_v1');

  const planResult = useCompensationPlan(inputs, viewMode);
  const condoResult = useCondoSimulation(condoInputs, planResult);

  const targetButtonText = language === 'it' ? "Calcola Obiettivo" : "Ziel berechnen";

  useEffect(() => {
    // CONTROLLO PREMIUM LOCALSTORAGE
    const savedPremium = localStorage.getItem('is_premium');
    if (savedPremium === 'true') {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }

    const query = new URLSearchParams(window.location.search);
    // GESTIONE RITORNO DAL PAGAMENTO
    if (query.get('payment_success') === 'true') {
      setShowSuccessModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const hasAccepted = localStorage.getItem('legal_accepted');
    if (!hasAccepted) {
      setLegalDocType('none');
      setLegalMode('startup');
      setShowLegalModal(true);
    }
  }, []);

  // --- FUNZIONE DI VERIFICA REALE (CONTEGGIO DISPOSITIVI) ---
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. CERCA IL CODICE (Gestisce duplicati prendendo il primo)
      const { data: licenses, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('code', licenseCode.trim()); // Rimosso .single() per evitare errori su duplicati

      if (error || !licenses || licenses.length === 0) {
        setError('Codice non valido o scaduto.');
        setLoading(false);
        return;
      }

      const data = licenses[0]; // Usiamo il primo record trovato

      // 2. CONTROLLA IL LIMITE (Dinamico da DB o Default 3)
      const currentUses = data.uses || 0;
      const maxUses = data.max_uses || 3; // Usa il valore dal DB o 3 di default

      if (currentUses >= maxUses) {
        setError(`Hai raggiunto il limite massimo di ${maxUses} dispositivi per questa licenza.`);
        setLoading(false);
        return;
      }

      // 3. AGGIORNA IL CONTATORE (+1)
      const { error: updateError } = await supabase
        .from('licenses')
        .update({ uses: currentUses + 1 })
        .eq('id', data.id);

      if (updateError) {
        console.error("Errore aggiornamento contatore (RLS?):", updateError);
        // Continuiamo lo stesso se l'errore è solo di update ma il codice era valido,
        // oppure puoi bloccare. Per ora sblocchiamo per non frustrare l'utente se la RLS non va.
      }

      // 4. SBLOCCA L'APP
      setIsPremium(true);
      localStorage.setItem('is_premium', 'true');
      localStorage.setItem('licenseCode', licenseCode);
      setShowPremiumModal(false);
      alert("Codice valido! App sbloccata su questo dispositivo.");

    } catch (err) {
      console.error(err);
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptLegal = () => {
    localStorage.setItem('legal_accepted', 'true');
    setShowLegalModal(false);
  };

  const handleOpenLegalDoc = (type: 'privacy' | 'terms' | 'cookie') => {
    setLegalDocType(type);
    setLegalMode('view');
    setShowLegalModal(true);
  };

  useEffect(() => { if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true || document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      // Removed automatic setShowInstallModal from here to avoid showing it prematurely/incorrectly
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    // Logic to show install modal
    const handleInstallCheck = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (isStandaloneMode) return;

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(userAgent);

      // If iOS, show it (manual instructions)
      if (isIos) {
        // Small delay to let user see app first
        installTimerRef.current = setTimeout(() => {
          setShowInstallModal(true);
        }, 5000);
      } else {
        // For Android/Desktop: Check if we have the prompt
        // @ts-ignore
        if (window.deferredPrompt) {
          setCanInstall(true);
          // @ts-ignore
          setInstallPrompt(window.deferredPrompt); // Sync state
          installTimerRef.current = setTimeout(() => {
            setShowInstallModal(true);
          }, 5000);
        }
      }
    };

    // Check on mount (for iOS mainly) or if prompt was already captured
    handleInstallCheck();

    // Listen for dynamic event (Android/Desktop)
    const installHandler = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
      setInstallPrompt(e); // Sync state
      // @ts-ignore
      window.deferredPrompt = e;

      // Clear previous timer if exists to restart or just ensure single trigger
      if (installTimerRef.current) clearTimeout(installTimerRef.current);

      installTimerRef.current = setTimeout(() => {
        setShowInstallModal(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', installHandler);

    return () => {
      window.removeEventListener('resize', checkStandalone);
      window.removeEventListener('beforeinstallprompt', installHandler);
      if (installTimerRef.current) clearTimeout(installTimerRef.current);
    };
  }, []);

  useEffect(() => { setIsPremiumUnlocked(true); setIsTrialExpired(false); }, []);
  useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; return; } if (inputs.contractsPerUser === 2) { setIsContractInfoModalOpen(true); } }, [inputs.contractsPerUser]);

  const handleTitleClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) { setShowPremiumModal(true); setSecretClickCount(0); }
  };

  const handleInputChange = (field: keyof PlanInput, value: number | any) => {
    if (field === 'realizationTimeMonths') {
      setInputs({ ...inputs, [field]: value });
      return;
    }
    if (field === 'cashbackDetails') {
      setInputs(prev => ({ ...prev, cashbackDetails: value }));
      return;
    }
    if (!isPremium) {
      if (field === 'directRecruits' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'indirectRecruits' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'networkDepth' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'contractsPerUser' && value > 1) { setShowPremiumModal(true); return; }
      if (field === 'cashbackSpending' && value > 500) { setShowPremiumModal(true); return; }
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCondoInputChange = (field: keyof CondoInput, value: number) => setCondoInputs(prev => ({ ...prev, [field]: value }));

  const handleResetToZero = () => {
    if (!isPremium) { setShowPremiumModal(true); return; }
    setInputs({
      directRecruits: 0,
      contractsPerUser: 0,
      indirectRecruits: 0,
      networkDepth: 1,
      realizationTimeMonths: 12,
      personalClientsGreen: 0,
      personalClientsLight: 0,
      personalClientsBusinessGreen: 0,
      personalClientsBusinessLight: 0,
      myPersonalUnitsGreen: 0,
      myPersonalUnitsLight: 0,
      cashbackSpending: 0,
      cashbackPercentage: 0
    });
  };

  const handleResetPersonalClients = () => { setInputs({ ...inputs, personalClientsGreen: 0, personalClientsLight: 0, personalClientsBusinessGreen: 0, personalClientsBusinessLight: 0, myPersonalUnitsGreen: 0, myPersonalUnitsLight: 0, unionParkPanels: 0 }); };
  const handleCondoReset = () => setCondoInputs({ ...initialCondoInputs });
  const handleApplyTarget = (updates: Partial<PlanInput>) => setInputs({ ...inputs, ...updates });
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'it' ? 'de' : 'it');

  const handleModeChange = (mode: ViewMode) => {
    if (mode === 'condo' && !isPremium) { setShowPremiumModal(true); return; }
    setViewMode(mode);
  };

  const handleTargetClick = () => {
    if (!isPremium) { setShowPremiumModal(true); return; }
    setIsTargetCalcOpen(true);
  };

  const headerShadow = language === 'it'
    ? '-30px 0 80px -5px rgba(0, 146, 70, 0.9), 30px 0 80px -5px rgba(206, 43, 55, 0.9), 0 0 50px -10px rgba(255, 255, 255, 0.8)'
    : '-30px 0 80px -5px rgba(0, 0, 0, 0.95), 30px 0 80px -5px rgba(255, 204, 0, 0.9), 0 0 50px -10px rgba(221, 0, 0, 0.8)';

  return (
    <div className={`min-h-screen bg-transparent text-gray-800 dark:text-gray-200 transition-colors duration-300 relative flex flex-col overflow-x-hidden`}>
      <BackgroundMesh />



      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUnlock={handleVerifyCode} // <-- USIAMO LA NUOVA FUNZIONE
        licenseCode={licenseCode}   // <-- PASSIAMO GLI STATI
        setLicenseCode={setLicenseCode}
        loading={loading}
        error={error}
        forceLock={false}
      />

      <InAppBrowserOverlay />
      {showLegalModal && <LegalModal isOpen={showLegalModal} onAccept={handleAcceptLegal} onClose={() => setShowLegalModal(false)} type={legalDocType} mode={legalMode} />}
      <PaymentSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <ScrollToTopButton />

      <div className={`container mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex-grow ${isTrialExpired ? 'blur-sm pointer-events-none select-none h-screen overflow-hidden' : ''}`}>

        <header className="flex flex-col gap-4 mb-8 rounded-3xl p-6 border-0 shadow-xl backdrop-blur-xl transition-all duration-500 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0077c8 0%, #005596 100%)', boxShadow: headerShadow }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="flex items-center gap-3">
                <h1 onClick={handleTitleClick} className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-sm select-none cursor-pointer active:scale-95 transition-transform flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  {language === 'it' ? <ItalyFlag /> : <GermanyFlag />}
                  {t('app.title')} <span className="text-union-orange-400">Sharing</span>
                  {isPremium && <span className="ml-2 animate-bounce inline-block"><CrownIconSVG className="w-8 h-8 text-union-orange-400" /></span>}
                </h1>
                {isCreatorMode && <span className="hidden sm:inline-flex bg-white/20 backdrop-blur-md text-white border border-white/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">Creator Mode</span>}
                {viewMode === 'client' && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-100/90 text-purple-700 border border-purple-200 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/20 uppercase tracking-wider ml-1 sm:ml-2 animate-in fade-in zoom-in duration-300">
                    <Gem size={14} className="text-purple-600" />
                    <span className="hidden sm:inline">{t('app.client_priv')}</span>
                    <span className="sm:hidden">{t('app.client_priv_short')}</span>
                  </span>
                )}
                {viewMode === 'condo' && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-wider ml-1 sm:ml-2 animate-in fade-in zoom-in duration-300">
                    <Building2 size={14} className="text-emerald-600" />
                    <span className="hidden sm:inline">{t('app.admin_condo')}</span>
                    <span className="sm:hidden">{t('app.admin_condo_short')}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 md:mt-0">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white text-union-blue-600 hover:bg-gray-100 transition-all shadow-lg border-0 hover:scale-105" title="Cambia Tema"><div className="scale-90">{isDarkMode ? <SunIcon /> : <MoonIcon />}</div></button>
              <button onClick={toggleLanguage} className="p-2.5 rounded-xl bg-white border-0 shadow-lg hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center min-w-[48px]">{language === 'it' ? <ItalyFlag /> : <GermanyFlag />}</button>

              <button
                onClick={() => window.open('https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true', '_blank')}
                className="p-2.5 rounded-xl bg-white text-union-blue-600 hover:bg-gray-100 transition-all shadow-lg border-0 hover:scale-105 flex items-center justify-center"
                title="Vai allo Store"
              >
                <ExternalLink size={20} />
              </button>

              <div className="w-px h-8 bg-white/30 mx-1 hidden sm:block"></div>

              <button onClick={() => setIsHelpOpen(true)} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-white text-union-blue-600 rounded-xl shadow-lg hover:bg-gray-100 transition-all border-0 font-bold text-sm hover:scale-[1.02]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                <span className="hidden sm:inline">{t('app.guide')}</span>
              </button>

              {!isPremium && <button onClick={() => setShowPremiumModal(true)} className="flex items-center justify-center w-auto px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all font-bold text-sm border border-yellow-300">Sblocca PRO</button>}

              {!isStandalone && (canInstall || /iphone|ipad|ipod|android/i.test(window.navigator.userAgent.toLowerCase())) && (
                <button onClick={() => setShowInstallModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all font-bold text-sm border border-gray-700 animate-pulse">
                  <Download size={18} />
                  <span className="hidden lg:inline">Scarica App</span>
                </button>
              )}

              {viewMode === 'family' && (
                <>
                  {/* 'Struttura' button removed as per user request */}
                  <button onClick={handleTargetClick} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.6)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all border border-white/20 font-black text-sm hover:scale-[1.05] active:scale-95 animate-pulse-slow">
                    <TargetIcon />
                    <span className="hidden sm:inline ml-2 drop-shadow-md uppercase tracking-wide">{targetButtonText}</span>
                  </button>
                  <button
                    onClick={() => setIsFutureTicketOpen(true)}
                    className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all border border-white/20 font-black text-sm hover:scale-110 active:scale-95 relative group overflow-hidden animate-pulse"
                    title="Il tuo biglietto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:animate-shimmer" style={{ animationDuration: '1.5s' }}></div>
                    <span className="text-xl">🎫</span>
                    <span className="hidden sm:inline ml-2 drop-shadow-md uppercase tracking-wide italic">TICKET</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-blue-100 font-medium text-[10px] sm:text-sm md:text-base -mt-2 pl-1 relative z-10 opacity-90 text-center md:text-left max-w-xs md:max-w-none mx-auto md:mx-0 leading-tight">{t('app.subtitle')}</p>
        </header>

        {/* ... RESTO DEL COMPONENTE ... */}
        <div className="flex justify-center mb-8 relative z-20">
          <div className="relative p-1.5 rounded-2xl flex w-full sm:w-auto sm:min-w-[340px] border-2 border-white/20 shadow-[0_0_30px_rgba(0,119,200,0.6)] bg-gradient-to-r from-union-blue-600 to-union-blue-500">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(33.333%-6px)] rounded-xl shadow-lg bg-white transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${viewMode === 'client' ? 'left-1.5 translate-x-0' : viewMode === 'family' ? 'left-1.5 translate-x-[100%]' : 'left-1.5 translate-x-[200%]'}`} />
            <button onClick={() => handleModeChange('client')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none"><div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'client' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'client' ? '' : 'brightness-0 invert'}><ClientModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.client')}</span></div></button>
            <button onClick={() => handleModeChange('family')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none"><div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'family' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'family' ? '' : 'brightness-0 invert'}><FamilyModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.family')}</span></div></button>
            <button onClick={() => handleModeChange('condo')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none">
              {!isPremium && <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full z-20 shadow-sm"><Lock size={10} /></div>}
              <div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'condo' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'condo' ? '' : 'brightness-0 invert'}><CondoModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.condo')}</span></div>
            </button>
          </div>
        </div>

        <main key={viewMode} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="md:col-span-1 lg:col-span-1 min-w-0">
            {viewMode === 'condo' ? (
              <CondoInputPanel inputs={condoInputs} onInputChange={handleCondoInputChange} onReset={handleCondoReset} />
            ) : (
              <InputPanel
                inputs={inputs}
                viewMode={viewMode}
                onInputChange={handleInputChange}
                onReset={handleResetToZero}
                onResetPersonalClients={handleResetPersonalClients}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                cashbackPeriod={cashbackPeriod}
                setCashbackPeriod={setCashbackPeriod}
              />
            )}
          </div>
          <div className="md:col-span-1 lg:col-span-2 relative min-w-0">
            {!isPremium && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-20 flex items-center justify-center pointer-events-none">
                <div className="bg-union-blue-600/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md pointer-events-auto cursor-pointer" onClick={() => setShowPremiumModal(true)}>
                  <Lock size={16} /> <span>Sblocca Analisi Completa</span>
                </div>
              </div>
            )}
            {viewMode === 'condo' ? (
              <CondoResultsDisplay results={condoResult} />
            ) : (
              <ResultsDisplay planResult={planResult} viewMode={viewMode} inputs={inputs} cashbackPeriod={cashbackPeriod} />
            )}
          </div>
        </main>
      </div>

      <div className="mt-12"><LegalFooter onOpenLegal={handleOpenLegalDoc} /></div>
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
      <DetailedGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <TargetCalculatorModal isOpen={isTargetCalcOpen} onClose={() => setIsTargetCalcOpen(false)} currentInputs={inputs} onApply={handleApplyTarget} />
      <NetworkVisualizerModal isOpen={isNetworkModalOpen} onClose={() => setIsNetworkModalOpen(false)} inputs={inputs} onInputChange={handleInputChange} onReset={handleResetToZero} />
      <ContractInfoModal isOpen={isContractInfoModalOpen} onClose={() => setIsContractInfoModalOpen(false)} />
      <FutureTicketModal
        isOpen={isFutureTicketOpen}
        onClose={() => setIsFutureTicketOpen(false)}
        monthlyRecurring={planResult?.monthlyData?.length > 0 ? planResult.monthlyData[planResult.monthlyData.length - 1].monthlyRecurring : 0}
        estimatedMonths={inputs.realizationTimeMonths}
        userName={isPremium ? "Partner Pro" : "Guest"}
      />
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} installPrompt={installPrompt} />
    </div>
  );
};

const App = () => { return <LanguageProvider><AppContent /></LanguageProvider>; }

export default App;
