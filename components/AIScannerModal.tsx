import React, { useState, useRef } from 'react';
import { X, Camera, FileText, Loader2, Check, AlertCircle, Upload } from 'lucide-react';
import { analyzeBillImage, ExtractedBillData } from '../utils/aiService';

interface AIScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ExtractedBillData) => void;
    scanType?: 'electricity' | 'gas' | 'any';
}

const AIScannerModal: React.FC<AIScannerModalProps> = ({ isOpen, onClose, onConfirm, scanType = 'any' }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showDiagnostics, setShowDiagnostics] = useState(false);

    if (!isOpen) return null;

    const getTitle = () => {
        switch (scanType) {
            case 'electricity': return "Scanner Luce";
            case 'gas': return "Scanner Gas";
            default: return "Scanner AI Premium";
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset state
        setError(null);
        setExtractedData(null);
        setShowDiagnostics(false);

        // Show preview
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target?.result as string;
            setPreviewUrl(base64);

            setIsScanning(true);
            try {
                // Pass scanType to analyze function (to be updated)
                const data = await analyzeBillImage(base64, scanType);
                if (data) {
                    // Check if actually found technical data
                    const hasElectricity = data.electricity && (data.electricity.consumption || data.electricity.pun || data.electricity.totalAmount);
                    const hasGas = data.gas && (data.gas.consumption || data.gas.psv || data.gas.totalAmount);

                    if (!hasElectricity && !hasGas && data.type !== 'unknown') {
                        setError("L'IA ha analizzato il documento ma non ha trovato i dati tecnici (PUN, PSV, Consumi). Assicurati che il file contenga il riepilogo tecnico.");
                    } else {
                        setExtractedData(data);
                    }
                } else {
                    setError("Non è stato possibile estrarre i dati. L'IA non ha risposto o il formato non è valido.");
                }
            } catch (err: any) {
                setError(err.message || "Errore durante l'analisi.");
            } finally {
                setIsScanning(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = () => {
        if (extractedData) {
            onConfirm(extractedData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1c2e] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <Camera className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
                            <p className="text-sm text-gray-400">Analisi intelligente bolletta</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Upload Area */}
                    {!previewUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer group"
                        >
                            <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium">Carica Bolletta o Foto</p>
                                <p className="text-sm text-gray-400 mt-1">Trascina qui o clicca per selezionare (PDF, JPG, PNG)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Document Preview */}
                            <div className="relative aspect-[4/3] w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5">
                                {previewUrl.includes("application/pdf") ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                                        <FileText className="w-16 h-16 text-purple-400/50" />
                                        <p>Documento PDF Caricato</p>
                                    </div>
                                ) : (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                )}

                                {isScanning && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                                        <p className="text-white font-medium animate-pulse">L'IA sta leggendo i dati...</p>
                                    </div>
                                )}
                            </div>

                            {/* Results or Error */}
                            {error ? (
                                <div className="space-y-3">
                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm text-red-200">{error}</p>
                                                <button
                                                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                                                    className="text-xs text-red-400 underline mt-2 hover:text-red-300"
                                                >
                                                    {showDiagnostics ? "Nascondi Diagnostica" : "Mostra Log Tecnico (Browser Console)"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {showDiagnostics && (
                                        <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                                            <p className="text-[10px] font-mono text-gray-400 leading-relaxed">
                                                Apri la Console del Browser (F12) per vedere il responso completo dell'IA e capire perché l'estrazione è fallita. Cerca i log tra "--- GEMINI RESPONSE START ---" e "--- GEMINI RESPONSE END ---".
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : extractedData && (
                                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dati Rilevati</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {extractedData.electricity && (
                                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                                                <p className="text-xs text-purple-400 font-bold uppercase">Energia Elettrica</p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Consumo (mese):</span>
                                                        <span className="text-white font-medium">{extractedData.electricity.consumption || '--'} kWh</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Quota Fissa:</span>
                                                        <span className="text-white font-medium">{extractedData.electricity.fixedCosts ? `€${extractedData.electricity.fixedCosts}` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">PUN:</span>
                                                        <span className="text-white font-medium">{extractedData.electricity.pun ? `€${extractedData.electricity.pun}` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Spread:</span>
                                                        <span className="text-white font-medium">{extractedData.electricity.spread ? `€${extractedData.electricity.spread}` : '--'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {extractedData.gas && (
                                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                                                <p className="text-xs text-orange-400 font-bold uppercase">Gas Naturale</p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Consumo (mese):</span>
                                                        <span className="text-white font-medium">{extractedData.gas.consumption || '--'} Smc</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Quota Fissa:</span>
                                                        <span className="text-white font-medium">{extractedData.gas.fixedCosts ? `€${extractedData.gas.fixedCosts}` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">PSV:</span>
                                                        <span className="text-white font-medium">{extractedData.gas.psv ? `€${extractedData.gas.psv}` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Spread:</span>
                                                        <span className="text-white font-medium">{extractedData.gas.spread ? `€${extractedData.gas.spread}` : '--'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {(extractedData.electricity?.totalAmount || extractedData.gas?.totalAmount) && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex justify-between items-center">
                                            <span className="text-green-200 font-medium">Totale Fattura Rilevato:</span>
                                            <span className="text-xl font-bold text-white">
                                                € {((extractedData.electricity?.totalAmount || 0) + (extractedData.gas?.totalAmount || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all"
                                >
                                    Cambia File
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!extractedData || isScanning}
                                    className={`flex-[2] px-6 py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${!extractedData || isScanning
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:scale-[1.02]'
                                        }`}
                                >
                                    <Check className="w-5 h-5" />
                                    Conferma e Applica
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    capture="environment"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default AIScannerModal;
