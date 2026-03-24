import { GoogleGenerativeAI } from "@google/generative-ai";
import { ActivityType, Goals } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface CoachingContext {
  score: number;
  streak: number;
  counts: Record<string, number>;
  goals: Goals;
  userName?: string;
}

export const generateCoachTip = async (context: CoachingContext): Promise<string | null> => {
  if (!genAI) return null;

  // 1. Check Cache (Cost Saving)
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `coach_tip_${context.userName}_${today}_${context.score}_${JSON.stringify(context.counts)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      Sei un Coach esperto in network marketing e vendita. Il tuo compito è dare un consiglio BREVE (max 15 parole) e MOTIVANTE basato sui dati odierni dell'utente.

      DATI UTENTE:
      - Nome: ${context.userName || 'Campione'}
      - Daily Score: ${context.score}/100
      - Streak: ${context.streak} giorni consecutivi al top
      - Azioni fatte (counts): ${JSON.stringify(context.counts)}
      - Obiettivi giornalieri (goals): ${JSON.stringify(context.goals.daily)}

      REGOLE:
      1. Sii specifico: se ha fatto tanti contatti ma zero appuntamenti, spingilo a fissare.
      2. Se lo score è 0, spingilo a fare la prima piccola azione.
      3. Se lo score è 100, fagli un complimento da pro.
      4. Usa un tono energico e professionale.
      5. LINGUA: Italiano.

      ESEMPIO: "Ottimi contatti! Ora trasforma quel calore in 2 appuntamenti fissi. Vai!"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tip = response.text().trim();
    
    // 2. Save to Cache
    localStorage.setItem(cacheKey, tip);
    return tip;
  } catch (error) {
    console.error("Error generating coach tip:", error);
    return null;
  }
};

export interface WeeklyContext {
  logs: any[]; // ActivityLog[]
  goals: Goals;
  userName?: string;
  weekId: string;
}

export const generateWeeklyReport = async (context: WeeklyContext): Promise<string | null> => {
  if (!genAI) return null;

  // 1. Check Cache
  const cacheKey = `weekly_report_${context.weekId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      Sei un Sales Director esperto. Analizza le performance settimanali di questo consulente e scrivi un REPORT STRATEGICO.
      
      DATI SETTIMANALI:
      - Nome: ${context.userName || 'Campione'}
      - Settimana: ${context.weekId}
      - Storico Azioni: ${JSON.stringify(context.logs)}
      - Obiettivi Settimanali (goals): ${JSON.stringify(context.goals.weekly)}

      STRUTTURA DEL REPORT (Usa questo schema preciso):
      🏆 VITTORIA DELLA SETTIMANA: (Un successo basato sui numeri, max 10 parole)
      📈 TREND: (Salita o discesa rispetto ai giorni precedenti? Sii specifico sui dati)
      💡 IL CONSIGLIO DEL DIRETTORE: (Un'azione concreta da fare lunedì prossimo per svoltare)
      🎯 MISSIONE PROSSIMA SETTIMANA: (Un obiettivo numerico sfidante)

      LINGUA: Italiano. Sii autorevole, energico e orientato ai risultati.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reportText = response.text().trim();
    
    // 2. Save to Cache
    localStorage.setItem(cacheKey, reportText);
    
    return reportText;
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return null;
  }
};
