// ============================================================================
// FILE: services/storageService.ts (Versione Ibrida Cloud/Locale)
// ============================================================================

import { ActivityLog, AppSettings, UnlockedAchievements, UserProfile, CommissionStatus, Qualification, Client, Lead } from '../types';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

// Chiavi LocalStorage
const ACTIVITY_KEY = 'daily-check-app-logs';
const SETTINGS_KEY = 'daily-check-app-settings';
const ACHIEVEMENTS_KEY = 'daily-check-app-achievements';
const CAREER_DATES_KEY = 'dailyCheck_careerPathDates';
const CLIENTS_KEY = 'daily-check-app-clients';

// --- HELPERS ---
const isValidUUID = (str: string | undefined | null): boolean => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
const getLocalLogs = (): ActivityLog[] => {
  try {
    const localData = localStorage.getItem(ACTIVITY_KEY);
    return localData ? JSON.parse(localData) : [];
  } catch (e) { console.error("Local Load Error", e); return []; }
};

const getLocalSettings = (): AppSettings | null => {
  try {
    const localData = localStorage.getItem(SETTINGS_KEY);
    return localData ? JSON.parse(localData) : null;
  } catch (e) { console.error("Local Settings Error", e); return null; }
};

const getLocalAchievements = (): UnlockedAchievements => {
  try {
    const localData = localStorage.getItem(ACHIEVEMENTS_KEY);
    return localData ? JSON.parse(localData) : {};
  } catch (e) { return {}; }
};

// ---------------------------------------------------------------------------
// GESTIONE LOG ATTIVITÀ
// ---------------------------------------------------------------------------
export const loadLogs = async (userId: string | null): Promise<ActivityLog[]> => {
  const localLogs = getLocalLogs();

  if (userId) {
    // CLOUD MODE
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading logs from Supabase:', error);
      return localLogs; // Fallback al locale in caso di errore
    }

    // Map snake_case DB columns to camelCase App properties
    const cloudLogs: ActivityLog[] = data.map((item: any) => ({
      date: item.date,
      counts: item.counts || {},
      contractDetails: item.contract_details || {},
      leads: item.leads || []
    }));

    // MERGE LOGIC: Combine local and cloud logs
    const mergedLogs = [...localLogs];
    cloudLogs.forEach(cLog => {
      const existingIndex = mergedLogs.findIndex(l => l.date === cLog.date);
      if (existingIndex >= 0) {
        // Simple merge: Cloud wins for same-day
        mergedLogs[existingIndex] = { ...mergedLogs[existingIndex], ...cLog };
      } else {
        mergedLogs.push(cLog);
      }
    });

    // Save merged result back to localStorage for offline consistency
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(mergedLogs));
    return mergedLogs;
  } else {
    // LOCAL MODE
    return localLogs;
  }
};

