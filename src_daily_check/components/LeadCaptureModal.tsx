import React, { useState, useEffect } from 'react';
import { ActivityType, Lead } from '../types';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { id?: string; name: string; phone: string; note: string; appointmentDate?: string; locationType?: 'physical' | 'online'; address?: string; platform?: string }) => void;
    activityType: ActivityType;
    initialData?: Lead | null;
}

const ONLINE_PLATFORMS = [
    { id: 'zoom', label: 'Zoom', color: '#2D8CFF', emoji: '🟦' },
    { id: 'meet', label: 'Google Meet', color: '#00897B', emoji: '🟩' },
    { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', emoji: '💬' },
    { id: 'telegram', label: 'Telegram', color: '#29B6F6', emoji: '✈️' },
    { id: 'teams', label: 'Teams', color: '#6264A7', emoji: '🟪' },
    { id: 'skype', label: 'Skype', color: '#00AFF0', emoji: '🔵' },
];

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSave, activityType, initialData }) => {
    const isAppointment = activityType === ActivityType.APPOINTMENTS;

    // Common fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    // Appointment-specific fields
    const [appointmentDate, setAppointmentDate] = useState('');
    const [locationType, setLocationType] = useState<'physical' | 'online'>('online');
    const [address, setAddress] = useState('');
    const [platform, setPlatform] = useState('zoom');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '');
                setPhone(initialData.phone || '');
                setNote(initialData.note || '');
                setAppointmentDate(initialData.appointmentDate || '');
                setLocationType(initialData.locationType || 'online');
                setAddress(initialData.address || '');
                setPlatform(initialData.platform || 'zoom');
            } else {
                setName(''); setPhone(''); setNote('');
                setAppointmentDate('');
                setLocationType('online');
                setAddress('');
                setPlatform('zoom');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({
            id: initialData?.id,
            name, phone, note,
            ...(isAppointment && {
                appointmentDate,
                locationType,
                address: locationType === 'physical' ? address : undefined,
                platform: locationType === 'online' ? platform : undefined,
            })
        });
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

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
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
                <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
                    {/* Nome */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Nome e Cognome *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" required autoFocus
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
                    </div>

                    {/* Telefono */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Telefono</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+39 333 1234567"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all" />
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
                                        🏠 In presenza
                                    </button>
                                    <button type="button" onClick={() => setLocationType('online')}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${locationType === 'online' ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                                        💻 Online
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
                                                className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all border-2 flex flex-col items-center gap-1 ${platform === p.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}>
                                                <span className="text-xl">{p.emoji}</span>
                                                <span>{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Note */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Note (opzionale)</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={isAppointment ? "Argomenti da trattare..." : "Interessato a..."} rows={2}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-medium transition-all resize-none" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 pb-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                            Annulla
                        </button>
                        <button type="submit"
                            className="flex-1 py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all">
                            Salva ✓
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadCaptureModal;
