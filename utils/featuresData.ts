// Feature Hub - Data Structure & Configuration

export type FeatureCategory = 'simulators' | 'focus' | 'analysis' | 'network' | 'tools';

export interface Feature {
    id: string;
    category: FeatureCategory;
    title: string;
    titleIT: string;
    titleDE: string;
    titleEN: string;
    description: string;
    descriptionIT: string;
    descriptionDE: string;
    descriptionEN: string;
    icon: string;
    color: string;
    isNew: boolean;
    priority: 1 | 2 | 3;

    // Content
    overviewIT: string;
    overviewDE: string;
    overviewEN: string;
    howToIT: string[];
    howToDE: string[];
    howToEN: string[];
    tipsIT: string[];
    tipsDE: string[];
    tipsEN: string[];

    // Actions
    modalId?: string; // ID del modal da aprire con "Prova Ora"
}

export interface Category {
    id: FeatureCategory;
    titleIT: string;
    titleDE: string;
    titleEN: string;
    icon: string;
    color: string;
}

// Categories Configuration
export const CATEGORIES: Category[] = [
    {
        id: 'simulators',
        titleIT: 'Simulatori',
        titleDE: 'Simulatoren',
        titleEN: 'Simulators',
        icon: '🎯',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 'focus',
        titleIT: 'Focus Modes',
        titleDE: 'Focus Modi',
        titleEN: 'Focus Modes',
        icon: '💰',
        color: 'from-amber-400 to-orange-600'
    },
    {
        id: 'analysis',
        titleIT: 'Analisi & Proiezioni',
        titleDE: 'Analyse & Projektionen',
        titleEN: 'Analysis & Projections',
        icon: '📈',
        color: 'from-emerald-400 to-teal-600'
    },
    {
        id: 'network',
        titleIT: 'Network & Community',
        titleDE: 'Netzwerk & Community',
        titleEN: 'Network & Community',
        icon: '🌐',
        color: 'from-purple-500 to-pink-600'
    },
    {
        id: 'tools',
        titleIT: 'Strumenti',
        titleDE: 'Werkzeuge',
        titleEN: 'Tools',
        icon: '⚙️',
        color: 'from-slate-600 to-slate-800'
    }
];

