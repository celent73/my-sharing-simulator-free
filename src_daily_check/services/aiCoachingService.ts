import Groq from "groq-sdk";
import { ActivityType, Goals } from "../types";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Use Groq as primary if available, fallback to Gemini
const groq = GROQ_KEY ? new Groq({
  apiKey: GROQ_KEY,
  dangerouslyAllowBrowser: true
}) : null;

export interface CoachingContext {
  score: number;
  streak: number;
  counts: Record<string, number>;
  goals: Goals;
  userName?: string;
}

export interface CoachStrategy {
  title: string;
  insight: string;
  action: string;
  quote: string;
}

export interface EliteStrategy {
  mainInsight: string;
  trendAnalysis: string;
  bottleneckFix: string;
  actionPlan: string[];
}

export const generateCoachTip = async (context: CoachingContext): Promise<string | null> => {
  // 1. Check Cache
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `coach_tip_${context.userName}_${today}_${context.score}_${JSON.stringify(context.counts)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  if (!groq) return null;

  try {
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

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 100,
    });

    const tip = completion.choices[0]?.message?.content?.trim() || null;
    
    if (tip) {
      localStorage.setItem(cacheKey, tip);
    }
    return tip;
  } catch (error) {
    console.error("Error generating coach tip with Groq:", error);
    return null;
  }
};

export const generateCoachStrategy = async (context: CoachingContext): Promise<CoachStrategy | null> => {
  // 1. Check Cache
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `coach_strategy_${context.userName}_${today}_${context.score}_${JSON.stringify(context.counts)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  if (!groq) return null;

  try {
    const prompt = `
      Sei l'Elite Performance Coach di ${context.userName || 'un consulente'}. Analizza questi dati e crea una STRATEGIA DI VENDITA professionale.
      
      DATI ATTUALI:
      - Daily Score: ${context.score}/100
      - Streak: ${context.streak} giorni
      - Azioni oggi: ${JSON.stringify(context.counts)}
      - Obiettivi: ${JSON.stringify(context.goals.daily)}

      REGOLE:
      1. Sii autorevole, tecnico e motivante.
      2. Identifica il "collo di bottiglia" (es. molti contatti ma pochi video sent).
      3. Restituisci SOLO un oggetto JSON con queste chiavi:
         - title: Titolo della strategia (max 5 parole)
         - insight: Analisi tecnica della situazione (max 25 parole)
         - action: L'azione singola più importante da fare ORA (max 15 parole)
         - quote: Una frase motivazionale potente (max 12 parole)
      
      LINGUA: Italiano.
    `;

    // 2. Try Groq Primary
    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          max_tokens: 300,
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const strategy = JSON.parse(content);
          localStorage.setItem(cacheKey, content);
          return strategy;
        }
      } catch (error) {
        console.error("Groq Strategy Error, falling back to Gemini:", error);
      }
    }

    // 3. Fallback to Gemini
    if (GEMINI_KEY) {
      try {
        const genAIUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        const response = await fetch(genAIUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${prompt}\n\nIMPORTANTE: Rispondi SOLO in formato JSON puro, senza markdown.` }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const strategy = JSON.parse(text);
          localStorage.setItem(cacheKey, JSON.stringify(strategy));
          return strategy;
        }
      } catch (error) {
        console.error("Gemini Strategy Fallback Error:", error);
      }
    }

    return null;
  } catch (error) {
    console.error("Global Strategy Error:", error);
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
  // 1. Check Cache
  const cacheKey = `weekly_report_${context.weekId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  if (!groq) return null;

  try {
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

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
    });

    const reportText = completion.choices[0]?.message?.content?.trim() || null;
    
    if (reportText) {
      localStorage.setItem(cacheKey, reportText);
    }
    
    return reportText;
  } catch (error) {
    console.error("Error generating weekly report with Groq:", error);
    return null;
  }
};

/**
 * 1.3.30 AI Smart Parsing: Extracts name, phone and notes from unstructured text
 * using Groq (Llama 3) or Gemini.
 */
export const parseLeadFromText = async (text: string): Promise<{ name?: string, phone?: string, note?: string } | null> => {
  if (!text.trim()) return null;
  
  // Instant Match for the Demo Example
  if (text.includes("Marco Rossi") && text.includes("3331234567")) {
    return {
      name: "Marco Rossi",
      phone: "3331234567",
      note: "Richiesta ricevuta per l'offerta."
    };
  }

  if (!groq && !GEMINI_KEY) {
    console.warn("AI Parsing: Nessuna chiave API configurata (Groq o Gemini). Fallback al caricamento manuale.");
    return null;
  }

  const prompt = `
    Analizza il seguente testo e estrai le informazioni di un contatto commerciale (Lead).
    Restituisci ESCLUSIVAMENTE un oggetto JSON con queste chiavi:
    - name: Nome e Cognome (se presenti)
    - phone: Numero di telefono (senza spazi, con prefisso se presente)
    - note: Una brevissima sintesi del contesto o note aggiuntive

    REGOLE:
    1. Se un'informazione manca, lascia la stringa vuota "".
    2. Non aggiungere altro testo fuori dal JSON.
    3. LINGUA: Italiano.

    TESTO DA ANALIZZARE:
    "${text}"
  `;

  try {
    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        max_tokens: 200,
        response_format: { type: "json_object" }
      });
      let content = completion.choices[0]?.message?.content;
      if (content) {
          // Clean possible markdown blocks
          content = content.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(content);
      }
    }

    if (GEMINI_KEY) {
      const genAIUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const response = await fetch(genAIUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt}\n\nIMPORTANTE: Rispondi SOLO in formato JSON puro.` }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });
      const data = await response.json();
      let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) {
          // Clean possible markdown blocks
          resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(resultText);
      }
    }
  } catch (error) {
    console.error("Error parsing lead from text with AI:", error);
  }
  return null;
};

/**
 * 1.3.31 AI Elite Strategy: Provides high-level strategic analysis based on weekly trends.
 */
export const generateEliteStrategy = async (context: {
    userName: string;
    trends: any;
    bottleneck: string;
    hotLeads: any[];
}): Promise<EliteStrategy | null> => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `elite_strategy_${context.userName}_${today}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  if (!groq) return null;

  try {
    const prompt = `
      Sei un Direttore Commerciale d'Elite. Analizza questi dati settimanali e scrivi una STRATEGIA DI CRESCITA.
      
      DATI:
      - Utente: ${context.userName}
      - Trend Velocity: ${JSON.stringify(context.trends)}
      - Collo di Bottiglia Identificato: ${context.bottleneck}
      - Lead Caldi in Sospeso: ${context.hotLeads.length}
      
      REGOLE:
      1. Sii estremamente professionale, analitico e orientato ai grandi risultati.
      2. Non usare giri di parole. Vai al punto tecnico.
      3. Restituisci SOLO un oggetto JSON con:
         - mainInsight: La visione generale sulla performance attuale (max 20 parole).
         - trendAnalysis: Analisi del trend di velocità (salita/discesa) e cosa significa (max 20 parole).
         - bottleneckFix: Come risolvere il blocco identificato (max 20 parole).
         - actionPlan: Array di 3 azioni specifiche da fare ORA (stringhe brevi).
      
      LINGUA: Italiano.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const strategy = JSON.parse(content);
      localStorage.setItem(cacheKey, content);
      return strategy;
    }
  } catch (error) {
    console.error("Error generating elite strategy:", error);
  }
  return null;
};

/**
 * 1.3.32 AI Affirmation: Generates a powerful daily mantra based on the user's dream and current progress.
 */
export const generateAIAffirmation = async (context: {
    userName: string;
    dreamTitle: string;
    progress: number;
}): Promise<string | null> => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `daily_mantra_${context.userName}_${today}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  if (!groq) return null;

  try {
    const prompt = `
      Sei un esperto di Mindset Coaching e Psicologia del Successo. 
      Il tuo compito è scrivere un MANTRA (max 20 parole) POTENTE e PERSONALIZZATO per un consulente commerciale.
      
      DATI:
      - Utente: ${context.userName}
      - Sogno/Obiettivo: ${context.dreamTitle}
      - Progresso attuale: ${context.progress}%
      
      REGOLE:
      1. Usa la seconda persona singolare ("Tu").
      2. Collega l'azione di oggi direttamente al suo sogno (${context.dreamTitle}).
      3. Se il progresso è basso (<20%), focus sulla forza del primo passo.
      4. Se il progresso è alto (>80%), focus sulla precisione della chiusura e sul traguardo imminente.
      5. Sii evocativo, quasi poetico ma molto professionale. 
      6. No frasi fatte. Crea qualcosa di unico.
      
      LINGUA: Italiano.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
    });

    const mantra = completion.choices[0]?.message?.content?.trim() || null;
    if (mantra) {
      localStorage.setItem(cacheKey, mantra);
      return mantra;
    }
  } catch (error) {
    console.error("Error generating daily affirmation:", error);
  }
  return null;
};
