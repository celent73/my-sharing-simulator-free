import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the type for modal keys
export type ModalKey =
    | 'INTRO'
    | 'LEGAL'
    | 'NETWORK_VISUALIZER'
    | 'GUIDE'
    | 'BUSINESS_PRESENTATION'
    | 'UNION_ECOSYSTEM'
    | 'FUEL_PITCH'
    | 'FOCUS_MODE'
    | 'TARGET_CALCULATOR'
    | 'FUTURE_TICKET'
    | 'GRID_MENU'
    | 'BROADCAST'
    | 'INSTALL_PROMPT'
    | 'ECONOMY_EXPLAINED' // If needed
    | 'LIGHT_SIMULATOR'
    | 'RESET_CONFIRM'
    | 'SAVE_CONFIRM'
    | 'LOAD_CONFIRM'
    | 'PAYMENT_SUCCESS'
    | 'PREMIUM_UNLOCK'
    | 'CASHBACK_DETAILED'
    | 'CONTRACT_INFO'
    | 'DISCLAIMER'
    | 'ANALISI_UTENZE' // And any others
    | 'ANALISI_UTENZE_FOCUS'
    | 'FUEL_FOCUS'
    | 'SIMULATOR_FOCUS'
    | 'TARGET_FOCUS'
    | 'SHARING_PARK_FOCUS'
    | 'DAILY_CHECK'
    | 'AUTH_MODAL'
    | null;

interface ModalState {
    activeModal: ModalKey;
    modalProps: any;
}

interface ModalDispatch {
    openModal: (key: ModalKey, props?: any) => void;
    closeModal: () => void;
}

const ModalStateContext = createContext<ModalState | undefined>(undefined);
const ModalDispatchContext = createContext<ModalDispatch | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<ModalKey>(null);
    const [modalProps, setModalProps] = useState<any>({});

    const openModal = useCallback((key: ModalKey, props: any = {}) => {
        setModalProps(props);
        setActiveModal(key);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        setModalProps({});
    }, []);

    return (
        <ModalDispatchContext.Provider value={{ openModal, closeModal }}>
            <ModalStateContext.Provider value={{ activeModal, modalProps }}>
                {children}
            </ModalStateContext.Provider>
        </ModalDispatchContext.Provider>
    );
};

export const useModalState = () => {
    const context = useContext(ModalStateContext);
    if (context === undefined) {
        throw new Error('useModalState must be used within a ModalProvider');
    }
    return context;
};

export const useModalDispatch = () => {
    const context = useContext(ModalDispatchContext);
    if (context === undefined) {
        throw new Error('useModalDispatch must be used within a ModalProvider');
    }
    return context;
};

// Deprecated: attempt to use split hooks where possible to avoid re-renders
export const useModal = () => {
    const state = useModalState();
    const dispatch = useModalDispatch();
    return { ...state, ...dispatch };
};