// Features Database (Top 10 MVP)
export const FEATURES: Feature[] = [
    // SIMULATORS
    {
        id: 'sharing-simulator',
        category: 'simulators',
        title: 'My Sharing Simulator',
        titleIT: 'Simulatore Sharing',
        titleDE: 'My Sharing Simulator',
        titleEN: 'My Sharing Simulator',
        description: 'Il simulatore principale per calcolare guadagni e rendite',
        descriptionIT: 'Il simulatore principale per calcolare guadagni e rendite dal piano compensi',
        descriptionDE: 'Der Hauptsimulator zur Berechnung von Einnahmen und Renten',
        descriptionEN: 'The main simulator to calculate earnings and income',
        icon: '💼',
        color: 'blue',
        isNew: false,
        priority: 1,
        overviewIT: 'Il Simulatore Sharing è il cuore dell\'app. Ti permette di simulare matematicamente i tuoi guadagni potenziali basandoti sul piano compensi Union. Gioca con i cursori per vedere come crescono i tuoi guadagni.',
        overviewDE: 'Der My Sharing Simulator ist das Herzstück der App. Er ermöglicht es dir, deine potenziellen Einnahmen basierend auf dem Union-Vergütungsplan mathematisch zu simulieren.',
        overviewEN: 'The My Sharing Simulator is the heart of the app. It allows you to mathematically simulate your potential earnings based on the Union compensation plan.',
        howToIT: [
            'Imposta il numero di reclute dirette (cursore in alto)',
            'Regola la profondità del network (quanti livelli)',
            'Osserva i grafici che si aggiornano in tempo reale',
            'Scorri in basso per vedere le proiezioni a 3 anni'
        ],
        howToDE: [
            'Stelle die Anzahl der direkten Rekruten ein (oberer Schieberegler)',
            'Passe die Netzwerktiefe an (wie viele Ebenen)',
            'Beobachte die Diagramme, die sich in Echtzeit aktualisieren',
            'Scrolle nach unten, um die 3-Jahres-Prognosen zu sehen'
        ],
        howToEN: [
            'Set the number of direct recruits (top slider)',
            'Adjust network depth (how many levels)',
            'Watch the charts update in real-time',
            'Scroll down to see 3-year projections'
        ],
        tipsIT: [
            '💡 Prova diversi scenari: conservativo (2 reclute) vs aggressivo (5+)',
            '💡 Usa il toggle "Shary" per avere suggerimenti vocali',
            '💡 Esporta i risultati in PDF per condividerli'
        ],
        tipsDE: [
            '💡 Probiere verschiedene Szenarien aus: konservativ (2 Rekruten) vs. aggressiv (5+)',
            '💡 Verwende den "Shary"-Schalter für Sprachvorschläge',
            '💡 Exportiere die Ergebnisse als PDF zum Teilen'
        ],
        tipsEN: [
            '💡 Try different scenarios: conservative (2 recruits) vs aggressive (5+)',
            '💡 Use the "Shary" toggle for voice suggestions',
            '💡 Export results to PDF to share'
        ],
        modalId: undefined // Main app, no modal
    },
    {
        id: 'focus-mode',
        category: 'focus',
        title: 'Focus Mode',
        titleIT: 'Focus Mode',
        titleDE: 'Focus Modus',
        titleEN: 'Focus Mode',
        description: 'Sessioni di lavoro produttive con timer e tracking contatti',
        descriptionIT: 'Sessioni di lavoro produttive con timer Pomodoro e tracking contatti chiamati',
        descriptionDE: 'Produktive Arbeitssitzungen mit Pomodoro-Timer und Kontakt-Tracking',
        descriptionEN: 'Productive work sessions with Pomodoro timer and contact tracking',
        icon: '⚡',
        color: 'amber',
        isNew: true,
        priority: 1,
        overviewIT: 'Il Focus Mode ti aiuta a rimanere produttivo durante le sessioni di chiamate. Imposta un timer, definisci il tuo obiettivo, e traccia quanti contatti rispondono. Modalità PRO include checklist pre-volo e statistiche dettagliate.',
        overviewDE: 'Der Focus Mode hilft dir, während der Anrufsitzungen produktiv zu bleiben. Stelle einen Timer ein, definiere dein Ziel und verfolge, wie viele Kontakte antworten.',
        overviewEN: 'Focus Mode helps you stay productive during call sessions. Set a timer, define your goal, and track how many contacts answer.',
        howToIT: [
            'Scegli modalità INSTANT (veloce) o PRO (completa)',
            'In PRO: imposta obiettivo e target contatti',
            'Seleziona durata sessione (15-90 min)',
            'Completa la checklist (solo PRO)',
            'Clicca "INIZIA SESSIONE FOCUS" 🚀',
            'Durante la sessione: traccia "Risposto" o "Non risposto"'
        ],
        howToDE: [
            'Wähle INSTANT (schnell) oder PRO (vollständig) Modus',
            'In PRO: Setze Ziel und Zielkontakte',
            'Wähle Sitzungsdauer (15-90 Min)',
            'Vervollständige die Checkliste (nur PRO)',
            'Klicke "FOCUS-SITZUNG STARTEN" 🚀',
            'Während der Sitzung: Verfolge "Beantwortet" oder "Nicht beantwortet"'
        ],
        howToEN: [
            'Choose INSTANT (quick) or PRO (complete) mode',
            'In PRO: set goal and target contacts',
            'Select session duration (15-90 min)',
            'Complete checklist (PRO only)',
            'Click "START FOCUS SESSION" 🚀',
            'During session: track "Answered" or "Not answered"'
        ],
        tipsIT: [
            '💡 Usa preset obiettivi per risparmiare tempo',
            '💡 Il countdown "Termina alle..." ti aiuta a pianificare',
            '💡 Modalità PRO mostra statistiche: contatti/ora, % successo',
            '💡 Slider target mostra tempo stimato (1-4+ ore)'
        ],
        tipsDE: [
            '💡 Verwende voreingestellte Ziele, um Zeit zu sparen',
            '💡 Der Countdown "Endet um..." hilft dir bei der Planung',
            '💡 PRO-Modus zeigt Statistiken: Kontakte/Stunde, % Erfolg',
            '💡 Ziel-Schieberegler zeigt geschätzte Zeit (1-4+ Stunden)'
        ],
        tipsEN: [
            '💡 Use preset goals to save time',
            '💡 The "Ends at..." countdown helps you plan',
            '💡 PRO mode shows stats: contacts/hour, % success',
            '💡 Target slider shows estimated time (1-4+ hours)'
        ],
        modalId: 'FOCUS_MODE'
    },
    {
        id: 'analisi-utenze',
        category: 'simulators',
        title: 'Analisi Utenze',
        titleIT: 'Analisi Utenze',
        titleDE: 'Verbrauchsanalyse',
        titleEN: 'Utility Analysis',
        description: 'Calcola il cashback sulle tue bollette (luce, gas, telefono)',
        descriptionIT: 'Calcola quanto cashback puoi ottenere dalle tue bollette mensili',
        descriptionDE: 'Berechne, wie viel Cashback du aus deinen monatlichen Rechnungen erhalten kannst',
        descriptionEN: 'Calculate how much cashback you can get from your monthly bills',
        icon: '💡',
        color: 'emerald',
        isNew: false,
        priority: 1,
        overviewIT: 'Analisi Utenze ti mostra quanto cashback puoi guadagnare dalle tue spese mensili (bollette luce, gas, telefono, internet). Inserisci le tue spese e scopri il risparmio annuale.',
        overviewDE: 'Die Verbrauchsanalyse zeigt dir, wie viel Cashback du aus deinen monatlichen Ausgaben (Strom-, Gas-, Telefon-, Internetrechnungen) verdienen kannst.',
        overviewEN: 'Utility Analysis shows you how much cashback you can earn from your monthly expenses (electricity, gas, phone, internet bills).',
        howToIT: [
            'Inserisci la tua spesa mensile totale per utenze',
            'Regola la percentuale di cashback (default 3%)',
            'Visualizza il risparmio mensile e annuale',
            'Usa il Focus Mode per ottimizzare ulteriormente'
        ],
        howToDE: [
            'Gib deine monatlichen Gesamtausgaben für Versorgungsleistungen ein',
            'Passe den Cashback-Prozentsatz an (Standard 3%)',
            'Zeige monatliche und jährliche Ersparnisse an',
            'Verwende den Focus Mode zur weiteren Optimierung'
        ],
        howToEN: [
            'Enter your total monthly utility expenses',
            'Adjust cashback percentage (default 3%)',
            'View monthly and annual savings',
            'Use Focus Mode to optimize further'
        ],
        tipsIT: [
            '💡 Includi TUTTE le utenze per massimizzare il cashback',
            '💡 Il cashback è cumulativo: più spendi, più risparmi',
            '💡 Condividi i risultati con prospect per mostrare il valore'
        ],
        tipsDE: [
            '💡 Schließe ALLE Versorgungsleistungen ein, um das Cashback zu maximieren',
            '💡 Cashback ist kumulativ: Je mehr du ausgibst, desto mehr sparst du',
            '💡 Teile die Ergebnisse mit Interessenten, um den Wert zu zeigen'
        ],
        tipsEN: [
            '💡 Include ALL utilities to maximize cashback',
            '💡 Cashback is cumulative: the more you spend, the more you save',
            '💡 Share results with prospects to show value'
        ],
        modalId: 'ANALISI_UTENZE'
    },
    {
        id: 'sharing-park',
        category: 'simulators',
        title: 'Union Park',
        titleIT: 'Union Park',
        titleDE: 'Union Park',
        titleEN: 'Union Park',
        description: 'Simula investimenti in pannelli solari e ROI',
        descriptionIT: 'Simula investimenti in pannelli solari condivisi e calcola il ROI a lungo termine',
        descriptionDE: 'Simuliere Investitionen in gemeinsame Solarpanels und berechne den langfristigen ROI',
        descriptionEN: 'Simulate investments in shared solar panels and calculate long-term ROI',
        icon: '☀️',
        color: 'green',
        isNew: true,
        priority: 1,
        overviewIT: 'Union Park ti permette di simulare investimenti in pannelli solari condivisi. Calcola il ROI, i guadagni passivi mensili, e il break-even point del tuo investimento.',
        overviewDE: 'Union Park ermöglicht es dir, Investitionen in gemeinsame Solarpanels zu simulieren. Berechne den ROI, monatliche passive Einnahmen und den Break-even-Punkt deiner Investition.',
        overviewEN: 'Union Park allows you to simulate investments in shared solar panels. Calculate ROI, monthly passive income, and break-even point of your investment.',
        howToIT: [
            'Imposta l\'importo di investimento iniziale',
            'Seleziona il numero di pannelli da acquistare',
            'Inserisci il prezzo energia (PUN) attuale',
            'Scegli la durata dell\'investimento (anni)',
            'Visualizza ROI, guadagni mensili e break-even'
        ],
        howToDE: [
            'Lege den anfänglichen Investitionsbetrag fest',
            'Wähle die Anzahl der zu kaufenden Panels',
            'Gib den aktuellen Energiepreis (PUN) ein',
            'Wähle die Investitionsdauer (Jahre)',
            'Zeige ROI, monatliche Einnahmen und Break-even an'
        ],
        howToEN: [
            'Set initial investment amount',
            'Select number of panels to purchase',
            'Enter current energy price (PUN)',
            'Choose investment duration (years)',
            'View ROI, monthly earnings and break-even'
        ],
        tipsIT: [
            '💡 Investimenti solari = reddito passivo a lungo termine',
            '💡 Più pannelli = maggiore produzione energetica',
            '💡 Monitora il PUN per ottimizzare i guadagni'
        ],
        tipsDE: [
            '💡 Solarinvestitionen = langfristiges passives Einkommen',
            '💡 Mehr Panels = höhere Energieproduktion',
            '💡 Überwache den PUN, um die Einnahmen zu optimieren'
        ],
        tipsEN: [
            '💡 Solar investments = long-term passive income',
            '💡 More panels = higher energy production',
            '💡 Monitor PUN to optimize earnings'
        ],
        modalId: 'SHARING_PARK_FOCUS'
    },
    {
        id: 'light-simulator',
        category: 'simulators',
        title: 'Light Simulator',
        titleIT: 'Simulatore Light',
        titleDE: 'Light Simulator',
        titleEN: 'Light Simulator',
        description: 'Versione semplificata del simulatore per quick demo',
        descriptionIT: 'Versione semplificata del simulatore principale, perfetta per demo veloci',
        descriptionDE: 'Vereinfachte Version des Hauptsimulators, perfekt für schnelle Demos',
        descriptionEN: 'Simplified version of the main simulator, perfect for quick demos',
        icon: '🔦',
        color: 'cyan',
        isNew: false,
        priority: 2,
        overviewIT: 'Il Light Simulator è una versione semplificata e veloce del simulatore principale. Perfetto per mostrare rapidamente il potenziale a nuovi prospect senza troppi dettagli tecnici.',
        overviewDE: 'Der Light Simulator ist eine vereinfachte und schnelle Version des Hauptsimulators. Perfekt, um neuen Interessenten schnell das Potenzial zu zeigen, ohne zu viele technische Details.',
        overviewEN: 'The Light Simulator is a simplified and fast version of the main simulator. Perfect for quickly showing potential to new prospects without too many technical details.',
        howToIT: [
            'Imposta solo i parametri essenziali',
            'Visualizza risultati immediati',
            'Condividi con prospect per prime impressioni'
        ],
        howToDE: [
            'Stelle nur die wesentlichen Parameter ein',
            'Zeige sofortige Ergebnisse an',
            'Teile mit Interessenten für erste Eindrücke'
        ],
        howToEN: [
            'Set only essential parameters',
            'View immediate results',
            'Share with prospects for first impressions'
        ],
        tipsIT: [
            '💡 Usa per prime demo rapide (< 5 min)',
            '💡 Poi passa al simulatore completo per dettagli'
        ],
        tipsDE: [
            '💡 Verwende für schnelle erste Demos (< 5 Min)',
            '💡 Wechsle dann zum vollständigen Simulator für Details'
        ],
        tipsEN: [
            '💡 Use for quick first demos (< 5 min)',
            '💡 Then switch to full simulator for details'
        ],
        modalId: 'LIGHT_SIMULATOR'
    },
    {
        id: 'target-calculator',
        category: 'analysis',
        title: 'Target Calculator',
        titleIT: 'Calcolatore Obiettivi',
        titleDE: 'Zielrechner',
        titleEN: 'Target Calculator',
        description: 'Calcola quante reclute servono per raggiungere un obiettivo',
        descriptionIT: 'Calcola quante reclute ti servono per raggiungere un obiettivo di guadagno mensile',
        descriptionDE: 'Berechne, wie viele Rekruten du benötigst, um ein monatliches Einkommensziel zu erreichen',
        descriptionEN: 'Calculate how many recruits you need to reach a monthly income goal',
        icon: '🎯',
        color: 'purple',
        isNew: false,
        priority: 2,
        overviewIT: 'Il Target Calculator lavora al contrario: tu inserisci quanto vuoi guadagnare al mese, e lui ti dice quante reclute dirette e di profondità ti servono per raggiungerlo.',
        overviewDE: 'Der Zielrechner arbeitet umgekehrt: Du gibst ein, wie viel du pro Monat verdienen möchtest, und er sagt dir, wie viele direkte Rekruten und Tiefe du benötigst, um dies zu erreichen.',
        overviewEN: 'The Target Calculator works in reverse: you enter how much you want to earn per month, and it tells you how many direct recruits and depth you need to achieve it.',
        howToIT: [
            'Inserisci il tuo obiettivo di guadagno mensile (€)',
            'Il calcolatore mostra diverse combinazioni possibili',
            'Scegli la strategia che preferisci (poche reclute profonde vs molte reclute shallow)'
        ],
        howToDE: [
            'Gib dein monatliches Einkommensziel (€) ein',
            'Der Rechner zeigt verschiedene mögliche Kombinationen',
            'Wähle die Strategie, die du bevorzugst (wenige tiefe Rekruten vs. viele flache Rekruten)'
        ],
        howToEN: [
            'Enter your monthly income goal (€)',
            'Calculator shows different possible combinations',
            'Choose the strategy you prefer (few deep recruits vs many shallow recruits)'
        ],
        tipsIT: [
            '💡 Obiettivi realistici: inizia con €500-1000/mese',
            '💡 Profondità > Larghezza per crescita esponenziale'
        ],
        tipsDE: [
            '💡 Realistische Ziele: Beginne mit €500-1000/Monat',
            '💡 Tiefe > Breite für exponentielles Wachstum'
        ],
        tipsEN: [
            '💡 Realistic goals: start with €500-1000/month',
            '💡 Depth > Width for exponential growth'
        ],
        modalId: 'TARGET_CALCULATOR'
    },
    {
        id: 'projection-modal',
        category: 'analysis',
        title: 'Projection Modal',
        titleIT: 'Proiezioni 3 Anni',
        titleDE: '3-Jahres-Prognosen',
        titleEN: '3-Year Projections',
        description: 'Visualizza proiezioni dettagliate a 1, 2 e 3 anni',
        descriptionIT: 'Visualizza proiezioni dettagliate dei tuoi guadagni a 1, 2 e 3 anni con grafici interattivi',
        descriptionDE: 'Zeige detaillierte Prognosen deiner Einnahmen für 1, 2 und 3 Jahre mit interaktiven Diagrammen',
        descriptionEN: 'View detailed projections of your earnings at 1, 2 and 3 years with interactive charts',
        icon: '📊',
        color: 'indigo',
        isNew: false,
        priority: 2,
        overviewIT: 'Il Projection Modal ti mostra come cresceranno i tuoi guadagni nel tempo. Grafici interattivi mostrano l\'evoluzione mese per mese con scenari ottimistici, realistici e conservativi.',
        overviewDE: 'Das Projection Modal zeigt dir, wie deine Einnahmen im Laufe der Zeit wachsen werden. Interaktive Diagramme zeigen die monatliche Entwicklung mit optimistischen, realistischen und konservativen Szenarien.',
        overviewEN: 'The Projection Modal shows you how your earnings will grow over time. Interactive charts show month-by-month evolution with optimistic, realistic and conservative scenarios.',
        howToIT: [
            'Apri dal simulatore principale',
            'Visualizza grafici a 1, 2, 3 anni',
            'Confronta scenari diversi',
            'Esporta per presentazioni'
        ],
        howToDE: [
            'Öffne vom Hauptsimulator',
            'Zeige Diagramme für 1, 2, 3 Jahre',
            'Vergleiche verschiedene Szenarien',
            'Exportiere für Präsentationen'
        ],
        howToEN: [
            'Open from main simulator',
            'View charts for 1, 2, 3 years',
            'Compare different scenarios',
            'Export for presentations'
        ],
        tipsIT: [
            '💡 Usa per mostrare il potenziale a lungo termine',
            '💡 Scenario realistico = più credibile con prospect'
        ],
        tipsDE: [
            '💡 Verwende, um langfristiges Potenzial zu zeigen',
            '💡 Realistisches Szenario = glaubwürdiger bei Interessenten'
        ],
        tipsEN: [
            '💡 Use to show long-term potential',
            '💡 Realistic scenario = more credible with prospects'
        ],
        modalId: 'PROJECTION'
    },
    {
        id: 'network-visualizer',
        category: 'network',
        title: 'Network Visualizer',
        titleIT: 'Visualizzatore Network',
        titleDE: 'Netzwerk-Visualisierer',
        titleEN: 'Network Visualizer',
        description: 'Visualizza la tua rete in modo interattivo e grafico',
        descriptionIT: 'Visualizza la struttura della tua rete in modo interattivo con grafico ad albero',
        descriptionDE: 'Visualisiere die Struktur deines Netzwerks interaktiv mit Baumdiagramm',
        descriptionEN: 'Visualize your network structure interactively with tree diagram',
        icon: '🌳',
        color: 'teal',
        isNew: false,
        priority: 2,
        overviewIT: 'Il Network Visualizer mostra la tua rete come un albero interattivo. Ogni nodo rappresenta una persona, con dettagli su livello, guadagni e sotto-rete.',
        overviewDE: 'Der Netzwerk-Visualisierer zeigt dein Netzwerk als interaktiven Baum. Jeder Knoten repräsentiert eine Person mit Details zu Ebene, Einnahmen und Unter-Netzwerk.',
        overviewEN: 'The Network Visualizer shows your network as an interactive tree. Each node represents a person with details on level, earnings and sub-network.',
        howToIT: [
            'Visualizza la struttura gerarchica',
            'Clicca sui nodi per espandere/collassare',
            'Vedi statistiche per ogni livello',
            'Identifica aree di crescita'
        ],
        howToDE: [
            'Zeige hierarchische Struktur',
            'Klicke auf Knoten zum Erweitern/Zusammenklappen',
            'Siehe Statistiken für jede Ebene',
            'Identifiziere Wachstumsbereiche'
        ],
        howToEN: [
            'View hierarchical structure',
            'Click nodes to expand/collapse',
            'See statistics for each level',
            'Identify growth areas'
        ],
        tipsIT: [
            '💡 Usa per identificare "buchi" nel network',
            '💡 Focus su livelli con poche persone'
        ],
        tipsDE: [
            '💡 Verwende, um "Löcher" im Netzwerk zu identifizieren',
            '💡 Fokus auf Ebenen mit wenigen Personen'
        ],
        tipsEN: [
            '💡 Use to identify "holes" in network',
            '💡 Focus on levels with few people'
        ],
        modalId: 'NETWORK_VISUALIZER'
    },
    {
        id: 'shary-ai',
        category: 'tools',
        title: 'Shary AI',
        titleIT: 'Shary AI',
        titleDE: 'Shary KI',
        titleEN: 'Shary AI',
        description: 'Assistente vocale AI che ti guida passo-passo',
        descriptionIT: 'Assistente vocale AI che ti guida passo-passo nell\'uso dell\'app con suggerimenti intelligenti',
        descriptionDE: 'KI-Sprachassistent, der dich Schritt für Schritt durch die App führt mit intelligenten Vorschlägen',
        descriptionEN: 'AI voice assistant that guides you step-by-step through the app with smart suggestions',
        icon: '🤖',
        color: 'cyan',
        isNew: false,
        priority: 2,
        overviewIT: 'Shary è il tuo assistente AI personale. Attivalo dal toggle in alto e riceverai suggerimenti vocali mentre usi l\'app. Perfetto per imparare velocemente.',
        overviewDE: 'Shary ist dein persönlicher KI-Assistent. Aktiviere ihn über den Schalter oben und erhalte Sprachvorschläge während du die App verwendest. Perfekt zum schnellen Lernen.',
        overviewEN: 'Shary is your personal AI assistant. Activate it from the toggle at the top and receive voice suggestions while using the app. Perfect for learning quickly.',
        howToIT: [
            'Attiva il toggle "Shary" in alto a destra',
            'Shary ti parlerà quando fai azioni importanti',
            'Ricevi suggerimenti contestuali',
            'Disattiva quando non serve più'
        ],
        howToDE: [
            'Aktiviere den "Shary"-Schalter oben rechts',
            'Shary spricht mit dir, wenn du wichtige Aktionen ausführst',
            'Erhalte kontextbezogene Vorschläge',
            'Deaktiviere, wenn nicht mehr benötigt'
        ],
        howToEN: [
            'Activate "Shary" toggle at top right',
            'Shary will speak when you do important actions',
            'Receive contextual suggestions',
            'Deactivate when no longer needed'
        ],
        tipsIT: [
            '💡 Ideale per nuovi utenti',
            '💡 Funziona in IT, DE, EN',
            '💡 Rispetta la privacy: tutto locale'
        ],
        tipsDE: [
            '💡 Ideal für neue Benutzer',
            '💡 Funktioniert in IT, DE, EN',
            '💡 Respektiert Privatsphäre: alles lokal'
        ],
        tipsEN: [
            '💡 Ideal for new users',
            '💡 Works in IT, DE, EN',
            '💡 Respects privacy: all local'
        ],
        modalId: undefined // Toggle in header
    }
];

// Helper functions
export const getFeaturesByCategory = (category: FeatureCategory): Feature[] => {
    return FEATURES.filter(f => f.category === category);
};

export const getFeatureById = (id: string): Feature | undefined => {
    return FEATURES.find(f => f.id === id);
};

export const searchFeatures = (query: string, language: 'it' | 'de' | 'en'): Feature[] => {
    const lowerQuery = query.toLowerCase();
    return FEATURES.filter(f => {
        const title = language === 'it' ? f.titleIT : language === 'de' ? f.titleDE : f.titleEN;
        const desc = language === 'it' ? f.descriptionIT : language === 'de' ? f.descriptionDE : f.descriptionEN;
        return title.toLowerCase().includes(lowerQuery) || desc.toLowerCase().includes(lowerQuery);
    });
};

export const getNewFeatures = (): Feature[] => {
    return FEATURES.filter(f => f.isNew);
};

export const getCategoryTitle = (category: Category, language: 'it' | 'de' | 'en'): string => {
    return language === 'it' ? category.titleIT : language === 'de' ? category.titleDE : category.titleEN;
};
