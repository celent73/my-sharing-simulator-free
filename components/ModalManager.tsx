import React, { Suspense, lazy } from 'react';
import { useModal, ModalKey } from '../contexts/ModalContext';

// Import critical modals directly
import { LegalModal } from './LegalModal';
import { PremiumModal } from './PremiumModal';
import { BroadcastModal } from './BroadcastModal';
import { InstallModal } from './InstallModal'; // Is this PromptModal? Yes
import PaymentSuccessModal from './PaymentSuccessModal';
import { AuthModal } from './AuthModal';
import { DailyCheckModal } from './DailyCheckModal';


// Eager load frequently used modals for better performance
import { NetworkVisualizerModal } from './NetworkVisualizerModal';
import GuideHubModal from './GuideHubModal';
import ContractInfoModal from './ContractInfoModal';
import FutureTicketModal from './FutureTicketModal';
import { BusinessPresentationModal } from './BusinessPresentationModal';
import { CashbackDetailedModal } from './CashbackDetailedModal';
import { FocusModeModal } from './FocusModeModal';
import FuelPitchModal from './FuelPitchModal';
import { UnionEcosystemModal } from './UnionEcosystemModal';
import LightSimulatorModal from './LightSimulatorModal';
import DisclaimerModal from './DisclaimerModal';
import TargetCalculatorModal from './TargetCalculatorModal';
import { AnalisiUtenzeModal } from './AnalisiUtenzeModal';
import GridMenu from './GridMenu';
import { FuelFocusMode } from './FuelFocusMode';
import { AnalisiUtenzeFocusMode } from './AnalisiUtenzeFocusMode';
import { SharingParkFocusMode } from './SharingParkFocusMode';
import { SimulatorFocusMode } from './SimulatorFocusMode';

// Lazy load ONLY very rarely used or extremely heavy modals
// Currently moving almost everything to eager to fix "slowness" perception

// Loading component
const LoadingSpinner = () => (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
);

const ModalManager: React.FC = () => {
    const { activeModal, modalProps, closeModal } = useModal();

    if (!activeModal) return null;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {activeModal === 'LEGAL' && <LegalModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'BROADCAST' && <BroadcastModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'INSTALL_PROMPT' && <InstallModal isOpen={true} onClose={closeModal} {...modalProps} />}


            {activeModal === 'NETWORK_VISUALIZER' && <NetworkVisualizerModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'GUIDE' && <GuideHubModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'CONTRACT_INFO' && <ContractInfoModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FUTURE_TICKET' && <FutureTicketModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'BUSINESS_PRESENTATION' && <BusinessPresentationModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'CASHBACK_DETAILED' && <CashbackDetailedModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FOCUS_MODE' && <FocusModeModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FUEL_PITCH' && <FuelPitchModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'UNION_ECOSYSTEM' && <UnionEcosystemModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'LIGHT_SIMULATOR' && <LightSimulatorModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'DISCLAIMER' && <DisclaimerModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'TARGET_CALCULATOR' && <TargetCalculatorModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'GRID_MENU' && <GridMenu isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FUEL_FOCUS' && <FuelFocusMode isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'ANALISI_UTENZE_FOCUS' && <AnalisiUtenzeFocusMode isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'SHARING_PARK_FOCUS' && <SharingParkFocusMode isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'SIMULATOR_FOCUS' && <SimulatorFocusMode isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'ANALISI_UTENZE' && <AnalisiUtenzeModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'DAILY_CHECK' && <DailyCheckModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'AUTH_MODAL' && <AuthModal isOpen={true} onClose={closeModal} {...modalProps} />}
        </Suspense>
    );
};

export default ModalManager;
