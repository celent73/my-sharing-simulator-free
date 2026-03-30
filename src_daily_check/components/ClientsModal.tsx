import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { Client } from '../types';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import { loadClients, deleteClient, saveClient, clearAllClients } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { Search, UserPlus, Phone, MessageCircle, MoreVertical, Trash2, Edit2, X, Users, Filter } from 'lucide-react';

interface ClientsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClientsModal: React.FC<ClientsModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'cliente' | 'partner'>('all');
    const [isLoading, setIsLoading] = useState(true);

    const capitalize = (str: string) => str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') : "";

    useEffect(() => {
        if (isOpen) {
            refreshClients();
        }
    }, [isOpen]);

    const refreshClients = async () => {
        setIsLoading(true);
        try {
            const data = await loadClients(user?.id || null);
            setClients(data);
        } catch (error) {
            console.error("Error loading clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredClients = useMemo(() => {
        return clients.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c.phone.includes(searchQuery);
            const matchesFilter = filterType === 'all' || c.type === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [clients, searchQuery, filterType]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Sei sicuro di voler eliminare questo cliente privilegiato?")) {
            try {
                await deleteClient(user?.id || null, id);
                setClients(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert("Errore durante l'eliminazione.");
            }
        }
    };

    const handleClearAll = async () => {
        if (clients.length === 0) return;
        
        const confirmed = window.confirm(
            "⚠️ ATTENZIONE: Sei sicuro di voler cancellare TUTTI i Clienti Privilegiati e Family Utility?\n\nQuesta operazione è IRREVERSIBILE e perderai per sempre l'intera lista."
        );
        
        if (confirmed) {
            setIsLoading(true);
            try {
                await clearAllClients(user?.id || null);
                setClients([]);
            } catch (error) {
                alert("Errore durante lo svuotamento del database.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    const stats = {
        total: clients.length,
        contracts: clients.filter(c => c.type === 'cliente').length,
        partners: clients.filter(c => c.type === 'partner').length
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-2xl" 
                    onClick={onClose} 
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.05, opacity: 0, y: 20 }}
                    className="bg-slate-900/40 border border-white/10 rounded-[3rem] w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl"
                >
                    {/* Header iOS Style */}
                    <div className="px-10 pt-12 pb-8 flex flex-col gap-8 sticky top-0 bg-transparent backdrop-blur-none z-10">
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Database Personale</span>
                                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                                    Nuovi Utenti
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {clients.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all border border-red-500/10 active:scale-95 shadow-lg shadow-red-500/5"
                                        title="Svuota Database"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all border border-white/5 active:scale-95"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
 
                        {/* Stats Summary - More Subtle */}
                        <div className="flex gap-8 items-center border-b border-white/5 pb-6">
                            {[
                                { label: 'Totali', value: stats.total, color: 'text-white' },
                                { label: 'Clienti Priv.', value: stats.contracts, color: 'text-emerald-400' },
                                { label: 'Family Utility', value: stats.partners, color: 'text-purple-400' }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
 
                        {/* Search & Segmented Control */}
                        <div className="flex flex-col gap-6">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                                <input 
                                    type="text"
                                    placeholder="Cerca contatti..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-white font-bold placeholder:text-white/20 outline-none focus:bg-white/10 transition-all"
                                />
                            </div>
                            
                            {/* Segmented Control iOS Style */}
                            <div className="relative flex p-1 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                <motion.div 
                                    className="absolute inset-y-1 bg-white/10 rounded-xl shadow-xl border border-white/10"
                                    initial={false}
                                    animate={{ 
                                        left: filterType === 'all' ? '0.25rem' : filterType === 'cliente' ? '33.3%' : '66.6%',
                                        width: 'calc(33.3% - 0.5rem)'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                                {['all', 'cliente', 'partner'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setFilterType(t as any)}
                                        className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${filterType === t ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        <span className="hidden sm:inline">
                                            {t === 'all' ? 'Tutti' : t === 'cliente' ? 'Privilegiati' : 'Family Utility'}
                                        </span>
                                        <span className="sm:hidden">
                                            {t === 'all' ? 'Tutti' : t === 'cliente' ? 'Priv.' : 'Util.'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
 
                    {/* Content Area - Inset Grouped style list */}
                    <div className="px-6 pb-20 overflow-y-auto flex-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-white/40 font-black uppercase tracking-widest text-xs">Caricamento database...</p>
                            </div>
                        ) : filteredClients.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                    <Users className="w-10 h-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tight">Nessun nuovo utente trovato</h3>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                    {searchQuery ? 'Prova a cambiare i criteri di ricerca' : 'I tuoi "Vinti" appariranno qui automaticamente'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredClients.map((client) => (
                                    <motion.div 
                                        layout
                                        key={client.id} 
                                        className="group bg-white/[0.04] border border-white/5 rounded-3xl p-4 sm:p-5 hover:bg-white/[0.08] transition-all flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 ${client.type === 'partner' ? 'bg-purple-500/10' : 'bg-emerald-500/10'}`}>
                                                {client.type === 'partner' ? <Users className="text-purple-400 w-6 h-6 sm:w-7 sm:h-7" /> : <Edit2 className="text-emerald-400 w-6 h-6 sm:w-7 sm:h-7" />}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                    <h4 className="text-base sm:text-lg font-black text-white truncate tracking-tight">{capitalize(client.name)}</h4>
                                                    <span className={`self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${client.type === 'partner' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                        {client.type === 'partner' ? 'Family Utility' : 'Privilegiato'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-white/30">
                                                    <Phone size={10} />
                                                    <span className="text-[11px] font-bold">{client.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Side */}
                                        <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:border-none">
                                            <button 
                                                onClick={() => {
                                                    const msg = encodeURIComponent(`Ciao ${client.name}, come va?`);
                                                    window.open(`https://wa.me/${client.phone.replace(/\s+/g, '')}?text=${msg}`, '_blank');
                                                }}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-90 transition-all text-sm sm:text-base"
                                            >
                                                <MessageCircle size={18} strokeWidth={3} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                            <button 
                                                onClick={() => window.open(`tel:${client.phone}`, '_self')}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all border border-white/5 text-sm sm:text-base"
                                            >
                                                <Phone size={18} strokeWidth={3} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(client.id)}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white active:scale-90 transition-all border border-red-500/10 text-sm sm:text-base"
                                            >
                                                <Trash2 size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ClientsModal;
