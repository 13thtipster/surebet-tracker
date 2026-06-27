-- ============================================================
-- 13th Tracker — Aggiornamento schema per cassa divisa
-- (Generale -> Surebet[Book+Exchange] + Value)
-- Esegui nel SQL Editor di Supabase DOPO lo schema iniziale
-- ============================================================

-- Aggiungiamo alla tabella impostazioni le percentuali di split
alter table public.impostazioni
  add column if not exists perc_surebet numeric not null default 50,
  add column if not exists perc_book numeric not null default 50;

-- perc_surebet = quota % della Cassa Generale destinata a Surebet (il resto va a Value)
-- perc_book = quota % della Cassa Surebet destinata a Book (il resto va a Exchange)

-- Aggiungiamo alla tabella giocate le colonne per i saldi Book/Exchange dopo ogni giocata,
-- e per il saldo Value dopo ogni giocata. cassa_dopo resta il TOTALE generale.
alter table public.giocate
  add column if not exists cassa_book_dopo numeric,
  add column if not exists cassa_exchange_dopo numeric,
  add column if not exists cassa_value_dopo numeric,
  add column if not exists quota_stimata numeric;

-- quota_stimata: la quota "tua", da cui deriviamo la probabilità stimata (1/quota_stimata)
-- per le valuebet. Il vecchio campo "prob" resta per compatibilità con dati storici,
-- ma per le nuove giocate calcoliamo prob direttamente da quota_stimata.
