# Music Downloader - Instrucțiuni de Folosire

## 📋 Descriere
Music Downloader este o aplicație web modernă pentru descărcarea melodiilor și playlisturilor de pe YouTube direct pe dispozitivul tău.

## 🚀 Instalare Locală

### Prerequisite
- Node.js (versiunea 16 sau mai nouă)
- npm sau bun

### Pași de Instalare

1. **Clonează proiectul**
```bash
git clone <URL_REPOSITORY>
cd <NUME_PROIECT>
```

2. **Instalează dependențele**
```bash
npm install
# sau
bun install
```

3. **Pornește aplicația în modul dezvoltare**
```bash
npm run dev
# sau
bun run dev
```

4. **Deschide în browser**
Aplicația va fi disponibilă la: `http://localhost:5173`

## 🌐 Instalare Online (Deployment)

### Folosind Lovable (Recomandat)
1. Deschide proiectul în [Lovable](https://lovable.dev)
2. Apasă butonul **"Publish"** din colțul dreapta-sus
3. Aplicația ta va fi publicată automat și vei primi un link

### Folosind Netlify/Vercel
1. Conectează repository-ul GitHub
2. Setează comenzile de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy automat la fiecare push

## 📖 Cum să Folosești

### 1. Descărcare Melodie Singulară

1. Copiază link-ul unei melodii de pe YouTube
   - Exemplu: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

2. Lipește link-ul în câmpul de introducere

3. Apasă butonul **"Descarcă Melodie"**

4. Așteaptă finalizarea descărcării

5. Melodia va apărea în secțiunea **"Istoric Descărcări"**

### 2. Descărcare Playlist

1. Copiază link-ul unui playlist de pe YouTube
   - Exemplu: `https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG`

2. Lipește link-ul în câmpul de introducere

3. Apasă butonul **"Descarcă Playlist"**

4. Fiecare melodie din playlist va fi descărcată separat

### 3. Vizualizare Progres

- În timp real vei vedea progresul fiecărei descărcări
- Bara de progres se actualizează automat
- Vei primi notificări când descărcarea este completă

### 4. Istoric Descărcări

- Toate descărcările finalizate apar în istoric
- Poți vedea:
  - Titlul melodiei
  - Data și ora descărcării
  - Dimensiunea fișierului
- Șterge istoricul cu butonul **"Șterge Istoric"**

## ⚙️ Funcționalități

✅ Descărcare melodii individuale de pe YouTube
✅ Descărcare playlist-uri complete
✅ Monitorizare progres în timp real
✅ Istoric complet al descărcărilor
✅ Interface modernă și responsive
✅ Notificări pentru evenimente importante
✅ Validare automată URL-uri
✅ Design adaptat pentru mobil și desktop

## 🔧 Tehnologii Folosite

- **React** - Framework UI
- **TypeScript** - Siguranță tip
- **Tailwind CSS** - Styling modern
- **Lovable Cloud** - Backend serverless
- **Supabase Edge Functions** - Procesare descărcări
- **Vite** - Build tool rapid

## ⚠️ Limitări Actuale

- **Suport doar YouTube**: Momentan aplicația funcționează doar cu link-uri YouTube
- **Demo Mode**: Versiunea actuală demonstrează funcționalitatea; pentru descărcări reale complete necesită integrare cu servicii de procesare video
- **Format**: Descărcările sunt în format MP3 (audio)

## 🔐 Respectarea Copyright-ului

⚠️ **IMPORTANT**: Această aplicație este destinată doar pentru uz personal și educațional.

- Descarcă doar conținut pentru care ai drepturi
- Respectă drepturile de autor și licențele
- Nu distribui conținut protejat de copyright
- Folosește responsabil

## 💡 Tips & Tricks

1. **Link-uri Valide**: Asigură-te că link-ul YouTube este complet și corect
2. **Conexiune Stabilă**: O conexiune internet stabilă asigură descărcări rapide
3. **Spațiu Disponibil**: Verifică că ai suficient spațiu pe dispozitiv
4. **Browser Modern**: Folosește un browser modern (Chrome, Firefox, Safari, Edge)

## 🐛 Probleme Cunoscute & Soluții

### Eroare: "URL invalid"
- **Cauză**: Link-ul introdus nu este un link YouTube valid
- **Soluție**: Verifică că link-ul începe cu `youtube.com` sau `youtu.be`

### Descărcarea nu pornește
- **Cauză**: Probleme de conectivitate sau video restricționat
- **Soluție**: Verifică conexiunea internet și încearcă alt video

### Video-ul nu poate fi descărcat
- **Cauză**: Video-ul poate fi privat, restricționat geografic sau șters
- **Soluție**: Încearcă cu un alt video public

## 📞 Suport

Pentru probleme sau întrebări:
1. Verifică această documentație
2. Caută în secțiunea Issues pe GitHub
3. Creează un Issue nou cu detalii despre problemă

## 🎨 Personalizare

Poți personaliza aplicația modificând:
- **Culori**: `src/index.css` - definește temele color
- **Componente**: `src/components/` - modifică componentele UI
- **Design**: `tailwind.config.ts` - configurare Tailwind

## 📄 Licență

Acest proiect este creat pentru uz educațional și personal.

---

**Enjoy your music! 🎵**
