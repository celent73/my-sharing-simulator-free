import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Termini e Condizioni d'Uso
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Ultimo aggiornamento: 2 Dicembre 2024
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Premessa</h2>
          <p>
            I presenti Termini e Condizioni regolano l'accesso e l'utilizzo dell'applicazione web
            "Sharing Simulator", di proprietà di <strong>Luca Celentano</strong>.
          </p>

          <h2>2. Licenza d'Uso</h2>
          <p>
            Il Titolare concede all'Utente una licenza <strong>NON esclusiva, NON trasferibile, PERSONALE e REVOCABILE</strong>.
          </p>

          <h3>Tipologie di Licenza:</h3>
          <ul>
            <li><strong>Una Tantum (€5,99):</strong> Accesso illimitato, aggiornamenti 12 mesi</li>
            <li><strong>Mensile (€1,99/mese):</strong> Accesso finché attivo, aggiornamenti continui</li>
          </ul>

          <h2>3. Divieti</h2>
          <p><strong>È SEVERAMENTE VIETATO:</strong></p>
          <ul>
            <li>Copiare, riprodurre o duplicare l'App</li>
            <li>Modificare o creare opere derivate</li>
            <li>Decompilare o effettuare reverse engineering</li>
            <li>Rivendere, cedere o sublicenziare</li>
            <li>Condividere credenziali con terzi</li>
            <li>Rimuovere notice di copyright</li>
          </ul>

          <h2>4. Proprietà Intellettuale</h2>
          <p>
            Tutti i diritti di proprietà intellettuale sono di <strong>proprietà esclusiva di Luca Celentano</strong>
            e sono protetti dalle leggi italiane ed internazionali.
          </p>

          <h2>5. Pagamenti e Rimborsi</h2>
          <p>
            <strong>Garanzia 14 giorni:</strong> Rimborso completo entro 14 giorni dall'acquisto
            (Diritto di recesso D.Lgs. 206/2005).
          </p>

          <h2>6. Limitazione di Responsabilità</h2>
          <p>
            L'App è fornita "COSÌ COM'È". Il Titolare non è responsabile per danni diretti,
            indiretti o consequenziali. Massima responsabilità limitata all'importo pagato.
          </p>

          <h2>7. Legge Applicabile</h2>
          <p>
            I presenti Termini sono regolati dalla <strong>legge italiana</strong>.
          </p>

          <h2>8. Contatti</h2>
          <p>
            <strong>Luca Celentano</strong><br />
            Email: <a href="mailto:celesharing@gmail.com" className="text-blue-600 hover:underline">celesharing@gmail.com</a>
          </p>

          <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>© 2024-2025 Luca Celentano - Tutti i diritti riservati</strong>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