export const saveLogs = async (userId: string | null, logs: ActivityLog[]) => {
  // SALVATAGGIO LOCALE (Sempre come backup)
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));

  if (userId) {
    const payload = logs.map(log => ({
      user_id: userId,
      date: log.date,
      counts: log.counts,
      contract_details: log.contractDetails || {},
      leads: log.leads || [],
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('activity_logs')
      .upsert(payload, { onConflict: 'user_id, date' });

    if (error) {
      console.error('Error saving logs to Supabase:', error);
      // Notifichiamo l'errore se possibile (gestito poi nel componente)
      throw error;
    }
  }
};

/**
 * OTTIMIZZATO: salva solo il log di UNA specifica data.
 */
export const saveLogForDate = async (userId: string | null, log: ActivityLog, allLogs?: ActivityLog[]) => {
  // SALVATAGGIO LOCALE (Sempre come backup se allLogs è fornito)
  if (allLogs) {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(allLogs));
  }

  if (userId) {
    // Cloud: upsert solo la riga modificata
    const { error } = await supabase.from('activity_logs').upsert({
      user_id: userId,
      date: log.date,
      counts: log.counts,
      contract_details: log.contractDetails || {},
      leads: log.leads || [],
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, date' });

    if (error) {
      console.error('Error saving log for date to Supabase:', error);
      throw error;
    }
  }
};


export const clearLogs = async (userId: string | null) => {
  // Clear local storage regardless of login state
  localStorage.removeItem(ACTIVITY_KEY);

  if (userId) {
    const { error } = await supabase.from('activity_logs').delete().eq('user_id', userId);
    if (error) console.error("Error clearing logs in Supabase:", error);
  }
};

export const deleteLogsInRange = async (userId: string | null, startDate: string, endDate: string) => {
  // 1. Clear Local Storage
  const localLogs = getLocalLogs();
  const filteredLogs = localLogs.filter(log => log.date < startDate || log.date > endDate);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(filteredLogs));

  // 2. Clear Cloud Storage
  if (userId) {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error("Error deleting logs in range from Supabase:", error);
      throw error;
    }
  }
};

// ---------------------------------------------------------------------------
// GESTIONE IMPOSTAZIONI & PROFILO
// ---------------------------------------------------------------------------

export const loadSettings = async (userId: string | null): Promise<AppSettings | null> => {
  const localSettings = getLocalSettings();
  if (userId) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error("Error loading settings:", error);
      return localSettings;
    }

    if (data) {
      // Reconstruct AppSettings object conforming to interface
      // LOGIC V1.3.13: Robust Merge. Cloud wins for defined fields, but local is the anchor for persistence.
      const cloudSettings: AppSettings = {
        theme: data.theme || localSettings?.theme || 'light',
        goals: (data.goals && Object.keys(data.goals).length > 0) ? data.goals : (localSettings?.goals || { daily: {}, weekly: {}, monthly: {} }),
        commercialMonthStartDay: data.commercial_month_start_day || localSettings?.commercialMonthStartDay || 1,
        customLabels: (data.custom_labels && Object.keys(data.custom_labels).length > 0) ? data.custom_labels : (localSettings?.customLabels || {}),
        notificationSettings: (data.notification_settings && Object.keys(data.notification_settings).length > 0) ? data.notification_settings : (localSettings?.notificationSettings || {}),
        visionBoard: (data.vision_board && (Array.isArray(data.vision_board) ? data.vision_board.length > 0 : Object.keys(data.vision_board).length > 0)) ? data.vision_board : (localSettings?.visionBoard || []),
        acknowledgedDeadlines: (data.acknowledged_deadlines && Object.keys(data.acknowledged_deadlines).length > 0) ? data.acknowledged_deadlines : (localSettings?.acknowledgedDeadlines || {}),
        userProfile: localSettings?.userProfile || { firstName: '', lastName: '' }, 
        enableGoals: data.enable_goals !== undefined ? data.enable_goals : (localSettings?.enableGoals !== undefined ? localSettings.enableGoals : true),
        enableCustomLabels: data.enable_custom_labels !== undefined ? data.enable_custom_labels : (localSettings?.enableCustomLabels !== undefined ? localSettings.enableCustomLabels : true),
        nextAppointment: data.next_appointment, // Cloud is source of truth for sync
        careerPathDates: (data.career_path_dates && Object.keys(data.career_path_dates).length > 0) ? data.career_path_dates : (localSettings?.careerPathDates || {}),
        habitStacks: data.habit_stacks || localSettings?.habitStacks || [],
        enableHabitStacking: data.enable_habit_stacking !== undefined ? data.enable_habit_stacking : (localSettings?.enableHabitStacking !== undefined ? localSettings.enableHabitStacking : true),
      };
      
      // Update local storage to stay in sync with best-known state
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cloudSettings));
      return cloudSettings;
    }

    // FALLBACK: Se non trovato nel cloud, usa il locale (fondamentale per primo login o glitch)
    return localSettings;
  } else {
    return localSettings;
  }
};

