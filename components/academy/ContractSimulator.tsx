import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Check, FileText, ChevronDown, AlertCircle, Save, Info } from 'lucide-react';

const ContractSimulator: React.FC = () => {
    // Form State (Simplified for basic interaction)
    const [formData, setFormData] = useState({
        sponsor: '',
        familyUtility: '',
        clientType: 'Persona Fisica',
        firstName: '',
        lastName: '',
        email: '',
        fiscalCode: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        residenceAddress: '',
        zipCode: '',
        phone: '',
        mobile: '',

        // Supply Data
        immobileType: '',
        residency: true,
        agency: false,
        supplyAddress: '',
        supplyZip: '',

        // Light
        lightPod: '',
        lightResidence: 'Si',
        lightUso: 'Domestico',
        lightAnnualConsumption: '',
        lightPower: '',
        lightContractualPower: '',
        lightVoltage: '',
        marketOrigin: '',

        // Gas
        gasPdr: '',
        gasUsage: '',

        // Payment
        paymentMethod: 'ADDEBITO DIRETTO SU CONTO (SDD)',
        iban: '',
        holderName: '',

        // Consents
        marketing: false,
        profiling: false,
        rethinking: false,

        // Missing Properties
        propertyRight: '',
        ivaReduced: false,
        acciseReduced: false,
        supplyMunicipality: '',
        supplyCivic: '',
        supplyCap: '',
    });

    const handleScrollToTop = () => {
        const element = document.getElementById('contract-form-container');
        if (element) element.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="contract-form-container" className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-[2rem] no-scrollbar">
            <div className="max-w-[95%] mx-auto space-y-6 pb-20">

                {/* Header Title */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#003366] dark:text-blue-400 tracking-tight flex items-baseline gap-3">
                        Nuovo Contratto
                        <span className="text-lg sm:text-xl font-medium text-gray-500 dark:text-gray-400">(Working progress)</span>
                    </h1>
                </div>

                {/* Video Tutorial Banner */}
                <div
                    onClick={() => window.open('https://youtu.be/I-qvbrjrkjs', '_blank')}
                    className="bg-[#FF6600] text-white p-3 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md cursor-pointer hover:bg-orange-600 transition-colors"
                >
                    <div className="bg-white/20 p-1 rounded-full"><Info size={16} /></div>
                    <span>Video Tutorial: Come inserire un Contratto con Union Energia?</span>
                </div>

                {/* Upload Sections (Bill Scanning) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Light Bill */}
                    <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex flex-col justify-between gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Upload size={64} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold mb-1">
                                <Search size={16} />
                                <span>Novità: carica la fattura e precompila il contratto con l'IA!</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#003366] dark:text-white">Fattura Luce</h3>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-tight mt-1">
                                La più recente o contenente consumo annuo, indirizzo di fornitura, dati di fornitura completi
                            </p>
                        </div>
                        <button className="self-end bg-[#0099FF] hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded shadow-md transition-all flex items-center gap-1 z-10 w-full sm:w-auto justify-center">
                            Aggiungi allegato <span className="text-lg leading-none">+</span>
                        </button>
                    </div>

                    {/* Gas Bill */}
                    <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex flex-col justify-between gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Upload size={64} className="text-orange-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 font-bold mb-1">
                                <Search size={16} />
                                <span>Novità: carica la fattura e precompila il contratto con l'IA!</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#FF6600] dark:text-orange-400">Fattura Gas</h3>
                            <p className="text-xs text-orange-700 dark:text-orange-300 leading-tight mt-1">
                                La più recente o contenente consumo annuo, indirizzo di fornitura, dati di fornitura completi
                            </p>
                        </div>
                        <button className="self-end bg-[#FF6600] hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded shadow-md transition-all flex items-center gap-1 z-10 w-full sm:w-auto justify-center">
                            Aggiungi allegato <span className="text-lg leading-none">+</span>
                        </button>
                    </div>
                </div>

                {/* Sponsor & Family Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase text-blue-600 font-bold mb-1 ml-1">Sponsor Codice/Ref *</label>
                        <input
                            type="text"
                            value={formData.sponsor}
                            onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded p-2 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:border-blue-500"
                        />
                        <p className="text-[9px] text-orange-500 mt-1 ml-1 bg-yellow-50 dark:bg-transparent px-1 inline-block rounded">Per cambiare Sponsor inizia a scrivere nella casella il nome del membro</p>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1 ml-1">Family Utility</label>
                        <input
                            type="text"
                            value={formData.familyUtility}
                            onChange={(e) => setFormData({ ...formData, familyUtility: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded p-2 text-sm text-gray-500 dark:text-gray-400 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* SECTION: Dati Cliente */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Dati cliente persona fisica (uso domestico) o del rappresentante legale o delegato (altri usi o business)</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded text-xs text-blue-800 dark:text-blue-300 mb-2 border border-blue-100 dark:border-blue-800">
                            Cerca tra le anagrafiche dei tuoi contratti per nome, cognome, email, ragione sociale o CF o recupera i dati cliccando sui risultati.
                        </div>

                        <input
                            type="text"
                            placeholder="INIZIA A SCRIVERE PER CERCARE..."
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded p-2 text-xs outline-none focus:border-blue-500 mb-2"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <label className="lbl">Tipologia cliente</label>
                                <select
                                    className="inp"
                                    value={formData.clientType}
                                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                                >
                                    <option value=""></option>
                                    <option>Persona fisica</option>
                                    <option>Ditta individuale</option>
                                    <option>Società di persone: s.a.s, s.n.c.</option>
                                    <option>Società di capitali: s.r.l., s.r.l.s., s.p.a.</option>
                                    <option>Condominio</option>
                                    <option>Associazione</option>
                                    <option>Caserme, scuole, case di riposo, orfanotrofi, condomini ( circolare ministero delle finanze n.82/e del 7/4/1999)</option>
                                    <option>Pubblica illluminazione</option>
                                    <option>Pubblica amministrazione</option>
                                </select>
                            </div>
                            <div>
                                <label className="lbl">Nome *</label>
                                <input type="text" className="inp" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div>
                                <label className="lbl">Cognome *</label>
                                <input type="text" className="inp" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                            <div>
                                <label className="lbl">Email *</label>
                                <input type="email" className="inp" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="lbl">Conferma Email *</label>
                                <input type="email" className="inp" value={formData.email} onChange={() => { }} />
                            </div>
                            <div>
                                <label className="lbl">CF *</label>
                                <input type="text" className="inp uppercase" value={formData.fiscalCode} onChange={(e) => setFormData({ ...formData, fiscalCode: e.target.value })} />
                            </div>
                            <div>
                                <label className="lbl">Sesso</label>
                                <select className="inp bg-white" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value=""></option>
                                    <option value="M">M</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>

                        {/* Residence & Contact Info */}
                        <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-700 mt-2">
                            {/* Comune Nascita + Soppresso */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-end gap-4">
                                    <div className="flex-grow w-full">
                                        <label className="lbl">Comune nascita *</label>
                                        <input type="text" className="inp uppercase" placeholder="INIZIA A SCRIVERE PER CERCARE..." />
                                    </div>
                                    <label className="flex items-center gap-2 mb-2 cursor-pointer whitespace-nowrap">
                                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Comune di nascita soppresso?</span>
                                    </label>
                                </div>
                                <p className="text-[11px] text-gray-500 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 mt-1 rounded border border-yellow-100 dark:border-yellow-800/30">
                                    Selezionare <span className="font-bold">'Estero'</span> per comuni non italiani. Se il comune di nascita è soppresso, selezionare la denominazione attuale e spuntare la casella "Comune di nascita soppresso"?
                                </p>
                            </div>

                            {/* Data Nascita */}
                            <div>
                                <label className="lbl">Data nascita **</label>
                                <div className="flex gap-2 items-center">
                                    <input type="text" placeholder="GIORNO" className="inp text-center flex-1" />
                                    <span className="text-gray-400 font-light">/</span>
                                    <input type="text" placeholder="MESE" className="inp text-center flex-1" />
                                    <span className="text-gray-400 font-light">/</span>
                                    <input type="text" placeholder="ANNO" className="inp text-center flex-1" />
                                </div>
                            </div>

                            {/* Comune Residenza + Indirizzo Split */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="lbl">Comune residenza *</label>
                                    <input type="text" className="inp uppercase" placeholder="INIZIA A SCRIVERE PER CERCARE..." />
                                </div>
                                <div>
                                    <label className="lbl">Indirizzo residenza</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="inp w-1/3" placeholder="AD ES. VIA, PIAZZA..." />
                                        <input type="text" className="inp w-2/3" placeholder="AD ES. GARIBALDI..." />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 rounded border border-yellow-100 dark:border-yellow-800/30 inline-block">
                                Selezionare <span className="font-bold">'Estero'</span> per comuni non italiani.
                            </p>

                            {/* Civico + CAP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="lbl">Civico residenza *</label>
                                    <input type="text" className="inp" />
                                </div>
                                <div>
                                    <label className="lbl">CAP residenza *</label>
                                    <input type="text" className="inp" />
                                </div>
                            </div>

                            {/* Telefono + Cellulare */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="lbl">Telefono fisso</label>
                                    <input type="text" className="inp" />
                                </div>
                                <div>
                                    <label className="lbl">Cellulare</label>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <select className="inp w-20 appearance-none bg-white dark:bg-slate-800 pr-6">
                                                <option>+39</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                                <ChevronDown size={12} />
                                            </div>
                                        </div>
                                        <input type="text" className="inp flex-grow" />
                                    </div>
                                </div>
                            </div>

                            {/* Email Recapito Fatture */}
                            <div>
                                <label className="lbl">Email per recapito fatture</label>
                                <input type="email" className="inp" />
                                <p className="text-[11px] text-gray-500 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 mt-1 rounded border border-yellow-100 dark:border-yellow-800/30 inline-block">
                                    Compilare solo se diversa dalla email di registrazione
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Dati Fornitura (Immobile) */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Dati fornitura</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-6">
                        {/* Diritto su immobile */}
                        <div>
                            <label className="lbl">Diritto su immobile</label>
                            <select
                                className="inp"
                                value={formData.propertyRight}
                                onChange={(e) => setFormData({ ...formData, propertyRight: e.target.value })}
                            >
                                <option value=""></option>
                                <option>Proprietario</option>
                                <option>Usufrutto</option>
                                <option>Titolare di altro diritto</option>
                                <option>Rappresentante legale</option>
                                <option>Affittuario</option>
                            </select>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.ivaReduced}
                                    onChange={(e) => setFormData({ ...formData, ivaReduced: e.target.checked })}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Iva agevolata?</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.acciseReduced}
                                    onChange={(e) => setFormData({ ...formData, acciseReduced: e.target.checked })}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Accise agevolate?</span>
                            </label>
                        </div>

                        {/* Indirizzo Fornitura */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Comune fornitura*</label>
                                <input
                                    type="text"
                                    className="inp uppercase"
                                    placeholder="INIZIA A SCRIVERE PER CERCARE..."
                                    value={formData.supplyMunicipality}
                                    onChange={(e) => setFormData({ ...formData, supplyMunicipality: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="lbl">Indirizzo fornitura</label>
                                <div className="flex gap-2">
                                    <input type="text" className="inp w-1/3" placeholder="AD ES. VIA, PIAZZA..." />
                                    <input
                                        type="text"
                                        className="inp w-2/3"
                                        placeholder="AD ES. GARIBALDI..."
                                        value={formData.supplyAddress}
                                        onChange={(e) => setFormData({ ...formData, supplyAddress: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Civico + CAP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Civico fornitura*</label>
                                <input
                                    type="text"
                                    className="inp"
                                    value={formData.supplyCivic}
                                    onChange={(e) => setFormData({ ...formData, supplyCivic: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="lbl">CAP fornitura*</label>
                                <input
                                    type="text"
                                    className="inp"
                                    value={formData.supplyCap}
                                    onChange={(e) => setFormData({ ...formData, supplyCap: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Dati Luce */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Dati fornitura luce elettrica</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="text-[10px] text-blue-600 mb-2">Lasciare i campi vuoti in caso di contratto solo Gas Naturale.</div>

                        {/* POD & Uso */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Codice POD*</label>
                                <div className="flex gap-1 items-center">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">IT</span>
                                    <input type="text" className="inp w-12 text-center" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">E</span>
                                    <input
                                        type="text"
                                        className="inp flex-grow bg-yellow-50 dark:bg-yellow-900/10"
                                        placeholder=""
                                        value={formData.lightPod}
                                        onChange={(e) => setFormData({ ...formData, lightPod: e.target.value })}
                                    />
                                </div>
                                <p className="text-[10px] bg-yellow-100 text-gray-700 px-2 py-1 mt-1 rounded inline-block">
                                    Il codice POD è di 14 cifre complessive. Per i contatori da 15 cifre eliminare l'ultimo numero.
                                </p>
                            </div>
                            <div>
                                <label className="lbl">Uso</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="lightUso"
                                            className="w-4 h-4 text-blue-600"
                                            checked={formData.lightUso === 'Domestico'}
                                            onChange={() => setFormData({ ...formData, lightUso: 'Domestico' })}
                                        />
                                        Domestico
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="lightUso"
                                            className="w-4 h-4 text-blue-600"
                                            checked={formData.lightUso === 'Altri usi'}
                                            onChange={() => setFormData({ ...formData, lightUso: 'Altri usi' })}
                                        />
                                        Altri usi
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Residente */}
                        <div>
                            <label className="lbl">Residente*</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="lightResidence"
                                        className="w-4 h-4 text-blue-600"
                                        checked={formData.lightResidence === 'Si'}
                                        onChange={() => setFormData({ ...formData, lightResidence: 'Si' })}
                                    />
                                    Si
                                </label>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="lightResidence"
                                        className="w-4 h-4 text-blue-600"
                                        checked={formData.lightResidence === 'No'}
                                        onChange={() => setFormData({ ...formData, lightResidence: 'No' })}
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {/* Consumo & Potenza Disponibile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Consumo annuo*</label>
                                <input
                                    type="text"
                                    className="inp"
                                    value={formData.lightAnnualConsumption}
                                    onChange={(e) => setFormData({ ...formData, lightAnnualConsumption: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="lbl">Potenza disponibile*</label>
                                <select
                                    className="inp"
                                    value={formData.lightPower}
                                    onChange={(e) => setFormData({ ...formData, lightPower: e.target.value })}
                                >
                                    <option value=""></option>
                                    <option value="1,7">1,7</option>
                                    <option value="2,2">2,2</option>
                                    <option value="3,3">3,3</option>
                                    <option value="5">5</option>
                                    <option value="6,6">6,6</option>
                                    <option value="8,8">8,8</option>
                                    <option value="11">11</option>
                                    <option value="16,5">16,5</option>
                                    <option value="22">22</option>
                                </select>
                            </div>
                        </div>

                        {/* Potenza Contrattuale & Tensione */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Potenza contrattuale (impegnata) *</label>
                                <input
                                    type="text"
                                    className="inp"
                                    value={formData.lightContractualPower}
                                    onChange={(e) => setFormData({ ...formData, lightContractualPower: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="lbl">Tensione*</label>
                                <select
                                    className="inp"
                                    value={formData.lightVoltage}
                                    onChange={(e) => setFormData({ ...formData, lightVoltage: e.target.value })}
                                >
                                    <option value=""></option>
                                    <option value="Bassa Tensione Monofase 220">Bassa Tensione Monofase 220</option>
                                    <option value="Bassa tensione monofase 230">Bassa tensione monofase 230</option>
                                    <option value="BT Trifase 380">BT Trifase 380</option>
                                    <option value="Bassa tensione Trifase 400">Bassa tensione Trifase 400</option>
                                    <option value="BT Trifase 420">BT Trifase 420</option>
                                    <option value="Media tensione">Media tensione</option>
                                </select>
                            </div>
                        </div>

                        {/* Mercato Provenienza */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Mercato di provenienza*</label>
                                <select
                                    className="inp"
                                    value={formData.marketOrigin}
                                    onChange={(e) => setFormData({ ...formData, marketOrigin: e.target.value })}
                                >
                                    <option value=""></option>
                                    <option value="Salvaguardia">Salvaguardia</option>
                                    <option value="Maggior tutela">Maggior tutela</option>
                                    <option value="Mercato libero">Mercato libero</option>
                                    <option value="Tutela graduale">Tutela graduale</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Dati Gas */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Dati fornitura gas naturale</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="text-[10px] text-blue-600 mb-2">Lasciare i campi vuoti in caso di contratto solo Luce Elettrica.</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">PDR *</label>
                                <input type="text" className="inp" />
                            </div>
                            <div>
                                <label className="lbl">Uso</label>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                    <label className="flex items-center gap-1 text-xs"><input type="radio" name="uso_gas" className="text-blue-600" /> Domestico</label>
                                    <label className="flex items-center gap-1 text-xs"><input type="radio" name="uso_gas" className="text-blue-600" /> Altri Usi</label>
                                    <label className="flex items-center gap-1 text-xs"><input type="radio" name="uso_gas" className="text-blue-600" /> Condominio</label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Distributore</label>
                                <input type="text" className="inp" />
                            </div>
                            <div>
                                <label className="lbl">Consumo annuo smc *</label>
                                <input type="text" className="inp" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Modalità di Pagamento */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Modalità di pagamento</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="lbl">Metodo di pagamento</label>
                            <select className="inp">
                                <option>ADDEBITO DIRETTO SU CONTO (SDD)</option>
                            </select>
                        </div>

                        <div className="text-[10px] mt-4 flex justify-between items-center text-gray-500 font-bold border-b border-gray-200 pb-1 mb-2">
                            <span>Nel caso in cui il titolare del conto sia diverso...</span>
                            <button className="bg-[#FF6600] text-white px-2 py-1 rounded text-[10px] uppercase">Copia da intestatario</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="lbl">Nome titolare conto corrente *</label>
                                <input type="text" className="inp" />
                            </div>
                            <div>
                                <label className="lbl">Cognome titolare conto corrente *</label>
                                <input type="text" className="inp" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="lbl">IBAN *</label>
                                <input type="text" className="inp" />
                            </div>
                        </div>
                        <button className="bg-[#004080] text-white text-xs font-bold py-2 px-4 rounded mt-2 flex items-center gap-2">
                            Carica fotocopia Codice Fiscale <Upload size={14} />
                        </button>
                    </div>
                </div>

                {/* SECTION: Privacy & Ripensamento */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Diritto di ripensamento</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-2">
                        <p className="text-[10px] text-gray-500 leading-relaxed text-justify">
                            Ai sensi del Codice del Consumo... dichiarando di aver ricevuto le informazioni...
                        </p>
                        <label className="flex items-start gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" />
                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                Accetto e richiedo l'attivazione immediata della fornitura, rinunciando al diritto di ripensamento...
                            </span>
                        </label>
                    </div>
                </div>

                {/* SECTION: Documenti */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="bg-[#004080] dark:bg-blue-900 p-3 flex justify-between items-center">
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Documenti</span>
                        <ChevronDown className="text-white" size={16} />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-2">
                            <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Documento di Identità (Fronte/Retro e LEGGIBILE)</span>
                            <button className="bg-[#0055AA] hover:bg-blue-600 text-white text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1">
                                Aggiungi allegato <span className="text-sm">+</span>
                            </button>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-2">
                            <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Codice Fiscale / Tessera Sanitaria</span>
                            <button className="bg-[#0055AA] hover:bg-blue-600 text-white text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1">
                                Aggiungi allegato <span className="text-sm">+</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded flex items-center gap-2 shadow-lg"
                    >
                        <Save size={18} />
                        SALVA
                    </motion.button>
                </div>

                {/* Custom Styling for "inp" and "lbl" classes handled via style tag for scope */}
                <style>{`
                    .lbl {
                        display: block;
                        font-size: 10px;
                        font-weight: 700;
                        color: #3b82f6;
                        margin-bottom: 4px;
                        text-transform: uppercase;
                    }
                    .dark .lbl {
                        color: #60a5fa;
                    }
                    .inp {
                        width: 100%;
                        background-color: transparent;
                        border: 1px solid #e2e8f0;
                        border-radius: 4px;
                        padding: 8px;
                        font-size: 13px;
                        color: #334155;
                        outline: none;
                    }
                    .dark .inp {
                        border-color: #334155;
                        color: #e2e8f0;
                    }
                    .inp:focus {
                        border-color: #3b82f6;
                        background-color: #eff6ff;
                    }
                    .dark .inp:focus {
                        background-color: #1e293b;
                    }
                `}</style>
            </div >
        </div >
    );
};

export default ContractSimulator;
