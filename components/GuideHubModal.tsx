import React, { useState } from 'react';
import { X, Search, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModal } from '../contexts/ModalContext';
import {
    FEATURES,
    CATEGORIES,
    Feature,
    Category,
    getFeaturesByCategory,
    searchFeatures,
    getCategoryTitle
} from '../utils/featuresData';

interface GuideHubModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GuideHubModal: React.FC<GuideHubModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const { openModal } = useModal();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'howto' | 'tips'>('overview');

    if (!isOpen) return null;

    const lang = language as 'it' | 'de' | 'en';

    // Search results
    const searchResults = searchQuery.length > 0
        ? searchFeatures(searchQuery, lang)
        : [];

    const showSearch = searchQuery.length > 0;

    const getFeatureTitle = (f: Feature) => lang === 'it' ? f.titleIT : lang === 'de' ? f.titleDE : f.titleEN;
    const getFeatureDesc = (f: Feature) => lang === 'it' ? f.descriptionIT : lang === 'de' ? f.descriptionDE : f.descriptionEN;
    const getFeatureOverview = (f: Feature) => lang === 'it' ? f.overviewIT : lang === 'de' ? f.overviewDE : f.overviewEN;
    const getFeatureHowTo = (f: Feature) => lang === 'it' ? f.howToIT : lang === 'de' ? f.howToDE : f.howToEN;
    const getFeatureTips = (f: Feature) => lang === 'it' ? f.tipsIT : lang === 'de' ? f.tipsDE : f.tipsEN;

    const handleTryNow = (feature: Feature) => {
        if (feature.modalId) {
            onClose();
            setTimeout(() => {
                openModal(feature.modalId as any);
            }, 300);
        }
    };

    // Detail View
    if (selectedFeature) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in">
                <div className="relative w-full max-w-3xl h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                    {/* Header */}
                    <div className="shrink-0 p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">{selectedFeature.icon}</div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {getFeatureTitle(selectedFeature)}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {getFeatureDesc(selectedFeature)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                📖 {lang === 'it' ? 'Panoramica' : lang === 'de' ? 'Übersicht' : 'Overview'}
                            </button>
                            <button
                                onClick={() => setActiveTab('howto')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'howto'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                🎓 {lang === 'it' ? 'Come Usarlo' : lang === 'de' ? 'Anleitung' : 'How To'}
                            </button>
                            <button
                                onClick={() => setActiveTab('tips')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tips'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                💡 Tips
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'overview' && (
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {getFeatureOverview(selectedFeature)}
                                </p>
                            </div>
                        )}

                        {activeTab === 'howto' && (
                            <div className="space-y-4">
                                {getFeatureHowTo(selectedFeature).map((step, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'tips' && (
                            <div className="space-y-3">
                                {getFeatureTips(selectedFeature).map((tip, i) => (
                                    <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                                        <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="shrink-0 p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                        <button
                            onClick={() => setSelectedFeature(null)}
                            className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                        >
                            ← {lang === 'it' ? 'Indietro' : lang === 'de' ? 'Zurück' : 'Back'}
                        </button>

                        {selectedFeature.modalId && (
                            <button
                                onClick={() => handleTryNow(selectedFeature)}
                                className="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <Zap size={20} className="fill-white" />
                                {lang === 'it' ? 'Prova Ora' : lang === 'de' ? 'Jetzt Testen' : 'Try Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Main View (List)
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in">
            <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="shrink-0 p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="text-4xl">🚀</span>
                                {lang === 'it' ? 'Centro Funzionalità' : lang === 'de' ? 'Funktionszentrum' : 'Feature Hub'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {lang === 'it' ? 'Scopri tutto quello che puoi fare con l\'app' : lang === 'de' ? 'Entdecke alles, was du mit der App machen kannst' : 'Discover everything you can do with the app'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={lang === 'it' ? 'Cerca funzionalità...' : lang === 'de' ? 'Funktionen suchen...' : 'Search features...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {showSearch ? (
                        // Search Results
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {searchResults.length} {lang === 'it' ? 'risultati' : lang === 'de' ? 'Ergebnisse' : 'results'}
                            </p>
                            {searchResults.map(feature => (
                                <button
                                    key={feature.id}
                                    onClick={() => setSelectedFeature(feature)}
                                    className="w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{feature.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {getFeatureTitle(feature)}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {getFeatureDesc(feature)}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Categories
                        <div className="space-y-8">
                            {CATEGORIES.map(category => {
                                const features = getFeaturesByCategory(category.id);
                                if (features.length === 0) return null;

                                return (
                                    <div key={category.id}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl">{category.icon}</span>
                                            <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                                {getCategoryTitle(category, lang)}
                                            </h2>
                                            <span className="text-sm text-gray-400 dark:text-gray-500">
                                                ({features.length})
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {features.map(feature => (
                                                <button
                                                    key={feature.id}
                                                    onClick={() => setSelectedFeature(feature)}
                                                    className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all text-left group relative"
                                                >
                                                    {feature.isNew && (
                                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                                                            NEW
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-3xl">{feature.icon}</span>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {getFeatureTitle(feature)}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                                {getFeatureDesc(feature)}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" size={20} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideHubModal;