export const loadUserProfile = async (userId: string | null): Promise<UserProfile> => {
  if (userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      const profile = {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        commissionStatus: (data.commission_status as CommissionStatus) || CommissionStatus.PRIVILEGIATO,
        currentQualification: data.current_qualification as Qualification,
        targetQualification: data.target_qualification as Qualification
      };
      
      // LOGIC V1.3.9: Se il cloud ha dati vuoti ma il locale ha dati reali, preserviamo i locali
      const localS = getLocalSettings();
      const localP = localS?.userProfile;
      if (localP) {
        if (!profile.currentQualification && localP.currentQualification) profile.currentQualification = localP.currentQualification;
        if (!profile.targetQualification && localP.targetQualification) profile.targetQualification = localP.targetQualification;
        if (!profile.firstName && localP.firstName) profile.firstName = localP.firstName;
        if (!profile.lastName && localP.lastName) profile.lastName = localP.lastName;
      }

      // Force clean "Utente" if found in cloud
      if (profile.firstName === 'Utente') profile.firstName = '';
      return profile;
    }
    // FALLBACK: Se non trovato nel cloud, usa il locale
    const localS = getLocalSettings();
    return localS?.userProfile || { firstName: '', lastName: '', commissionStatus: CommissionStatus.PRIVILEGIATO };
  } else {
    // In local mode, profile is part of settings, so we extract it or return default
    const settings = getLocalSettings();
    const profile = settings?.userProfile || { firstName: '', lastName: '', commissionStatus: CommissionStatus.PRIVILEGIATO };
    // Force clean "Utente" if found
    if (profile.firstName === 'Utente') profile.firstName = '';
    return profile;
  }
}


export const saveSettings = async (userId: string | null, settings: AppSettings) => {
  // SALVATAGGIO LOCALE (Backup)
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  if (userId) {
    // Save Settings
    const { error: settingsError } = await supabase.from('user_settings').upsert({
      user_id: userId,
      theme: settings.theme,
      goals: settings.goals,
      commercial_month_start_day: settings.commercialMonthStartDay,
      custom_labels: settings.customLabels,
      notification_settings: settings.notificationSettings,
      next_appointment: settings.nextAppointment,
      vision_board: settings.visionBoard,
      career_path_dates: settings.careerPathDates || {},
      habit_stacks: settings.habitStacks || [],
      enable_habit_stacking: settings.enableHabitStacking ?? true,
      updated_at: new Date().toISOString()
    });

    if (settingsError) {
      console.error("Error saving settings to Supabase:", settingsError);
      // We don't alert here to avoid spamming the user, but it's the reason why sync might fail
    }

    // Save Profile - ALWAYS SAVE if it exists, to preserve commissionStatus and qualifications even if name is blank
    if (settings.userProfile) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: settings.userProfile.firstName || '',
        last_name: settings.userProfile.lastName || '',
        commission_status: settings.userProfile.commissionStatus,
        current_qualification: settings.userProfile.currentQualification,
        target_qualification: settings.userProfile.targetQualification,
        updated_at: new Date().toISOString()
      });

      if (profileError) console.error("Error saving profile:", profileError);
    }
  }
};

// ---------------------------------------------------------------------------
// GESTIONE OBIETTIVI (ACHIEVEMENTS)
// ---------------------------------------------------------------------------

export const loadUnlockedAchievements = async (userId: string | null): Promise<UnlockedAchievements> => {
  const localData = localStorage.getItem(ACHIEVEMENTS_KEY);
  const localAchievements = localData ? JSON.parse(localData) : {};

  if (userId) {
    const { data, error } = await supabase
      .from('achievements')
      .select('unlocked_achievements')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error loading achievements from Supabase:", error);
      return localAchievements;
    }

    return data?.unlocked_achievements || localAchievements;
  } else {
    return localAchievements;
  }
};

