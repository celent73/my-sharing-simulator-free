import React, { useState } from 'react';
import { SavedScenario, PlanInput, ViewMode, CondoInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Save, Trash2, Play, Plus, Search, FileText, LayoutTemplate, Building2, Users } from 'lucide-react';

interface ScenarioManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    scenarios: SavedScenario[];
    onSave: (name: string) => void;
    onLoad: (scenario: SavedScenario) => void;
    onDelete: (id: string) => void;
    currentInputs: PlanInput;
}

export const ScenarioManagerModal: React.FC<ScenarioManagerModalProps> = ({
    isOpen,
    onClose,
    scenarios,
    onSave,
    onLoad,
    onDelete,
}) => {
    const { t } = useLanguage();
    const [newScenarioName, setNewScenarioName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'load' | 'save'>('load');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!newScenarioName.trim()) return;
        onSave(newScenarioName);
        setNewScenarioName('');
        setActiveTab('load'); // Switch to list after save
    };

    const filteredScenarios = scenarios.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getModeIcon = (mode: ViewMode) => {
        switch (mode) {
            case 'family': return <Users size={14} className="text-blue-500" />;
            case 'client': return <LayoutTemplate size={14} className="text-purple-500" />;
            case 'condo': return <Building2 size={14} className="text-orange-500" />;
            default: return <FileText size={14} className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="text-union-blue-600" />
                            Gestione Scenari
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Salva e carica le tue configurazioni
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 bg-gray-100 dark:bg-slate-800/50 mx-4 mt-4 rounded-xl gap-1">
                    <button
                        onClick={() => setActiveTab('load')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'load'
                                ? 'bg-white dark:bg-slate-700 text-union-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <Search size={16} /> Libreria ({scenarios.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('save')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'save'
                                ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <Plus size={16} /> Nuovo Salvataggio
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">

                    {activeTab === 'save' && (
                        <div className="space-y-4 py-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Stai per salvare lo scenario corrente</h3>
                                <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
                                    Tutti i dati inseriti (network, consumi, struttura) verranno salvati in locale su questo dispositivo.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome Scenario</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newScenarioName}
                                            onChange={(e) => setNewScenarioName(e.target.value)}
                                            placeholder="Es. Piano Mario Rossi"
                                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSave}
                                            disabled={!newScenarioName.trim()}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                                        >
                                            <Save size={18} /> Salva
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'load' && (
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cerca tra i tuoi scenari..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-union-blue-500 transition-all text-sm"
                                />
                            </div>

                            {/* List */}
                            {filteredScenarios.length === 0 ? (
                                <div className="text-center py-12 opacity-50">
                                    <FileText size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                                        {searchTerm ? 'Nessuno scenario trovato' : 'Nessuno scenario salvato'}
                                    </p>
                                    {searchTerm === '' && (
                                        <button onClick={() => setActiveTab('save')} className="mt-2 text-union-blue-600 font-semibold text-sm hover:underline">
                                            Crea il primo salvataggio
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredScenarios.map((scenario) => (
                                        <div
                                            key={scenario.id}
                                            className="group bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-union-blue-300 dark:hover:border-union-blue-700 hover:shadow-md transition-all flex justify-between items-center"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate">{scenario.name}</h4>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500">
                                                        {getModeIcon(scenario.viewMode)} {scenario.viewMode}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(scenario.createdAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onLoad(scenario)}
                                                    className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110 transition-all"
                                                    title="Carica questo scenario"
                                                >
                                                    <Play size={18} fill="currentColor" className="opacity-80" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(scenario.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScenarioManagerModal;
