import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityType, Lead, ContractType } from '../types';
import { 
    Clock, 
    CheckCircle2, 
    X, 
    UserPlus, 
    Sparkles, 
    User, 
    Phone, 
    StickyNote, 
    Activity, 
    Target as TargetIcon, 
    Calendar, 
    Video, 
    Bolt, 
    Leaf 
} from 'lucide-react';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { 
        id?: string; 
        name: string; 
        phone: string; 
        note: string; 
        appointmentDate?: string; 
        locationType?: 'physical' | 'online'; 
        address?: string; 
        platform?: string; 
        followUpDate?: string; 
        temperature?: 'freddo' | 'tiepido' | 'caldo';
        status?: 'pending' | 'won' | 'lost';
        type?: ActivityType;
        contractType?: ContractType;
        linkedAppointment?: boolean;
        videoSent?: boolean;
        videoType?: string;
    }) => void;
    activityType: ActivityType;
    initialType?: ActivityType;
    initialData?: Lead | null;
    forceStatus?: 'pending' | 'won' | 'lost';
    forceWonType?: 'partner' | 'cliente';
}

const ONLINE_PLATFORMS = [
    {
        id: 'zoom',
        label: 'Zoom',
        color: '#2D8CFF',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7 9L10 11V9C10 8.44772 10.4477 8 11 8H17C17.5523 8 18 8.44772 18 9V15C18 15.5523 17.5523 16 17 16H11C10.4477 16 10 15.5523 10 15V13L7 15V9Z" />
            </svg>
        )
    },
    {
        id: 'meet',
        label: 'Meet',
        color: '#00897B',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="#00AA47" d="M16 10v-4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4l4 4V6l-4 4z" />
            </svg>
        )
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        color: '#25D366',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.626 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        )
    },
    {
        id: 'telegram',
        label: 'Telegram',
        color: '#29B6F6',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.51-.36-.61-.19-1.08-.29-1.04-.62.02-.17.25-.35.69-.53 2.68-1.17 4.47-1.94 5.37-2.31 2.56-1.05 3.09-1.23 3.44-1.23.08 0 .25.02.36.11.09.07.12.17.13.25 0 .02.01.07.01.12z" />
            </svg>
        )
    }
];

