-- ==========================================
-- SCHEMA COMPLETO PER MY SHARING SIMULATOR
-- Esegui questo script nell'SQL Editor di Supabase
-- ==========================================

-- 1. TABELLA PROFILI
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  commission_status text DEFAULT 'PRIVILEGIATO',
  current_qualification text,
  target_qualification text,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. TABELLA LOG ATTIVITÀ (DAILY CHECK)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date text NOT NULL,
  counts jsonb DEFAULT '{}',
  contract_details jsonb DEFAULT '{}',
  leads jsonb DEFAULT '[]',
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

-- 3. TABELLA IMPOSTAZIONI UTENTE
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  theme text DEFAULT 'light',
  goals jsonb DEFAULT '{}',
  commercial_month_start_day integer DEFAULT 16,
  custom_labels jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{}',
  vision_board jsonb DEFAULT '{}',
  career_path_dates jsonb DEFAULT '{}',
  next_appointment jsonb DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. TABELLA OBIETTIVI (ACHIEVEMENTS)
CREATE TABLE IF NOT EXISTS public.achievements (
  user_id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  unlocked_achievements jsonb DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. TABELLA TEAM
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  join_code text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  daily_goal integer,
  weekly_goal integer,
  monthly_goal integer
);

-- 6. TABELLA MEMBRI TEAM
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid REFERENCES public.teams NOT NULL,
  player_id uuid REFERENCES auth.users NOT NULL,
  name text,
  stats jsonb DEFAULT '{}',
  total_score integer DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now(),
  avatar_emoji text,
  avatar_color text,
  UNIQUE(team_id, player_id)
);

-- 7. TABELLA NOTIFICHE TEAM
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid REFERENCES public.teams NOT NULL,
  from_player_id uuid REFERENCES auth.users NOT NULL,
  from_player_name text,
  to_player_id uuid REFERENCES auth.users,
  message text NOT NULL,
  type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- 8. TABELLA LICENZE (Se non presente nel progetto dedicato)
CREATE TABLE IF NOT EXISTS public.licenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text,
  expiry_date timestamp with time zone,
  uses integer DEFAULT 0,
  max_uses integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. TABELLA STATI GENERICI (Legacy/Compatibility)
CREATE TABLE IF NOT EXISTS public.user_states (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  state_key text NOT NULL,
  state_data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, state_key)
);

-- ==========================================
-- CONFIGURAZIONE RLS (POLICIES)
-- ==========================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ACTIVITY LOGS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own logs" ON activity_logs FOR ALL USING (auth.uid() = user_id);

-- USER SETTINGS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- ACHIEVEMENTS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);

-- USER STATES
ALTER TABLE public.user_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own states" ON user_states FOR ALL USING (auth.uid() = user_id);

-- TEAM SYSTEM (Lettura permessa ai membri del team)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Only authorized can create teams" ON teams FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by all" ON team_members FOR SELECT USING (true);
CREATE POLICY "Users can manage own membership" ON team_members FOR ALL USING (auth.uid() = player_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications viewable by team" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can send notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = from_player_id);

-- LICENSES (Sola lettura pubblica, aggiornamento conteggio usi)
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Licenses are viewable by everyone" ON licenses FOR SELECT USING (true);
CREATE POLICY "Licenses are updatable by everyone" ON licenses FOR UPDATE USING (true);