export const saveUnlockedAchievements = async (userId: string | null, achievements: UnlockedAchievements) => {
  if (userId) {
    const { error } = await supabase.from('achievements').upsert({
      user_id: userId,
      unlocked_achievements: achievements,
      updated_at: new Date().toISOString()
    });
    if (error) console.error("Error saving achievements", error);
  } else {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

// ---------------------------------------------------------------------------
// GESTIONE DATE PERCORSO CARRIERA
// ---------------------------------------------------------------------------

export const loadCareerDates = async (userId: string | null): Promise<Record<string, string>> => {
  if (userId) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('career_path_dates')
      .eq('user_id', userId)
      .single();

    if (data && data.career_path_dates !== undefined && data.career_path_dates !== null) {
      return data.career_path_dates;
    }
    const localData = localStorage.getItem(CAREER_DATES_KEY);
    return localData ? JSON.parse(localData) : {};
  } else {
    const localData = localStorage.getItem(CAREER_DATES_KEY);
    return localData ? JSON.parse(localData) : {};
  }
};

export const saveCareerDates = async (userId: string | null, dates: Record<string, string>) => {
  // --- v1.3.5: DISABILITATO SUPABASE UPSERT QUI ---
  // Per evitare race conditions e overwrite parziali, il salvataggio cloud
  // su Supabase (tabella 'user_settings') deve passare SOLO da saveSettings.
  
  if (!userId) {
    localStorage.setItem(CAREER_DATES_KEY, JSON.stringify(dates));
  } else {
    // Salvataggio locale comunque utile come backup rapido
    localStorage.setItem(CAREER_DATES_KEY, JSON.stringify(dates));
    console.log("[v1.3.5] saveCareerDates (Cloud): Skipped. Use saveSettings for atomic sync.");
  }
};

// ---------------------------------------------------------------------------
// GESTIONE CLIENTI (NEW PERSISTENT STORAGE)
// ---------------------------------------------------------------------------

export const loadClients = async (userId: string | null): Promise<Client[]> => {
  const localData = localStorage.getItem(CLIENTS_KEY);
  const localClients: Client[] = localData ? JSON.parse(localData) : [];

  if (userId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading clients from Supabase:', error);
      return localClients;
    }

    // Se Supabase non restituisce nulla, ma in locale abbiamo dei dati,
    // potrebbe essere che il sync iniziale non sia ancora avvenuto.
    // Restituiamo i locali per non mostrare il tab vuoto.
    if (!data || data.length === 0) {
      return localClients;
    }

    const mapped = data.map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
      type: c.type,
      sourceLeadId: c.source_lead_id,
      createdAt: c.created_at
    }));

    // Update local cache: Se abbiamo dati dal cloud, essi diventano la verità, 
    // ma per sicurezza uniamo se la lista locale ha client ID che non esistono nel cloud (ancora da sincronizzare)
    const cloudIds = new Set(mapped.map(c => c.id));
    const cloudLeadIds = new Set(mapped.filter(c => c.sourceLeadId).map(c => c.sourceLeadId));
    
    const localOnly = localClients.filter(lc => {
      // Escludi se l'ID è già nel cloud
      if (cloudIds.has(lc.id)) return false;
      // Escludi se il sourceLeadId è già nel cloud (evita duplicati creati con diversi UUID locali)
      if (lc.sourceLeadId && cloudLeadIds.has(lc.sourceLeadId)) return false;
      return true;
    });
    
    const merged = [...mapped, ...localOnly];

    // Ulteriore Garanzia: Rimuovi duplicati logici (stesso sourceLeadId) anche nel merged
    const finalClients: Client[] = [];
    const seenLeadIds = new Set<string>();
    
    for (const client of merged) {
      if (client.sourceLeadId) {
        if (!seenLeadIds.has(client.sourceLeadId)) {
          finalClients.push(client);
          seenLeadIds.add(client.sourceLeadId);
        }
      } else {
        finalClients.push(client);
      }
    }

    localStorage.setItem(CLIENTS_KEY, JSON.stringify(finalClients));
    return finalClients;
  }
  return localClients;
};