const ACTIVITY_STYLES = {
    [ActivityType.CONTACTS]: {
        gradient: 'from-[#007AFF] to-[#0051FF]',
        shadow: 'shadow-[0_15px_35px_rgba(0,122,255,0.35)]',
        iconBg: 'bg-[#007AFF]',
        border: 'border-[#007AFF]/40',
        glow: 'rgba(0, 122, 255, 0.6)'
    },
    [ActivityType.VIDEOS_SENT]: {
        gradient: 'from-[#8000ff] to-[#6700cc]',
        shadow: 'shadow-[0_15px_35px_rgba(128,0,255,0.35)]',
        iconBg: 'bg-[#8000ff]',
        border: 'border-[#8000ff]/40',
        glow: 'rgba(128, 0, 255, 0.6)'
    },
    [ActivityType.APPOINTMENTS]: {
        gradient: 'from-[#00b21a] to-[#008f15]',
        shadow: 'shadow-[0_15px_35px_rgba(0,178,26,0.35)]',
        iconBg: 'bg-[#00b21a]',
        border: 'border-[#00b21a]/40',
        glow: 'rgba(0, 178, 26, 0.6)'
    },
    [ActivityType.NEW_CONTRACTS]: {
        gradient: 'from-[#FF9500] to-[#FF3B30]',
        shadow: 'shadow-[0_15px_35px_rgba(255,149,0,0.35)]',
        iconBg: 'bg-[#FF9500]',
        border: 'border-[#FF9500]/40',
        glow: 'rgba(255, 149, 0, 0.6)'
    },
    [ActivityType.NEW_FAMILY_UTILITY]: {
        gradient: 'from-[#00c3eb] to-[#008fcc]',
        shadow: 'shadow-[0_15px_35px_rgba(0,195,235,0.35)]',
        iconBg: 'bg-[#00c3eb]',
        border: 'border-[#00c3eb]/40',
        glow: 'rgba(0, 195, 235, 0.6)'
    },
};

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSave, activityType, initialType, initialData, forceStatus, forceWonType }) => {
    const isAppointment = activityType === ActivityType.APPOINTMENTS;
    const isContract = activityType === ActivityType.NEW_CONTRACTS || activityType === ActivityType.NEW_FAMILY_UTILITY;
    const isVideoSent = activityType === ActivityType.VIDEOS_SENT;
    
    // Status management: use forceStatus if provided, otherwise default or lead status
    const initialStatus = forceStatus || initialData?.status || 'pending';
    const [status, setStatus] = useState<'pending' | 'won' | 'lost'>(initialStatus);
    const [name, setName] = useState(initialData?.name || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [followUpDate, setFollowUpDate] = useState('');
    const [temperature, setTemperature] = useState<'freddo' | 'tiepido' | 'caldo' | undefined>(undefined);

    const [wonType, setWonType] = useState<'partner' | 'cliente'>(forceWonType || (initialData?.type === ActivityType.NEW_FAMILY_UTILITY ? 'partner' : 'cliente'));
    const [selectedContractType, setSelectedContractType] = useState<ContractType>(initialData?.contractType || ContractType.LIGHT);

    const [appointmentDate, setAppointmentDate] = useState('');
    const [locationType, setLocationType] = useState<'physical' | 'online'>('online');
    const [address, setAddress] = useState('');
    const [platform, setPlatform] = useState('zoom');
    const [isLinkedAppointment, setIsLinkedAppointment] = useState(false);
    
    // Video Sent state
    const [videoSent, setVideoSent] = useState(false);
    const [videoType, setVideoType] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const capitalize = (str: string) => str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') : "";

    useEffect(() => {
        if (isOpen) {
            // Reset state first to avoid residues
            setIsLinkedAppointment(false);
            
            if (initialData) {
                setName(initialData.name || '');
                setPhone(initialData.phone || '');
                setNote(initialData.note || '');
                setFollowUpDate(initialData.followUpDate || '');
                setAppointmentDate(initialData.appointmentDate || '');
                setLocationType(initialData.locationType || 'online');
                setAddress(initialData.address || '');
                setPlatform(initialData.platform || 'zoom');
                setTemperature(initialData.temperature);
                
                // Se è già un appuntamento o ha una data appuntamento, consideralo tale
                if (initialData.type === ActivityType.APPOINTMENTS || initialData.appointmentDate) {
                    setIsLinkedAppointment(true);
                }
                setVideoSent(!!initialData.videoSent);
                setVideoType(initialData.videoType || '');
                setSelectedContractType(initialData.contractType || ContractType.LIGHT);
                if (initialData.type === ActivityType.NEW_FAMILY_UTILITY) setWonType('partner');
            } else {
                setName(''); setPhone(''); setNote(''); setFollowUpDate('');
                setAppointmentDate('');
                setLocationType('online');
                setAddress('');
                setPlatform('zoom');
                setTemperature(undefined);
                setVideoSent(false);
                setVideoType('');
                setSelectedContractType(ContractType.LIGHT);
                setWonType('cliente');
            }
            setIsSubmitting(false);
            setStatus(forceStatus || initialData?.status || 'pending');
            setWonType(forceWonType || (initialData?.type === ActivityType.NEW_FAMILY_UTILITY ? 'partner' : 'cliente'));
        }
    }, [isOpen, initialData, forceStatus, forceWonType]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent, overrideStatus?: 'won' | 'lost' | 'pending', overrideWonType?: 'partner' | 'cliente') => {
        if (e) e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);

        let finalStatus = overrideStatus || status;
        let finalType = activityType;
        let finalContractType = undefined;
        
        const effectiveWonType = overrideWonType || wonType;
        const hasAppointment = isLinkedAppointment || (appointmentDate && appointmentDate.trim() !== "");
        
        if (finalStatus === 'won') {
            finalType = effectiveWonType === 'partner' ? ActivityType.NEW_FAMILY_UTILITY : ActivityType.NEW_CONTRACTS;
            finalContractType = effectiveWonType === 'partner' ? ContractType.GREEN : selectedContractType;
        } else if (hasAppointment || finalStatus === 'lost') {
            // Se c'è un appuntamento (manuale o rilevato da data), diventa tipo APPOINTMENTS
            // Ma se stiamo marcando come 'lost', manteniamo il tipo attuale 
            if (hasAppointment && finalStatus !== 'lost') {
                finalType = ActivityType.APPOINTMENTS;
            }
        }

        onSave({
            id: initialData?.id,
            name: capitalize(name), 
            phone, note,
            status: finalStatus,
            type: finalType,
            followUpDate: followUpDate || undefined,
            temperature,
            contractType: finalContractType,
            linkedAppointment: hasAppointment,
            videoSent,
            videoType: videoSent ? videoType : undefined,
            ...((isAppointment || hasAppointment) && {
                appointmentDate,
                locationType,
                address: locationType === 'physical' ? address : undefined,
                platform: locationType === 'online' ? platform : undefined,
            })
        } as any);
    };

    const handleImportContact = async () => {
        const nav = navigator as any;
        if (!('contacts' in nav && 'select' in nav.contacts)) {
            alert("L'importazione dalla rubrica non è supportata su questo browser o dispositivo.");
            return;
        }

        try {
            const props = ['name', 'tel'];
            const opts = { multiple: false };
            const contacts = await nav.contacts.select(props, opts);

            if (contacts.length > 0) {
                const contact = contacts[0];
                if (contact.name && contact.name.length > 0) {
                    setName(capitalize(contact.name[0]));
                }
                if (contact.tel && contact.tel.length > 0) {
                    setPhone(contact.tel[0]);
                }
            }
        } catch (err) {
            console.error("Errore durante l'importazione dei contatti:", err);
        }
    };

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(`Ciao ${name || '...'}, sono un consulente di My Sharing. Ti contatto in merito alla nostra chiacchierata...`);
        window.open(`https://wa.me/${phone.replace(/\s+/g, '')}?text=${message}`, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" 
                    onClick={onClose} 
                />

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="relative w-full max-w-lg mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                    
                    {/* Header - Apple Style with Decisive Colors */}
                    <div className={`p-8 flex items-center gap-5 border-b border-black/5 flex-shrink-0 ${isAppointment ? 'bg-[#00b21a]/10' : isContract ? 'bg-[#FF9500]/10' : 'bg-[#007AFF]/10'}`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-500 hover:rotate-6 ${isAppointment ? 'bg-[#00b21a]' : isContract ? 'bg-[#FF9500]' : 'bg-[#007AFF]'}`}>
                            {isAppointment ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            ) : isContract ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight underline decoration-slate-200 decoration-4 underline-offset-4">
                                {initialData 
                                    ? (isAppointment ? 'Modifica Appuntamento' : isContract ? 'Modifica Contratto' : 'Modifica Contatto') 
                                    : (isAppointment ? 'Nuovo Appuntamento' : isContract ? 'Nuovo Contratto' : 'Nuovo Contatto')}
                            </h2>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className={isAppointment ? 'text-emerald-500' : isContract ? 'text-orange-500' : 'text-blue-500'}>●</span>
                                {isContract ? 'Ecosistemi & Utility' : isAppointment ? 'Pianificazione' : 'Database Leads'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={handleImportContact} 
                                className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-blue-500 transition-colors active:scale-90"
                                title="Carica da Rubrica"
                            >
                                <UserPlus className="h-6 w-6" strokeWidth={3} />
                            </button>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
                                title="Chiudi"
                            >
                                <X className="h-6 w-6" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
                        {/* Primary Decisive Save Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-5 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900'} text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-sm`}
                        >
                            <span className="bg-white/20 p-2 rounded-xl backdrop-blur-md">{isSubmitting ? '⏳' : '💾'}</span> {isSubmitting ? 'Salvataggio...' : 'Conferma e Salva'}
                        </button>

                        {/* Status Tabs - Decisive Accent */}
                        {!forceStatus && (
                            <div className="flex p-2 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] gap-2 mb-8 shadow-inner border border-black/5">
                                {[
                                    { id: 'pending', label: 'Contatto', icon: <Clock size={16} />, color: 'blue', grad: 'from-[#007AFF] to-[#00C6FF]' },
                                    { id: 'won', label: 'Vinto', icon: <CheckCircle2 size={16} />, color: 'emerald', grad: 'from-[#34C759] to-[#30B0C7]' },
                                    { id: 'lost', label: 'Perso', icon: <X size={16} />, color: 'slate', grad: 'from-[#8E8E93] to-[#1C1C1E]' }
                                ].map(s => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setStatus(s.id as any)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 ease-out ${status === s.id ? `bg-gradient-to-br ${s.grad} text-white shadow-xl shadow-${s.color}-500/20 scale-105` : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {s.icon}
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Gruppo Anagrafica - Apple Card Style */}
                        <div className="bg-white/50 dark:bg-white/5 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 space-y-6 shadow-sm">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nominativo</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => setName(capitalize(name))}
                                    placeholder="Nome e Cognome"
                                    autoFocus
                                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-base font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1 flex justify-between items-center">
                                    <span>Recapito Telefonico</span>
                                    {phone && (
                                        <button 
                                            type="button" 
                                            onClick={handleWhatsAppClick}
                                            className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                            WHATSAPP
                                        </button>
                                    )}
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Esempio: 333 1234567"
                                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-base font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-inner"
                                />
                            </div>
                        </div>

                        {/* ─── WON SPECIFIC (MOVED UP FOR BETTER ACCESSIBILITY) ─── */}
                        {status === 'won' && (
                            <div className="space-y-8 p-6 bg-emerald-50/50 rounded-[2rem] border-2 border-emerald-500/10 animate-in fade-in zoom-in-95 duration-500">
                                
                                {/* Tipo Chiusura */}
                                {!forceWonType && (
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black uppercase text-emerald-600/60 tracking-[0.2em] px-1">Tipologia Risultato</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'cliente', label: 'Cliente Privilegiato', sub: 'Nuovo', icon: <UserPlus size={20} /> },
                                                { id: 'partner', label: 'Family Utility', sub: 'Collaborazione', icon: <Sparkles size={20} /> }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setWonType(opt.id as any)}
                                                    className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-1.5 ${wonType === opt.id ? 'bg-white border-emerald-500 text-emerald-700 scale-105 shadow-xl shadow-emerald-500/10' : 'bg-black/[0.02] border-black/5 text-slate-400 hover:border-black/20'}`}
                                                >
                                                    <div className={`mb-1 p-2 rounded-xl ${wonType === opt.id ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{opt.icon}</div>
                                                    <span className="font-black text-sm uppercase tracking-tight">{opt.label}</span>
                                                    <span className="text-[10px] font-bold opacity-60">{opt.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selezione Contratto Dettagliata per Clienti */}
                                {wonType === 'cliente' && (
                                    <div className="space-y-4 pt-2">
                                        <label className="block text-[10px] font-black uppercase text-emerald-600/60 tracking-[0.2em] px-1 italic">Dettaglio Contratto</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: ContractType.LIGHT, label: 'Union Light', sub: 'Convenienza Luce', color: 'blue', grad: 'from-blue-500 to-cyan-500' },
                                                { id: ContractType.GREEN, label: 'Azzeriamola Green', sub: 'Luce & Gas 100%', color: 'emerald', grad: 'from-emerald-500 to-teal-500' }
                                            ].map(c => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setSelectedContractType(c.id)}
                                                    className={`group relative overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center gap-5 ${selectedContractType === c.id ? `border-${c.color}-500 bg-white scale-[1.02] shadow-2xl` : 'bg-black/[0.01] border-black/5 text-slate-400 grayscale'}`}
                                                >
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${selectedContractType === c.id ? `bg-gradient-to-br ${c.grad} text-white rotate-0 scale-110 shadow-lg shadow-${c.color}-500/30` : 'bg-slate-200 text-slate-400 rotate-[-10deg]'}`}>
                                                        {c.id === ContractType.GREEN ? <Leaf size={28} /> : <Bolt size={28} />}
                                                    </div>
                                                    <div className="text-left">
                                                        <span className={`block font-black text-lg tracking-tight mb-0.5 ${selectedContractType === c.id ? `text-${c.color}-700` : 'text-slate-400'}`}>{c.label}</span>
                                                        <span className="block text-[11px] font-bold opacity-70">{c.sub}</span>
                                                    </div>
                                                    
                                                    {selectedContractType === c.id && (
                                                        <motion.div layoutId="glow" className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${c.color}-500/10 blur-3xl rounded-full`} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {wonType === 'partner' && (
                                    <div className="p-6 bg-emerald-500/5 rounded-[2.5rem] border-2 border-emerald-500/20 text-center">
                                        <p className="text-sm font-black text-emerald-700 uppercase tracking-widest">Procedura Family Utility</p>
                                        <p className="text-[10px] font-bold text-emerald-600/70 mt-1 uppercase italic">Contratto Green incluso automaticamente</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Temperatura Contatto - Decisive Colors */}
                        {!forceStatus && status === 'pending' && (
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] px-1 italic">Qualità Contatto</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'freddo', icon: '❄️', label: 'Freddo', color: 'blue', grad: 'from-[#007AFF] to-[#00C6FF]' },
                                        { id: 'tiepido', icon: '🌤️', label: 'Tiepido', color: 'amber', grad: 'from-[#FF9500] to-[#FFCC00]' },
                                        { id: 'caldo', icon: '🔥', label: 'Caldo', color: 'orange', grad: 'from-[#FF3B30] to-[#FF9500]' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setTemperature(t.id as any)}
                                            className={`py-5 px-2 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 border-2 flex flex-col items-center gap-2 ${temperature === t.id ? `bg-gradient-to-br ${t.grad} border-transparent text-white scale-110 shadow-2xl shadow-${t.color}-500/30` : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:scale-[1.02]'}`}
                                        >
                                            <span className="text-3xl drop-shadow-md">{t.icon}</span>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* Video Inviato - Decisive Indigo Accent */}
                    {!isContract && status === 'pending' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Materiale Inviato?</label>
                            <button
                                type="button"
                                onClick={() => setVideoSent(!videoSent)}
                                className={`w-full p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between group shadow-lg ${videoSent 
                                    ? 'bg-gradient-to-br from-[#AF52DE] to-[#5856D6] border-transparent text-white shadow-purple-500/30 scale-[1.02]' 
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl transition-all ${videoSent ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-black text-sm uppercase tracking-wider">Video Presentazione</span>
                                        <span className={`block text-[10px] font-bold ${videoSent ? 'text-white/60' : 'text-slate-300'}`}>Invio Video My Sharing Academy</span>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${videoSent ? 'bg-white border-white scale-110' : 'border-slate-200'}`}>
                                    {videoSent && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                </div>
                            </button>
                        </div>
                    )}
                                
                        <AnimatePresence>
                            {videoSent && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -20, height: 0 }}
                                    className="pt-2 px-6"
                                >
                                    <div className="bg-indigo-50/50 dark:bg-slate-800/80 p-5 rounded-[2rem] border-2 border-indigo-500/10 space-y-3">
                                        <label className="block text-[10px] font-black uppercase text-indigo-600/60 dark:text-indigo-400/60 tracking-[0.2em] px-1 italic text-center">Titolo Video / Argomento</label>
                                        <input 
                                            type="text" 
                                            value={videoType} 
                                            onChange={e => setVideoType(e.target.value)} 
                                            placeholder="Esempio: Academy 2024" 
                                            className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black text-slate-700 dark:text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20" 
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Inserimento contemporaneo Appuntamento */}
                        {!isAppointment && initialData && (
                            <div className="bg-black/5 p-6 rounded-3xl border border-black/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📅</span>
                                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest leading-tight">Fissato anche appuntamento?</label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsLinkedAppointment(!isLinkedAppointment)}
                                        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isLinkedAppointment ? 'bg-slate-900' : 'bg-slate-200'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isLinkedAppointment ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    Se attivo, verranno incrementati sia il contatore dei "Contatti" che quello degli "Appuntamenti".
                                </p>
                            </div>
                        )}

                        {/* ─── APPOINTMENT SPECIFIC ─── */}
                        {(isAppointment || isLinkedAppointment) && (
                            <div className="space-y-6 pt-6 border-t border-black/5">
                                {/* Data e ora */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">📆 Data e Ora</label>
                                    <input 
                                        type="datetime-local" 
                                        value={appointmentDate} 
                                        onChange={e => setAppointmentDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-black/[0.03] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold transition-all" 
                                    />
                                </div>

                                {/* Tipo luogo */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">📍 Modalità</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => setLocationType('physical')}
                                            className={`py-4 px-4 rounded-2xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-3 ${locationType === 'physical' ? 'bg-emerald-50 text-emerald-600 border-emerald-500/50 shadow-md shadow-emerald-500/5' : 'bg-black/5 text-slate-400 border-black/10 hover:border-black/20'}`}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            Fisico
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setLocationType('online')}
                                            className={`py-4 px-4 rounded-2xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-3 ${locationType === 'online' ? 'bg-blue-50 text-blue-600 border-blue-500/50 shadow-md shadow-blue-500/5' : 'bg-black/5 text-slate-400 border-black/10 hover:border-black/20'}`}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                                            Online
                                        </button>
                                    </div>
                                </div>

                                {/* Physical address */}
                                {locationType === 'physical' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">🏠 Indirizzo</label>
                                        <input 
                                            type="text" 
                                            value={address} 
                                            onChange={e => setAddress(e.target.value)} 
                                            placeholder="Via Roma 1, Milano"
                                            className="w-full px-5 py-4 bg-black/[0.03] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold transition-all" 
                                        />
                                    </div>
                                )}

                                {/* Online platform */}
                                {locationType === 'online' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">💻 Piattaforma</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {ONLINE_PLATFORMS.map(p => (
                                                <button 
                                                    key={p.id} 
                                                    type="button" 
                                                    onClick={() => setPlatform(p.id)}
                                                    className={`py-4 px-3 rounded-2xl font-bold text-xs transition-all border-2 flex items-center justify-center gap-3 ${platform === p.id ? 'border-slate-500 bg-black/5 text-slate-900 shadow-sm scale-105' : 'border-black/10 bg-black/[0.02] text-slate-400 hover:border-black/20'}`}
                                                >
                                                    <div style={{ color: p.color }} className="opacity-80">
                                                        {p.icon}
                                                    </div>
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Note - Apple Style Textarea */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1 italic">Note & Strategia</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Aggiungi riflessioni o dettagli importanti..."
                                rows={3}
                                className="w-full bg-white/50 dark:bg-slate-800/50 border-none rounded-[2rem] p-6 text-base font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                            />
                        </div>

                        {/* Follow-up Section - Simplified */}
                        {!isContract && status === 'pending' && (
                            <div className="pt-2">
                                <label className="block text-[10px] font-black uppercase text-amber-700/60 dark:text-amber-500/60 tracking-[0.2em] mb-2 px-1">Data Follow-up</label>
                                <input 
                                    type="date" 
                                    value={followUpDate} 
                                    onChange={e => setFollowUpDate(e.target.value)}
                                    className="w-full bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500/10 rounded-2xl p-4 text-sm font-black text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" 
                                />
                            </div>
                        )}

                        {/* ESITO CONTATTO (v1.2.97) */}
                        {!isAppointment && initialData && (
                            <div className="space-y-4 pt-8 border-t border-black/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <h3 className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Esito Contatto</h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, 'lost')}
                                    className="w-full p-6 bg-red-50 hover:bg-red-100 text-red-700 rounded-[2rem] border border-red-200 transition-all active:scale-[0.98] group flex items-center justify-between shadow-[0_8px_24px_rgba(239,68,68,0.08)]"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🛑</div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase tracking-widest text-red-900">NON INTERESSATO</p>
                                            <p className="text-[10px] text-red-600/60 font-black uppercase">SMETTI DI SEGUIRE QUESTO CONTATTO</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl group-hover:rotate-12 transition-transform">✖️</span>
                                </button>
                            </div>
                        )}

                        {/* ESITO APPUNTAMENTO - Apple Style Redesign */}
                        {isAppointment && initialData && (
                            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-white/5">
                                <div className="flex justify-center mb-6">
                                    <h3 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em] bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">Esito Appuntamento</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Cliente Privilegiato */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            setWonType('cliente');
                                            handleSubmit(e, 'won', 'cliente');
                                        }}
                                        className="w-full p-8 bg-white dark:bg-slate-900 border-[3px] border-[#007AFF]/40 rounded-[2.5rem] shadow-lg hover:border-[#007AFF] hover:shadow-[0_0_25px_rgba(0,122,255,0.5)] active:bg-[#007AFF]/5 active:shadow-[0_0_40px_rgba(0,122,255,0.9)] transition-all duration-300 active:scale-[0.96] group flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#007AFF]/30 transition-all duration-500" />
                                        
                                        <div className="text-[#007AFF]">
                                            <svg viewBox="0 0 100 100" className="w-16 h-16 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M50 65 A 15 15 0 1 0 50 35 A 15 15 0 1 0 50 65 Z" />
                                                <path d="M25 90 Q 25 70 50 70 Q 75 70 75 90" />
                                                <path d="M50 10 L53 18 L61 18 L55 23 L57 31 L50 26 L43 31 L45 23 L39 18 L47 18 Z" />
                                                <path d="M25 20 L27 26 L33 26 L28 30 L30 36 L25 32 L20 36 L22 30 L17 26 L23 26 Z" />
                                                <path d="M75 20 L77 26 L83 26 L78 30 L80 36 L75 32 L70 36 L72 30 L67 26 L73 26 Z" />
                                            </svg>
                                        </div>
                                        
                                        <div className="text-center relative z-10 mt-2">
                                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight mb-1">Cliente Privilegiato</p>
                                            <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-widest bg-[#007AFF]/10 px-3 py-1 rounded-full inline-block">Obiettivo Raggiunto</p>
                                        </div>
                                    </button>

                                    {/* Family Utility */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            setWonType('partner');
                                            handleSubmit(e, 'won', 'partner');
                                        }}
                                        className="w-full p-8 bg-white dark:bg-slate-900 border-[3px] border-[#34C759]/40 rounded-[2.5rem] shadow-lg hover:border-[#34C759] hover:shadow-[0_0_25px_rgba(52,199,89,0.5)] active:bg-[#34C759]/5 active:shadow-[0_0_40px_rgba(52,199,89,0.9)] transition-all duration-300 active:scale-[0.96] group flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#34C759]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#34C759]/30 transition-all duration-500" />
                                        
                                        <div className="text-[#34C759]">
                                            <svg viewBox="0 0 100 100" className="w-16 h-16 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M50 25 A 8 8 0 1 0 50 9 A 8 8 0 1 0 50 25 Z" />
                                                <path d="M40 38 Q 40 30 50 30 Q 60 30 60 38" />
                                                <path d="M50 75 A 8 8 0 1 0 50 59 A 8 8 0 1 0 50 75 Z" />
                                                <path d="M40 88 Q 40 80 50 80 Q 60 80 60 88" />
                                                <path d="M25 50 A 8 8 0 1 0 25 34 A 8 8 0 1 0 25 50 Z" />
                                                <path d="M15 63 Q 15 55 25 55 Q 35 55 35 63" />
                                                <path d="M75 50 A 8 8 0 1 0 75 34 A 8 8 0 1 0 75 50 Z" />
                                                <path d="M65 63 Q 65 55 75 55 Q 85 55 85 63" />
                                                <path d="M30 25 A 35 35 0 0 1 42 16" />
                                                <path d="M58 16 A 35 35 0 0 1 70 25" />
                                                <path d="M70 65 A 35 35 0 0 1 58 74" />
                                                <path d="M42 74 A 35 35 0 0 1 30 65" />
                                            </svg>
                                        </div>
                                        
                                        <div className="text-center relative z-10 mt-2">
                                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight mb-1">Family Utility</p>
                                            <p className="text-[10px] text-[#34C759] font-black uppercase tracking-widest bg-[#34C759]/10 px-3 py-1 rounded-full inline-block">Consulenza Diretta</p>
                                        </div>
                                    </button>

                                    {/* Perso */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, 'lost')}
                                        className="w-full p-6 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-100 dark:border-white/5 transition-all hover:bg-red-50 hover:border-red-500/20 active:scale-[0.98] group flex items-center justify-center gap-4"
                                    >
                                        <div className="text-slate-400 group-hover:text-red-500 transition-colors">
                                            <X size={24} strokeWidth={3} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-sm uppercase tracking-widest text-slate-500 group-hover:text-red-600 transition-colors">Perso / Non Interessato</p>
                                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-red-400">Archivia questo contatto</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Tasto Salva Principale (solo se non ci sono esiti da dare) */}
                        {!initialData && (
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,122,255,0.2)] active:scale-[0.96] transition-all flex items-center justify-center gap-4 group border-b-4 border-blue-700"
                                >
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Salva Attività
                                </button>
                            </div>
                        )}

                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LeadCaptureModal;
