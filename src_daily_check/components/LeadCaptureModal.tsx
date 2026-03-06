import React, { useState, useEffect } from 'react';
import { ActivityType, Lead } from '../types';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { id?: string; name: string; phone: string; note: string; appointmentDate?: string; locationType?: 'physical' | 'online'; address?: string; platform?: string; followUpDate?: string }) => void;
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
        label: 'Google Meet',
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
    },
    {
        id: 'teams',
        label: 'Teams',
        color: '#6264A7',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M14.5 12c.83 0 1.5-.67 1.5-1.5S15.33 9 14.5 9 13 9.67 13 10.5s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S10.33 9 9.5 9 8 9.67 8 10.5s.67 1.5 1.5 1.5zm8.5-4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8zm-2 6H8V8h8v6z" />
            </svg>
        )
    },
    {
        id: 'skype',
        label: 'Skype',
        color: '#00AFF0',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M23.23 14.39c-.06-.3-.12-.61-.17-.92-.01-.1-.01-.2 0-.3.43-1.17.58-2.4.45-3.63-.33-2.91-2.45-5.38-5.31-6.19-1.23-.35-2.5-.32-3.7-.02-.1.02-.21.03-.31.02-.31-.03-.62-.06-.93-.08-2.58-.16-4.99.88-6.6 2.87-1.51 1.86-1.99 4.23-1.47 6.5.06.32.12.63.18.95.01.09.01.18 0 .27-.43 1.17-.58 2.4-.44 3.63.34 2.91 2.45 5.38 5.32 6.19 1.22.35 2.5.32 3.7.02.1-.03.21-.03.31-.02.31.02.62.05.93.07 2.58.17 4.99-.88 6.6-2.87 1.51-1.86 1.99-4.23 1.47-6.5zm-11.23 4.21c-3.13 0-5.11-1.63-5.11-3.66 0-.81.65-1.31 1.4-1.31 1.25 0 1.2 1.83 3.4 1.83 1.22 0 1.89-.52 1.89-1.28 0-.67-.37-.95-2.31-1.43-2.58-.64-3.51-1.46-3.51-3.04 0-2.37 2.13-3.72 4.93-3.72 2.61 0 4.63 1.19 4.63 3.32 0 .82-.64 1.28-1.37 1.28-1.22 0-1.22-1.61-3.11-1.61-1.04 0-1.58.46-1.58 1.07 0 .67.58.85 2.43 1.34 2.74.73 3.38 1.61 3.38 3.14 0 2.38-1.92 4.1-4.64 4.1z" />
            </svg>
        )
    },
];

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSave, activityType, initialData }) => {
    const isAppointment = activityType === ActivityType.APPOINTMENTS;

    // Common fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    // Appointment-specific fields
    const [appointmentDate, setAppointmentDate] = useState('');
    const [locationType, setLocationType] = useState<'physical' | 'online'>('online');
    const [address, setAddress] = useState('');
    const [platform, setPlatform] = useState('zoom');

    const [wonType, setWonType] = useState<'contract' | 'partner'>('contract');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '');
                setPhone(initialData.phone || '');
                setNote(initialData.note || '');
                setFollowUpDate(initialData.followUpDate || '');
                setAppointmentDate(initialData.appointmentDate || '');
                setLocationType(initialData.locationType || 'online');
                setAddress(initialData.address || '');
                setPlatform(initialData.platform || 'zoom');
                // Se è già vinto, cerchiamo di capire che tipo era (anche se per ora è nuovo)
                setWonType('contract');
            } else {
                setName(''); setPhone(''); setNote(''); setFollowUpDate('');
                setAppointmentDate('');
                setLocationType('online');
                setAddress('');
                setPlatform('zoom');
                setWonType('contract');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent, forceStatus?: 'won' | 'lost' | 'pending') => {
        if (e) e.preventDefault();
        if (!name.trim()) return;

        // Se forceStatus è fornito (dai bottoni Salva Vinto/Perso), usiamo quello
        // Altrimenti manteniamo lo status esistente o 'pending'
        const finalStatus = forceStatus || initialData?.status || 'pending';

        // Se è vinto, decidiamo il tipo di attività in base a wonType
        let finalType = activityType;
        if (finalStatus === 'won') {
            finalType = wonType === 'partner' ? ActivityType.NEW_FAMILY_UTILITY : ActivityType.NEW_CONTRACTS;
        }

        onSave({
            id: initialData?.id,
            name, phone, note,
            status: finalStatus,
            type: finalType,
            followUpDate: followUpDate || undefined,
            ...(isAppointment && {
                appointmentDate,
                locationType,
                address: locationType === 'physical' ? address : undefined,
                platform: locationType === 'online' ? platform : undefined,
            })
        } as any);
    };

    // Generate "Add to calendar" links
    const getCalendarLinks = () => {
        if (!appointmentDate || !isAppointment) return null;
        const dt = new Date(appointmentDate);
        const end = new Date(dt.getTime() + 60 * 60 * 1000); // +1h
        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const title = encodeURIComponent(`Appuntamento con ${name || '...'}`);
        const loc = locationType === 'physical' ? encodeURIComponent(address) : encodeURIComponent(platform);
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(dt)}/${fmt(end)}&location=${loc}`;
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${dt.toISOString()}&enddt=${end.toISOString()}&location=${loc}`;
        return { googleUrl, outlookUrl };
    };
    const calLinks = getCalendarLinks();

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
                    setName(contact.name[0]);
                }
                if (contact.tel && contact.tel.length > 0) {
                    // Prendi il primo numero e puliscilo un po' se necessario
                    setPhone(contact.tel[0]);
                }
            }
        } catch (err) {
            console.error("Errore durante l'importazione dei contatti:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className={`p-5 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 ${isAppointment ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                    <div className={`h-12 w-12 rounded-2xl shadow-md flex items-center justify-center text-2xl bg-white dark:bg-slate-800`}>
                        {isAppointment ? '📅' : '👤'}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">
                            {initialData ? (isAppointment ? 'Modifica Appuntamento' : 'Modifica Contatto') : (isAppointment ? 'Nuovo Appuntamento' : 'Nuovo Contatto')}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Inserisci i dati</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 rounded-xl hover:bg-black/10 transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Scrollable form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Primary Save Button (Top) - To ensure a quick way to save */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 mb-2"
                    >
                        <span>💾</span> SALVA DATI
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Oppure gestisci l'esito</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    {/* Nome */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold uppercase text-slate-400">Nome e Cognome *</label>
                            {typeof navigator !== 'undefined' && 'contacts' in navigator && (
                                <button
                                    type="button"
                                    onClick={handleImportContact}
                                    className="text-[10px] font-black uppercase tracking-tighter text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800 active:scale-95 transition-all flex items-center gap-1"
                                >
                                    <span>📇</span> Importa
                                </button>
                            )}
                        </div>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" required autoFocus
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
                    </div>

                    {/* Telefono */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Telefono</label>
                        <div className="flex gap-2">
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+39 333 1234567"
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
                            {phone && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const message = encodeURIComponent(`Ciao ${name || '...'}, sono un consulente di My Sharing. Ti contatto in merito alla nostra chiacchierata...`);
                                        window.open(`https://wa.me/${phone.replace(/\s+/g, '')}?text=${message}`, '_blank');
                                    }}
                                    className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/30 active:scale-95 transition-all flex items-center justify-center"
                                    title="Contatta subito su WhatsApp"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.626 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ─── APPOINTMENT SPECIFIC ─── */}
                    {isAppointment && (
                        <>
                            {/* Data e ora */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">📆 Data e Ora</label>
                                <input type="datetime-local" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />

                                {/* Add to calendar buttons */}
                                {calLinks && name && (
                                    <div className="flex gap-2 mt-2">
                                        <a href={calLinks.googleUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors">
                                            <span>📅</span> Google Calendar
                                        </a>
                                        <a href={calLinks.outlookUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors">
                                            <span>📧</span> Outlook
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Tipo luogo */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">📍 Modalità</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setLocationType('physical')}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${locationType === 'physical' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'}`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        In presenza
                                    </button>
                                    <button type="button" onClick={() => setLocationType('online')}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${locationType === 'online' ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                                        Online
                                    </button>
                                </div>
                            </div>

                            {/* Physical address */}
                            {locationType === 'physical' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">🏠 Indirizzo</label>
                                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Via Roma 1, Milano"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
                                </div>
                            )}

                            {/* Online platform */}
                            {locationType === 'online' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">💻 Piattaforma</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {ONLINE_PLATFORMS.map(p => (
                                            <button key={p.id} type="button" onClick={() => setPlatform(p.id)}
                                                className={`py-2 px-1 rounded-xl font-bold text-[10px] transition-all border-2 flex flex-col items-center justify-center gap-1.5 h-20 ${platform === p.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md scale-105' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-blue-200'}`}
                                                style={{ color: platform === p.id ? p.color : undefined }}
                                            >
                                                <div className={`${platform === p.id ? 'opacity-100 scale-110' : 'opacity-70 group-hover:opacity-100'} transition-all`} style={{ color: p.color }}>
                                                    {p.icon}
                                                </div>
                                                <span className="truncate w-full text-center">{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Follow-up Date */}
                    {!isAppointment && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">🚀 Prossimo Follow-up</label>
                            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
                        </div>
                    )}

                    {/* Note */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Note (opzionale)</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={isAppointment ? "Argomenti da trattare..." : "Interessato a..."} rows={2}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all resize-none" />
                    </div>

                    {/* Scelta Esito */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50 space-y-4 shadow-inner">
                        <label className="block text-xs font-black uppercase text-slate-500 tracking-widest text-center">Esito della chiamata</label>

                        <div className="flex flex-col gap-3">
                            {/* Option 1: Vinto - Cliente */}
                            <button
                                type="button"
                                onClick={(e) => { setWonType('contract'); handleSubmit(e, 'won') }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 bg-emerald-500 hover:bg-emerald-600 border-emerald-400 text-white shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl bg-white/20 p-2 rounded-xl">📄</div>
                                    <div className="text-left">
                                        <div className="font-black text-sm uppercase tracking-wide">Nuovo Cliente!</div>
                                        <div className="text-[10px] text-emerald-100 font-medium">Salva e incrementa contratti</div>
                                    </div>
                                </div>
                                <div className="font-bold text-emerald-100">🚀</div>
                            </button>

                            {/* Option 2: Vinto - Promoter */}
                            <button
                                type="button"
                                onClick={(e) => { setWonType('partner'); handleSubmit(e, 'won') }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 bg-purple-500 hover:bg-purple-600 border-purple-400 text-white shadow-[0_8px_20px_-6px_rgba(168,85,247,0.5)] transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl bg-white/20 p-2 rounded-xl">🤝</div>
                                    <div className="text-left">
                                        <div className="font-black text-sm uppercase tracking-wide">Nuovo Promoter!</div>
                                        <div className="text-[10px] text-purple-100 font-medium">Salva e incrementa Family Utility</div>
                                    </div>
                                </div>
                                <div className="font-bold text-purple-100">⭐</div>
                            </button>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oppure</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={(e) => handleSubmit(e, 'pending')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-sm active:scale-95 transition-all">
                                <span>Solo Contatto</span>
                                <span className="text-[9px] text-slate-400 font-normal">Ci penserà</span>
                            </button>
                            <button type="button" onClick={(e) => handleSubmit(e, 'lost')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 active:scale-95 transition-all">
                                <span>Non interessato</span>
                                <span className="text-[9px] text-red-400/80 font-normal">Scarta l'opportunità</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadCaptureModal;
