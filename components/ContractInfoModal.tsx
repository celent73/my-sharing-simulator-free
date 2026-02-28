
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContractInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContractInfoModal: React.FC<ContractInfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 max-w-md w-full p-6 md:p-8 relative transform transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-2xl">
                ℹ️
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('contract_modal.title')}</h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
          <p>
            {t('contract_modal.body')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-union-blue-500/90 hover:bg-union-blue-600 text-white font-bold py-3 px-4 rounded-2xl transition-colors duration-200 shadow-lg shadow-union-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-union-blue-500 backdrop-blur-sm"
        >
          {t('contract_modal.close_btn')}
        </button>
      </div>
    </div>
  );
};

export default ContractInfoModal;
