import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker locally to avoid CORS issues
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

console.debug("AI Service v2.1 (Multi-Provider) initialized");

export interface ExtractedBillData {
    type: 'electricity' | 'gas' | 'both' | 'unknown';
    electricity?: {
        consumption?: number; // kWh
        fixedCosts?: number;
        pun?: number;
        spread?: number;
        totalAmount?: number;
        energyQuota?: number;
        pod?: string;
        power?: number;
    };
    gas?: {
        consumption?: number; // Smc
        fixedCosts?: number;
        psv?: number;
        spread?: number;
        totalAmount?: number;
        energyQuota?: number;
        pdr?: string;
    };
}

/**
 * Fallback to Groq Llama 3.2 Vision if Gemini fails
 */
async function analyzeWithGroq(base64Data: string, mimeType: string, prompt: string): Promise<ExtractedBillData | null> {
    if (!GROQ_API_KEY || GROQ_API_KEY.length < 10) {
        console.warn("Groq API Key missing or too short. Skipping fallback.");
        throw new Error("Hai raggiunto il limite di richieste inviate a Google Gemini. Attendi circa 1 minuto o configura Groq API Key.");
    }

    try {
        console.log("Attempting analysis with Groq (Llama-4-Scout-17b)...");
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { url: `data:${mimeType};base64,${base64Data}` }
                            }
                        ]
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0
            })
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(`Groq API Error (${response.status}): ${errBody.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (content) {
            console.log("Success with Groq!");
            try {
                return JSON.parse(content) as ExtractedBillData;
            } catch (pErr) {
                console.error("Groq JSON Parse error:", content);
                throw new Error("Il fornitore di backup (Groq) ha restituito dati leggibili ma non validi.");
            }
        }
        return null;
    } catch (err: any) {
        console.error("Groq Analysis Error:", err);
        if (err.name === 'TypeError') {
            throw new Error("Errore di connessione al fornitore di backup (CORS/Network).");
        }
        throw err;
    }
}

/**
 * Converts up to the first 3 pages of a base64 PDF to a single vertical base64 JPEG image.
 */
async function convertPdfToImage(base64Pdf: string): Promise<string> {
    try {
        const base64Data = base64Pdf.split(',')[1] || base64Pdf;
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const pdfjsLib = await import('pdfjs-dist');
        // @ts-ignore
        const pdfWorker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;

        const pagesToRender = Math.min(pdf.numPages, 3);
        const scale = 1.2; // Slightly higher scale for better readability
        const pageCanvases: HTMLCanvasElement[] = [];
        let totalHeight = 0;
        let maxWidth = 0;

        for (let i = 1; i <= pagesToRender; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) throw new Error("Could not create canvas context");

            await page.render({ canvasContext: context, viewport: viewport } as any).promise;

            pageCanvases.push(canvas);
            totalHeight += viewport.height;
            maxWidth = Math.max(maxWidth, viewport.width);
        }

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = maxWidth;
        finalCanvas.height = totalHeight;
        const finalContext = finalCanvas.getContext('2d');
        if (!finalContext) throw new Error("Could not create final canvas context");

        let currentY = 0;
        for (const canvas of pageCanvases) {
            finalContext.drawImage(canvas, 0, currentY);
            currentY += canvas.height;
        }

        return finalCanvas.toDataURL('image/jpeg', 0.85);
    } catch (error) {
        console.error("PDF Conversion Error:", error);
        throw new Error("Impossibile convertire il PDF in immagine. Riprova o usa un'immagine JPG/PNG.");
    }
}

export const analyzeBillImage = async (inputBase64: string, priorityType: 'electricity' | 'gas' | 'any' = 'any'): Promise<ExtractedBillData | null> => {
    if (!genAI) {
        throw new Error("Configurazione AI mancante (Gemini API Key).");
    }

    let imageToSend = inputBase64;
    let mimeType = "image/jpeg";
    let base64Data = "";

    try {
        if (inputBase64.includes("application/pdf") || inputBase64.startsWith("JVBERi0")) {
            console.log("Detected PDF. Converting...");
            imageToSend = await convertPdfToImage(inputBase64);
            mimeType = "image/jpeg";
        } else {
            const matches = inputBase64.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
                mimeType = matches[1];
            }
        }

        base64Data = imageToSend.includes("base64,") ? imageToSend.split(",")[1] : imageToSend;

        const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-2.5-flash"];
        let errors: string[] = [];

        let focusInstruction = "";
        if (priorityType === 'electricity') {
            focusInstruction = "CONCENTRATI ESCLUSIVAMENTE SUI DATI DELL'ENERGIA ELETTRICA (LUCE).";
        } else if (priorityType === 'gas') {
            focusInstruction = "CONCENTRATI ESCLUSIVAMENTE SUI DATI DEL GAS METANO.";
        }

        const prompt = `
          Analizza questa immagine di bolletta e estrai i dati tecnici per il confronto.
          ${focusInstruction}
          
          ISTRUZIONI CRITICHE:
          1. SPREAD: Cerca "margine", "fee", "spread", "parametro b" o "contributo al consumo". È un valore aggiunto al prezzo PUN/PSV (es. 0.02 €/kWh o 0.15 €/Smc).
          2. COSTI FISSI / PCV / QVD: Cerca "PCV", "QVD", "commercializzazione", "vendita" o "quota fissa". 
             - IMPORTANTE: Verifica se la bolletta copre 1 mese o 2 mesi (bimestrale). Restituisci SEMPRE il valore MENSILE.
             - ESEMPIO: Se la quota fissa è 30€ per 2 mesi, scrivi 15.00. In Union Energia è spesso 11.50 €/mese.
          3. SINTESI: Non scrivere operazioni matematiche. Solo numeri finali (usa . come separatore decimale).
          4. LINGUA: La bolletta è in Italiano.

          OUTPUT JSON ATTESO:
          {
            "type": "electricity" | "gas" | "both" | "unknown",
            "electricity": { 
                "consumption": number|null (kWh totali), 
                "totalAmount": number|null (€ totale bolletta), 
                "energyQuota": number|null (€ spesa materia energia), 
                "fixedCosts": number|null (€ mensili commercializzazione/PCV, es: 11.50), 
                "pun": number|null (prezzo base PUN), 
                "spread": number|null (margine spread es: 0.021),
                "pod": string|null (codice IT...),
                "power": number|null (potenza impegnata es: 3.3)
            },
            "gas": { 
                "consumption": number|null (Smc totali), 
                "totalAmount": number|null (€ totale bolletta), 
                "energyQuota": number|null (€ spesa materia gas), 
                "fixedCosts": number|null (€ mensili commercializzazione/QVD, es: 11.50), 
                "psv": number|null (prezzo base PSV), 
                "spread": number|null (margine spread es: 0.12),
                "pdr": string|null (codice 14 cifre)
            }
          }
        `;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting analysis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`Timeout model ${modelName}`)), 60000)
                );

                const result = await Promise.race([
                    model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType,
                            },
                        },
                    ]),
                    timeoutPromise
                ]) as any;

                const response = await result.response;
                const responseText = response.text();

                if (responseText && responseText.trim().length > 0) {
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]) as ExtractedBillData;
                    }
                }
            } catch (err: any) {
                console.warn(`Failed with model ${modelName}:`, err.message);

                // Fallback Groq immediato se Gemini ha scadenze di quota
                if (err.message && (err.message.includes("429") || err.message.includes("Quota exceeded"))) {
                    console.warn("Gemini Quota exceeded. Attempting Groq fallback...");
                    try {
                        const groqData = await analyzeWithGroq(base64Data, mimeType, prompt);
                        if (groqData) return groqData;
                        throw new Error("Il fornitore di backup (Groq) non ha restituito dati validi.");
                    } catch (groqErr: any) {
                        // Re-throw the original friendly error if it's the one we threw in analyzeWithGroq
                        if (groqErr.message.includes("Hai raggiunto il limite")) {
                            throw groqErr;
                        }
                        throw new Error(`Limiti raggiunti su Gemini. Backup fallito: ${groqErr.message}`);
                    }
                }
                errors.push(`${modelName}: ${err.message}`);
            }
        }

        throw new Error(`Analisi fallita dopo vari tentativi. Dettagli: ${errors.join(" | ")}`);

    } catch (error: any) {
        console.error("ANALYSIS ERROR:", error);
        throw error;
    }
};
