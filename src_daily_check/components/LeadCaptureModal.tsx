import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityType, Lead, ContractType } from '../types';

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
    }) => void;
    activityType: ActivityType;
    initialData?: Lead | null;
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

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSave, activityType, initialData }) => {
    const isAppointment = activityType === ActivityType.APPOINTMENTS;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [temperature, setTemperature] = useState<'freddo' | 'tiepido' | 'caldo' | undefined>(undefined);

    const [appointmentDate, setAppointmentDate] = useState('');
    const [locationType, setLocationType] = useState<'physical' | 'online'>('online');
    const [address, setAddress] = useState('');
    const [platform, setPlatform] = useState('zoom');
    const [isLinkedAppointment, setIsLinkedAppointment] = useState(false);

    const [wonType, setWonType] = useState<'contract' | 'partner'>('contract');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const capitalize = (str: string) => str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') : "";

    useEffect(() => {
        if (isOpen) {
            // Reset state first to avoid residues
            setIsLinkedAppointment(false);
            setWonType('contract');
            
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
            } else {
                setName(''); setPhone(''); setNote(''); setFollowUpDate('');
                setAppointmentDate('');
                setLocationType('online');
                setAddress('');
                setPlatform('zoom');
                setTemperature(undefined);
            }
            setIsSubmitting(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent, forceStatus?: 'won' | 'lost' | 'pending', wonOverride?: 'contract' | 'partner') => {
        if (e) e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);

        let finalStatus = forceStatus || initialData?.status || 'pending';
        let finalType = activityType;
        let finalContractType = undefined;
        
        const effectiveWonType = wonOverride || wonType;
        const hasAppointment = isLinkedAppointment || (appointmentDate && appointmentDate.trim() !== "");
        
        if (finalStatus === 'won') {
            finalType = effectiveWonType === 'partner' ? ActivityType.NEW_FAMILY_UTILITY : ActivityType.NEW_CONTRACTS;
            finalContractType = effectiveWonType === 'partner' ? ContractType.GREEN : ContractType.LIGHT;
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
                    className="relative w-full max-w-md bg-white/80 border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.15)] overflow-hidden backdrop-blur-3xl max-h-[92vh] flex flex-col"
                >
                    {/* Header */}
                    <div className={`p-8 flex items-center gap-5 border-b border-black/5 flex-shrink-0 ${isAppointment ? 'bg-emerald-500/5' : 'bg-blue-500/5'}`}>
                        <div className={`h-14 w-14 rounded-2xl shadow-inner flex items-center justify-center text-3xl bg-black/5 border border-black/5`}>
                            {isAppointment ? '📅' : '👤'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {initialData ? (isAppointment ? 'Modifica Appuntamento' : 'Modifica Contatto') : (isAppointment ? 'Nuovo Appuntamento' : 'Nuovo Contatto')}
                            </h2>
                            <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.2em]">Dettagli attività</p>
                        </div>
                        <button onClick={onClose} className="ml-auto p-3 rounded-2xl bg-black/5 hover:bg-black/10 text-black/30 hover:text-black transition-all border border-black/5 active:scale-90">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Scrollable form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                        {/* Primary Save Button (Top) */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black'} text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3`}
                        >
                            <span className="text-xl">{isSubmitting ? '⏳' : '💾'}</span> {isSubmitting ? 'SALVATAGGIO...' : 'SALVA DATI'}
                        </button>

                        {/* Nome */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="block text-[10px] font-black uppercase text-black/60 tracking-[0.15em]">Nome e Cognome *</label>
                                {typeof navigator !== 'undefined' && 'contacts' in navigator && (
                                    <button
                                        type="button"
                                        onClick={handleImportContact}
                                        className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-black/5 px-3 py-1.5 rounded-xl border border-black/5 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <span>📇</span> Importa
                                    </button>
                                )}
                            </div>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                onBlur={() => setName(capitalize(name))}
                                placeholder="Mario Rossi" 
                                required 
                                autoFocus
                                className="w-full px-5 py-4 bg-black/[0.04] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold placeholder:text-slate-400 transition-all text-lg" 
                            />
                        </div>

                        {/* Telefono */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase text-black/60 tracking-[0.15em]">Telefono</label>
                            <div className="flex gap-3">
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    placeholder="+39 333 1234567"
                                    className="flex-1 px-5 py-4 bg-black/[0.04] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold placeholder:text-slate-400 transition-all text-lg" 
                                />
                                {phone && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const message = encodeURIComponent(`Ciao ${name || '...'}, sono un consulente di My Sharing. Ti contatto in merito alla nostra chiacchierata...`);
                                            window.open(`https://wa.me/${phone.replace(/\s+/g, '')}?text=${message}`, '_blank');
                                        }}
                                        className="px-6 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden min-w-[70px]"
                                        title="Contatta subito su WhatsApp"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="white" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.9-7.01-2.9zm5.29 14.12c-.24.67-1.42 1.28-2 1.37-.51.08-1.16.12-1.87-.12-.43-.14-1-.32-1.69-.62-2.98-1.28-4.93-4.29-5.07-4.49-.15-.19-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.53-.37.7-.37.17 0 .34.01.49.01.16 0 .37-.06.57.42.21.5.7 1.7.77 1.84.07.15.11.32.01.52-.1.2-.23.47-.35.63l-.42.59c-.14.2-.3.42-.12.73.17.31.78 1.28 1.67 2.07.89.79 1.64 1.03 1.95 1.19.31.15.49.13.67-.08.18-.21.78-.9 1-.1.21.11.66.3.74.34.08.04.13.07.19.12s.37.15.44.3.07.15-.02.52z" />
                                        </svg>
                                        <span className="font-bold text-base hidden xsm:block">WhatsApp</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Temperatura Contatto */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">Qualità Contatto</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'freddo', icon: '❄️', label: 'Freddo', color: 'blue' },
                                    { id: 'tiepido', icon: '🌤️', label: 'Tiepido', color: 'amber' },
                                    { id: 'caldo', icon: '🔥', label: 'Caldo', color: 'orange' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTemperature(t.id as any)}
                                        className={`py-4 px-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex flex-col items-center gap-2 ${temperature === t.id ? `bg-${t.color}-50 border-${t.color}-500/50 text-${t.color}-600 scale-105 shadow-lg shadow-${t.color}-500/10` : 'bg-black/5 border-black/10 text-slate-400 hover:border-black/20'}`}
                                    >
                                        <span className="text-2xl">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

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

                        {/* Follow-up Date (Hidden if Appointment) */}
                        {!isAppointment && !isLinkedAppointment && (
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">🚀 Prossimo Follow-up</label>
                                <input 
                                    type="date" 
                                    value={followUpDate} 
                                    onChange={e => setFollowUpDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/[0.03] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold transition-all" 
                                />
                            </div>
                        )}

                        {/* Note */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase text-black/40 tracking-[0.15em]">Note (opzionale)</label>
                            <textarea 
                                value={note} 
                                onChange={e => setNote(e.target.value)} 
                                placeholder={isAppointment ? "Cosa vuoi discutere?" : "Dettagli importanti..."} 
                                rows={3}
                                className="w-full px-5 py-4 bg-black/[0.03] border border-black/20 rounded-2xl focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-900 font-bold transition-all resize-none placeholder:text-slate-300" 
                            />
                        </div>

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

                        {/* ESITO APPUNTAMENTO */}
                        {isAppointment && initialData && (
                            <div className="space-y-5 pt-8 border-t border-black/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🎯</span>
                                    <h3 className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Esito Appuntamento</h3>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setWonType('contract');
                                        handleSubmit(e, 'won', 'contract');
                                    }}
                                    className="w-full p-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-[2rem] border border-emerald-200 transition-all active:scale-[0.98] group flex items-center justify-between shadow-[0_8px_24px_rgba(16,185,129,0.08)]"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm">📄</div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase tracking-widest text-emerald-900">NUOVO CLIENTE!</p>
                                            <p className="text-[10px] text-emerald-600/60 font-black uppercase">INCREMENTA CONTRATTI</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl group-hover:animate-bounce">🚀</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setWonType('partner');
                                        handleSubmit(e, 'won', 'partner');
                                    }}
                                    className="w-full p-6 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-[2rem] border border-purple-200 transition-all active:scale-[0.98] group flex items-center justify-between shadow-[0_8px_24px_rgba(168,85,247,0.08)]"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🤝</div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase tracking-widest text-purple-900">NUOVO PROMOTER!</p>
                                            <p className="text-[10px] text-purple-600/60 font-black uppercase">INCREMENTA FAMILY UTILITY</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl group-hover:animate-bounce">⭐</span>
                                </button>

                                <div className="pt-4 border-t border-black/5">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, 'lost')}
                                        className="w-full p-6 bg-red-50 hover:bg-red-100 text-red-700 rounded-[2rem] border border-red-200 transition-all active:scale-[0.98] group flex items-center justify-between shadow-[0_8px_24px_rgba(239,68,68,0.08)]"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🛑</div>
                                            <div className="text-left">
                                                <p className="font-black text-sm uppercase tracking-widest text-red-900">NON INTERESSATO</p>
                                                <p className="text-[10px] text-red-600/60 font-black uppercase">ANNULLA APPUNTAMENTO E MOTIVI</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl group-hover:rotate-12 transition-transform">✖️</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LeadCaptureModal;
