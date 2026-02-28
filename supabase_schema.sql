-- Esegui questo script nell'SQL Editor di Supabase per creare la tabella di sincronizzazione

CREATE TABLE IF NOT EXISTS public.user_states (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  state_key text NOT NULL,
  state_data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, state_key)
);

-- Configura Row Level Security (RLS) per permettere agli utenti di leggere/scrivere solo i propri dati
ALTER TABLE public.user_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own states" 
ON public.user_states FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own states" 
ON public.user_states FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own states" 
ON public.user_states FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own states" 
ON public.user_states FOR DELETE 
USING (auth.uid() = user_id);
