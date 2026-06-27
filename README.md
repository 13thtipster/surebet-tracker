# 13th Tracker — Surebet & Valuebet

Tracker per la gestione di surebet e valuebet con schema **non-split** (back su bookmaker, lay su exchange senza equalizzazione del profitto), cassa di partenza progressiva e commissione exchange configurabile (default 3%).

## Caratteristiche

- **Cassa progressiva**: si aggiorna automaticamente dopo ogni giocata chiusa
- **Schema non-split**: il calcolo segue la logica binaria — se vince il back ottieni il profitto pieno meno la liability del lay; se vince il lay ottieni lo stake lay (meno commissione) meno lo stake back perso
- **% guadagno calcolata solo sullo stake back** (non sull'esposizione totale)
- **Stake lay manuale** (non calcolato automaticamente — lo inserisci tu)
- **Commissione exchange** modificabile per ogni giocata (default impostabile in Impostazioni)
- **Storico completo** con cassa progressiva, modifica/eliminazione, esiti (Vince Back / Vince Lay / Void)
- **Dashboard**: ROI%, profitto totale, win rate, riepilogo giocate
- **PWA installabile**: funziona offline e si installa come app su telefono/desktop
- Stile MotoGP coerente con 13th Tipster (Barlow Condensed, giallo #FFD600 su nero)

## Logica di calcolo (non-split)

Per ogni giocata:
- `liability = stakeLay × (quotaLay - 1)`
- **Se vince il BACK**: `profitto = stakeBack × (quotaBack - 1) − liability`
- **Se vince il LAY**: `profitto = stakeLay × (1 − commissione%) − stakeBack`

La % di guadagno mostrata è sempre calcolata sullo `stakeBack`, non sull'esposizione totale (stake back + liability).

## Deploy su Vercel

### Opzione 1 — Vercel CLI (più rapida)
```bash
npm i -g vercel
cd surebet-tracker
vercel
```
Segui le istruzioni a schermo (login, nome progetto, ecc.). Al termine otterrai un URL pubblico tipo `https://13th-tracker.vercel.app`.

Per il deploy in produzione (URL finale):
```bash
vercel --prod
```

### Opzione 2 — GitHub + Vercel Dashboard
1. Crea un repo GitHub con questi file
2. Vai su [vercel.com/new](https://vercel.com/new)
3. Importa il repo — Vercel rileva automaticamente la cartella `public` come root dei file statici
4. Deploy

## Installare come app (PWA)

Una volta online sull'URL Vercel:
- **Android (Chrome)**: menu ⋮ → "Aggiungi a schermata Home" / "Installa app"
- **iPhone (Safari)**: tasto Condividi → "Aggiungi alla schermata Home"
- **Desktop (Chrome/Edge)**: icona di installazione nella barra degli indirizzi

L'app funzionerà offline e si comporterà come un'app nativa (senza barra del browser).

## Struttura file

```
surebet-tracker/
├── public/
│   ├── index.html       ← app completa (HTML+CSS+JS)
│   ├── manifest.json     ← manifest PWA
│   ├── sw.js             ← service worker (offline)
│   ├── icon-192.png
│   └── icon-512.png
├── vercel.json           ← config deploy
└── README.md
```

## Note tecniche

- I dati (cassa, storico giocate, impostazioni) sono salvati in `localStorage` del browser — sono quindi **locali al dispositivo/browser** usato. Non c'è backend/database condiviso.
- Se vuoi sincronizzare i dati tra più dispositivi in futuro, serve aggiungere un backend (es. Vercel KV, Supabase, o un piccolo endpoint API) — fammi sapere se vuoi che lo implementi.