export const saveClient = async (userId: string | null, client: Partial<Client>) => {
  // 1. Aggiornamento Locale (Cache immediata per UI reattiva)
  const localData = localStorage.getItem(CLIENTS_KEY);
  let allClients: Client[] = localData ? JSON.parse(localData) : [];
  
  const existingIndex = allClients.findIndex(c => c.id === client.id);
  
  const updatedClient = {
    ...client,
    userId: userId || 'local',
    createdAt: client.createdAt || new Date().toISOString()
  } as Client;

  if (existingIndex >= 0) {
    allClients[existingIndex] = updatedClient;
  } else {
    allClients.unshift(updatedClient);
  }

  localStorage.setItem(CLIENTS_KEY, JSON.stringify(allClients));

  // 2. Persistenza Cloud (se connesso)
  if (userId) {
    const { error } = await supabase.from('clients').upsert({
      id: updatedClient.id,
      user_id: userId,
      name: updatedClient.name,
      phone: updatedClient.phone,
      email: updatedClient.email,
      notes: updatedClient.notes,
      type: updatedClient.type,
      source_lead_id: updatedClient.sourceLeadId,
      created_at: updatedClient.createdAt,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving client to Supabase:', error);
      // Non blocchiamo l'esecuzione perché il dato è già in local storage (persistenza ibrida)
    }
  }
};

export const deleteClient = async (userId: string | null, clientId: string) => {
  const allClients = await loadClients(userId);
  const filtered = allClients.filter(c => c.id !== clientId);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));

  if (userId) {
    const { error } = await supabase.from('clients').delete().eq('id', clientId).eq('user_id', userId);
    if (error) {
      console.error('Error deleting client from Supabase:', error);
      throw error;
    }
  }
};

export const clearAllClients = async (userId: string | null) => {
  localStorage.removeItem(CLIENTS_KEY);
  if (userId) {
    const { error } = await supabase.from('clients').delete().eq('user_id', userId);
    if (error) {
      console.error('Error clearing all clients from Supabase:', error);
      throw error;
    }
  }
};

export const createClientFromLead = async (userId: string | null, lead: Lead, type: 'cliente' | 'partner') => {
  // 1. Verifica se esiste già un client per questo lead (DEDUPLICAZIONE v1.3.1)
  const allClients = await loadClients(userId);
  const existingClient = allClients.find(c => c.sourceLeadId === lead.id);
  
  if (existingClient) {
    console.log(`[createClientFromLead] Client already exists for lead ${lead.id}. Updating instead of creating.`);
    const updatedClient = {
      ...existingClient,
      name: lead.name,
      phone: lead.phone,
      notes: lead.note,
      type // Potrebbe essere cambiato da cliente a partner
    };
    await saveClient(userId, updatedClient);
    return updatedClient;
  }

  const newClient: Client = {
    id: crypto.randomUUID(),
    userId: userId || 'local',
    name: lead.name,
    phone: lead.phone,
    notes: lead.note,
    type,
    sourceLeadId: lead.id,
    createdAt: new Date().toISOString()
  };
  
  await saveClient(userId, newClient);
  return newClient;
};

// ---------------------------------------------------------------------------
// MIGRATION & SYNC (THE MAGIC BUTTON)
// ---------------------------------------------------------------------------

