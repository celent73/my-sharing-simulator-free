import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
// Remove static import to prevent startup lockdown
// import * as pdfjsLib from 'pdfjs-dist';
import { CashbackDetailedModal } from './CashbackDetailedModal';
import { useLanguage } from '../contexts/LanguageContext';

// Worker will be set dynamically


interface BusinessPresentationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenCashback?: () => void; // Keeping for compatibility but will use local if possible
    onOpenFocus: (page: number) => void;
    initialPage?: number;
    cashbackDetails?: any[];
    onCashbackConfirm?: (spend: number, cashback: number, details: any[]) => void;
}

export const BusinessPresentationModal: React.FC<BusinessPresentationModalProps> = ({
    isOpen,
    onClose,
    onOpenCashback,
    onOpenFocus,
    initialPage = 1,
    cashbackDetails = [],
    onCashbackConfirm
}) => {
    const { t } = useLanguage();
    const [page, setPage] = useState(initialPage);
    const [isCashbackLocalOpen, setIsCashbackLocalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfDoc, setPdfDoc] = useState<any>(null); // Use any for dynamic type
    const [isLoading, setIsLoading] = useState(true);
    const [renderError, setRenderError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderTaskRef = useRef<any>(null); // Use any for dynamic type

    // Carica il documento PDF all'apertura
    useEffect(() => {
        if (!isOpen) {
            setPdfDoc(null);
            // Non resettiamo più a 1 qui, ma gestiamo nel prossimo useEffect se necessario o lasciamo che il parent smonti/rimonti
            // Tuttavia, per sicurezza se initialPage cambia mentre è chiuso:
            return;
        }

        // Se si riapre, usa initialPage (se passato, altrimenti quello che c'è o 1)
        setPage(initialPage);

        const loadPdf = async () => {
            setIsLoading(true);
            setRenderError(null);
            try {
                // Dynamic import
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

                const loadingTask = pdfjsLib.getDocument('/UnionPresentazioneBusiness.pdf');
                const doc = await loadingTask.promise;
                setPdfDoc(doc);
                setTotalPages(doc.numPages);
                setIsLoading(false);
            } catch (err: any) {
                console.error("Errore caricamento PDF:", err);
                setRenderError("Impossibile caricare il documento.");
                setIsLoading(false);
            }
        };

        loadPdf();
    }, [isOpen, initialPage]);

    // Renderizza la pagina quando cambia 'page', 'pdfDoc' o le dimensioni della finestra
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

        const renderPage = async () => {
            // Annulla render precedente se in corso
            if (renderTaskRef.current) {
                try {
                    await renderTaskRef.current.cancel();
                } catch (e) {
                    // Ignore cancellation errors
                }
            }

            try {
                const pageDoc = await pdfDoc.getPage(page);

                // Calcola scala per adattare al contenitore
                const containerWidth = containerRef.current!.clientWidth;
                const containerHeight = containerRef.current!.clientHeight;

                // Ottieni viewport originale (scala 1)
                const unscaledViewport = pageDoc.getViewport({ scale: 1 });

                // Calcola i fattori di scala per larghezza e altezza
                const scaleX = containerWidth / unscaledViewport.width;
                const scaleY = containerHeight / unscaledViewport.height;

                // Usa il minore per "contain" (adatta tutto dentro)
                const scale = Math.min(scaleX, scaleY) * 0.98; // 0.98 per un minimo margine di sicurezza

                const viewport = pageDoc.getViewport({ scale });

                const canvas = canvasRef.current!;
                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                const renderTask = pageDoc.render(renderContext as any);
                renderTaskRef.current = renderTask;
                await renderTask.promise;
                renderTaskRef.current = null;
            } catch (error: any) {
                if (error?.name !== 'RenderingCancelledException') {
                    console.error("Errore rendering pagina:", error);
                }
            }
        };

        // Renderizza subito e al resize
        renderPage();

        const handleResize = () => {
            // Debounce semplice o chiamata diretta (qui diretta per reattività)
            renderPage();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [pdfDoc, page, isOpen]); // Rimuovi dipendenze non necessarie per evitare loop

    if (!isOpen) return null;

    const nextPage = () => setPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setPage(p => Math.max(p - 1, 1));

    // Handler per click e tastiera
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'Escape') onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 focus:outline-none"
            onKeyDown={handleKeyDown}
            tabIndex={0} // Per catturare eventi tastiera
            autoFocus
        >
            <div className="w-full h-full flex flex-col relative overflow-hidden">

                {/* Compact Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-black/50 text-white z-20 absolute top-0 left-0 right-0 backdrop-blur-sm">
                    <h2 className="text-sm md:text-base font-bold flex items-center gap-2 opacity-80">
                        📊 <span className="hidden sm:inline">Business Opportunity</span>
                    </h2>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-4 bg-white/10 rounded-full px-4 py-1 backdrop-blur-md shadow-lg border border-white/10">
                        {/* PULSANTE CASHBACK SU PAGINA 7 */}
                        {page === 7 && (
                            <button
                                onClick={() => setIsCashbackLocalOpen(true)}
                                className="mr-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse"
                            >
                                💰 Calcola Cashback
                            </button>
                        )}

                        {/* PULSANTE FOCUS SU PAGINA 16 */}
                        {page === 16 && (
                            <button
                                onClick={() => onOpenFocus(page)}
                                className="mr-2 px-3 py-1 bg-gradient-to-r from-union-orange-500 to-red-500 hover:from-union-orange-600 hover:to-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse flex items-center gap-2"
                            >
                                <span className="text-lg">🎯</span> Guarda il potenziale dello Sharing
                            </button>
                        )}

                        <button
                            onClick={prevPage}
                            disabled={page <= 1}
                            className="p-1 hover:bg-white/20 rounded-full disabled:opacity-30 transition-all text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm font-mono w-16 text-center text-white font-bold">{page} / {totalPages || '--'}</span>
                        <button
                            onClick={nextPage}
                            disabled={page >= totalPages && totalPages > 0}
                            className="p-1 hover:bg-white/20 rounded-full disabled:opacity-30 transition-all text-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-white/70 hover:text-red-400 hover:scale-110 transition-all bg-white/5 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div ref={containerRef} className="flex-1 flex items-center justify-center relative w-full h-full p-2 pt-14 pb-4">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Loader2 className="w-10 h-10 animate-spin text-union-blue-400" />
                        </div>
                    )}

                    {renderError && (
                        <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                            <p>{renderError}</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Chiudi</button>
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        className={`shadow-2xl transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    />
                </div>

                {/* LOCAL CASHBACK OVERLAY */}
                <CashbackDetailedModal
                    isOpen={isCashbackLocalOpen}
                    onClose={() => setIsCashbackLocalOpen(false)}
                    initialDetails={cashbackDetails}
                    onConfirm={(spend, cashback, details) => {
                        if (onCashbackConfirm) {
                            onCashbackConfirm(spend, cashback, details);
                        }
                        setIsCashbackLocalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};
