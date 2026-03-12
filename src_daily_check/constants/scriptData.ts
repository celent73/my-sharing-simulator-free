
export type ScriptCategory = 'All' | 'Primo Contatto' | 'Follow-Up' | 'Obiezioni' | 'Chiusura';

export interface SalesScript {
    id: string;
    category: ScriptCategory;
    title: string;
    description?: string;
    text: string;
    icon: string;
}

export const SALES_SCRIPTS: SalesScript[] = [
    // --- PRIMO CONTATTO ---
    {
        id: 'contact-opinion',
        category: 'Primo Contatto',
        title: 'Approccio "Opinione"',
        description: 'Ideale per persone che stimi o che hanno esperienza.',
        text: 'Ciao [Nome], sto avviando un progetto nel settore energia e so che sei una persona molto attenta a efficienza e risparmio. Mi farebbe piacere avere un tuo parere sincero su un video di 3 minuti che spiega l\'idea. Saresti aperto a darmi un\'occhiata veloce?',
        icon: '💡'
    },
    {
        id: 'contact-problem',
        category: 'Primo Contatto',
        title: 'Problema/Soluzione',
        description: 'Per chi si lamenta dei costi o del lavoro.',
        text: 'Ehi [Nome], ho visto il tuo post su [Problema]. Sto lavorando con un gruppo di persone che ha trovato un modo per [Soluzione]. Se ti mandassi una breve info, saresti curioso di capire come funziona?',
        icon: '🎯'
    },
    {
        id: 'contact-bill',
        category: 'Primo Contatto',
        title: 'Risparmio in Bolletta',
        description: 'Approccio diretto sul prodotto.',
        text: 'Ciao [Nome], sto aiutando diverse famiglie ad azzerare o ridurre drasticamente i costi delle bollette grazie a Union Energia. Se ti facessi vedere come puoi smettere di pagare la componente energia, vorresti saperne di più?',
        icon: '⚡'
    },

    // --- OBIEZIONI ---
    {
        id: 'obj-no-time',
        category: 'Obiezioni',
        title: 'Non ho tempo',
        description: 'Risposta alla mancanza di tempo.',
        text: 'Ti capisco perfettamente, proprio per questo ti chiamo. La maggior parte delle persone che lavora con noi ha iniziato proprio perché voleva avere più tempo libero. Se ti mostrassi come questo progetto può generare tempo oltre che denaro, mi dedicheresti 15 minuti?',
        icon: '⏱️'
    },
    {
        id: 'obj-pyramid',
        category: 'Obiezioni',
        title: 'È una piramide?',
        description: 'Chiarimento sul modello di business.',
        text: 'Capisco il dubbio. Ti riferisci a quegli schemi illegali dove chi arriva prima guadagna su tutti? Assolutamente no. Union Energia è un\'azienda italiana regolamentata. Qui guadagni sul fatturato che generi tu e la tua squadra, con totale meritocrazia. È un business etico, vuoi approfondire come funziona?',
        icon: '🔺'
    },
    {
        id: 'obj-wife-husband',
        category: 'Obiezioni',
        title: 'Devo parlarne con mia moglie/marito',
        description: 'Quando devono consultare il partner.',
        text: 'Ottimo, significa che la sua opinione conta molto per te. Di solito quando si coinvolge il partner è perché il progetto piace. Cosa pensi che ti chiederebbe per prima cosa? Se vuoi, possiamo organizzare una breve chiamata a tre così spieghiamo tutto bene a entrambi.',
        icon: '🏠'
    },
    {
        id: 'obj-no-money',
        category: 'Obiezioni',
        title: 'Non ho soldi',
        description: 'Gestione del problema economico.',
        text: 'Proprio perché mi dici così penso sia importante che tu valuti questa opportunità. Molti di noi hanno iniziato proprio per cambiare la propria situazione finanziaria. Se il costo non fosse un problema, l\'attività in sé ti piacerebbe?',
        icon: '💸'
    },
    {
        id: 'obj-happy-provider',
        category: 'Obiezioni',
        title: 'Sono contento del mio fornitore',
        description: 'Per chi non vuole cambiare.',
        text: 'Mi fa piacere che tu sia soddisfatto! Non ti chiedo di cambiare per insoddisfazione, ma per opportunità. Se esistesse un modo per avere lo stesso servizio ma con la possibilità di azzerare la bolletta condividendo l\'idea, vorresti almeno sapere come facciamo?',
        icon: '😊'
    },

    // --- FOLLOW-UP ---
    {
        id: 'fw-video',
        category: 'Follow-Up',
        title: 'Dopo l\'invio del video',
        description: 'Per riaprire la conversazione.',
        text: 'Ehi [Nome], sei riuscito a vedere il video che ti ho mandato? Cosa ti è piaciuto di più di quello che hai visto?',
        icon: '📱'
    },
    {
        id: 'fw-soft',
        category: 'Follow-Up',
        title: 'Follow-up "Leggero"',
        description: 'Se non rispondono da un po\'.',
        text: 'Ciao [Nome], non ci siamo più sentiti e volevo assicurarmi che il progetto non fosse finito nello spam del tuo interesse! Sei ancora curioso di approfondire o passiamo oltre per ora?',
        icon: '🍃'
    },

    // --- CHIUSURA ---
    {
        id: 'close-choice',
        category: 'Chiusura',
        title: 'La Scelta Doppia',
        description: 'Per portare alla decisione.',
        text: 'Bene [Nome], abbiamo visto tutto. A questo punto, ti vedi più come un utente che vuole iniziare a risparmiare sulle proprie bollette o come un partner che vuole anche generare un\'entrata extra?',
        icon: '⚖️'
    },
    {
        id: 'close-ready',
        category: 'Chiusura',
        title: 'Pronto per iniziare?',
        description: 'Chiamata all\'azione diretta.',
        text: 'Perfetto, mi sembra tutto chiaro. C\'è qualche altro dubbio che ti impedisce di iniziare oggi stesso il tuo percorso con noi?',
        icon: '🚀'
    }
];