export const syncLocalDataToCloud = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  if (!userId) return { success: false, message: "User ID missing" };

  console.log("[Sync] Starting Cloud Sync for user:", userId);
  let lastError: any = null;

  try {
    const localLogs = getLocalLogs();
    const localSettings = getLocalSettings();
    const localAchievements = getLocalAchievements();

    // 1. SYNC LOGS (Chunked)
    if (localLogs.length > 0) {
      console.log(`[Sync] Syncing ${localLogs.length} activity logs...`);
      const CHUNK_SIZE = 50;
      for (let i = 0; i < localLogs.length; i += CHUNK_SIZE) {
        const chunk = localLogs.slice(i, i + CHUNK_SIZE).map(log => ({
          user_id: userId,
          date: log.date,
          counts: log.counts,
          contract_details: log.contractDetails || {},
          leads: (log.leads || []).map(lead => ({
            ...lead,
            id: isValidUUID(lead.id) ? lead.id : crypto.randomUUID() // Sanitize lead ID
          })),
          updated_at: new Date().toISOString()
        }));
        
        const { error } = await supabase.from('activity_logs').upsert(chunk, { onConflict: 'user_id, date' });
        if (error) {
          console.error("[Sync] Error syncing logs chunk:", error);
          lastError = error;
        }
      }
    }

    // 2. SYNC SETTINGS
    if (localSettings) {
      console.log("[Sync] Syncing user settings and profile...");
      try {
        await saveSettings(userId, localSettings);
      } catch (e) {
        lastError = e;
      }
    }

    // 3. SYNC ACHIEVEMENTS
    if (Object.keys(localAchievements).length > 0) {
      console.log("[Sync] Syncing achievements...");
      try {
        await saveUnlockedAchievements(userId, localAchievements);
      } catch (e) {
        lastError = e;
      }
    }

    // 4. SYNC CLIENTI (Chunked)
    const localClientsData = localStorage.getItem(CLIENTS_KEY);
    if (localClientsData) {
      const localClients: Client[] = JSON.parse(localClientsData);
      if (localClients.length > 0) {
        console.log(`[Sync] Syncing ${localClients.length} clients...`);
        const CHUNK_SIZE = 50;
        for (let i = 0; i < localClients.length; i += CHUNK_SIZE) {
          const chunk = localClients.slice(i, i + CHUNK_SIZE).map(c => ({
            id: isValidUUID(c.id) ? c.id : crypto.randomUUID(), // Sanitize ID
            user_id: userId,
            name: c.name,
            phone: c.phone || '',
            email: c.email || '',
            notes: c.notes || '',
            type: c.type || 'cliente',
            source_lead_id: isValidUUID(c.sourceLeadId) ? c.sourceLeadId : null, // Sanitize source_lead_id
            created_at: c.createdAt || new Date().toISOString()
          }));

          const { error } = await supabase.from('clients').upsert(chunk);
          if (error) {
            console.error("[Sync] Error syncing clients chunk:", error);
            lastError = error;
          }
        }
      }
    }

    const localCareerDates = localStorage.getItem(CAREER_DATES_KEY);
    if (localCareerDates) {
      console.log("[Sync] Syncing career dates...");
      try {
        await saveCareerDates(userId, JSON.parse(localCareerDates));
      } catch (e) { lastError = e; }
    }

    console.log("[Sync] Cloud Sync Completed!");
  } catch (err) {
    console.error("[Sync] Fatal error during sync:", err);
    lastError = err;
  }
  
  if (lastError) {
    return { 
      success: false, 
      message: lastError.message || lastError.details || JSON.stringify(lastError) 
    };
  }
  
  return { success: true };
};

// ---------------------------------------------------------------------------
// BACKUP & RESTORE (Legacy / Export purpose)
// ---------------------------------------------------------------------------

export const getBackupData = async (userId: string | null) => {
  try {
    const logs = await loadLogs(userId);
    const settings = await loadSettings(userId);
    const unlockedAchievements = await loadUnlockedAchievements(userId);
    // If cloud, we need to fetch profile manually and merge into settings for the export format expected
    let fullSettings = settings;
    if (userId && settings) {
      const profile = await loadUserProfile(userId);
      fullSettings = { ...settings, userProfile: profile };
    }


    return {
      activityLogs: logs,
      settings: fullSettings,
      unlockedAchievements: unlockedAchievements,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Errore creazione backup:", error);
    return null;
  }
};

export const restoreBackupData = async (userId: string | null, data: any) => {
  if (!data) return;

  try {
    if (data.activityLogs && Array.isArray(data.activityLogs)) await saveLogs(userId, data.activityLogs);
    if (data.settings) await saveSettings(userId, data.settings);
    if (data.unlockedAchievements) await saveUnlockedAchievements(userId, data.unlockedAchievements);

    return true;
  } catch (error) {
    console.error("Errore ripristino:", error);
    throw error;
  }
};
