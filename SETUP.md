# Setup & lancement (Michelin Guide)

Derniere mise a jour : 2026-04-22

Ce projet contient :

- **backend** : API Express (Node.js) + MongoDB (optionnel mais recommande)
- **frontend** : React (CRACO)

L'objectif de ce guide : installer les dependances, demarrer MongoDB, **seed** la base, puis lancer backend + frontend.

---

## Prerequis

- Node.js **>= 18** (recommande)
- npm (fourni avec Node)
- (Recommande) **Docker Desktop** pour lancer MongoDB facilement

> Sans MongoDB :
> - le backend démarre quand même,
> - `/api/parcours` fonctionne grâce au **fallback mock**,
> - la page Restaurants côté frontend fonctionne (fallback sur les mocks UI),
> - mais tu ne pourras pas **seed** ni tester la persistance.

---

## 1) Demarrer MongoDB

### Option A - Docker Desktop (recommandee sur Windows)

1) Ouvre **Docker Desktop** et attends qu’il soit “Running”.
2) Dans PowerShell, vérifie que Docker répond :

```powershell
docker ps
```

3) Lance MongoDB :

```powershell
docker run -d --name michelin-mongo -p 27017:27017 -v michelin_mongo_data:/data/db mongo:7
```

4) Vérifie que le conteneur tourne :

```powershell
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
```

Pour stopper MongoDB :

```powershell
docker stop michelin-mongo
```

Pour le relancer :

```powershell
docker start michelin-mongo
```

### Option B - MongoDB installe en local (Windows Service)

Si tu as MongoDB Community Server :

```powershell
Get-Service -Name MongoDB
Start-Service MongoDB
```

Vérification port 27017 :

```powershell
Get-NetTCPConnection -LocalPort 27017 -State Listen
```

---

## 2) Configuration backend (.env)

Dans `backend/`, crée un fichier `.env` (tu peux partir de `.env.example`).

Exemple :

```dotenv
PORT=8000
MONGO_URL=mongodb://localhost:27017
DB_NAME=michelin_guide

# Liste CSV (ou *)
CORS_ORIGINS=http://localhost:3000
```

---

## 3) Installer / Seed / Demarrer le backend

Dans un terminal PowerShell :

```powershell
Set-Location "C:\Users\julia\Documents\ESGI\Hackathon\michelin-guide\backend"

npm install

# (si MongoDB est lance) : injecte des donnees de test dans Mongo
npm run seed

# demarre l'API
npm start
```

Logs attendus :

- `Backend listening on http://localhost:8000`

### Endpoints utiles

- `GET http://localhost:8000/api/` → `{ message: "Hello World" }`
- `GET http://localhost:8000/api/parcours?city=Paris&group_type=voyage&moment=diner`
- `GET http://localhost:8000/api/restaurants`
- `GET http://localhost:8000/api/restaurants/:slug`

> Note : si MongoDB n'est pas dispo, `/api/restaurants` renverra un fallback (mocks) et `/api/parcours` renverra un fallback.

---

## 4) Installer / Demarrer le frontend

Dans un **2e** terminal PowerShell :

```powershell
Set-Location "C:\Users\julia\Documents\ESGI\Hackathon\michelin-guide\frontend"

npm install
npm start
```

Le frontend tourne généralement sur :

- `http://localhost:3000`

### Proxy API

Le frontend a un proxy dev configuré : `frontend/package.json` →

```json
"proxy": "http://localhost:8000"
```

Donc cote navigateur, les appels `fetch('/api/...')` sont automatiquement routes vers le backend.

---

## 5) Verifications rapides (smoke tests)

### Verifier le backend

```powershell
Invoke-WebRequest -UseBasicParsing "http://localhost:8000/api/" | Select-Object StatusCode,Content
Invoke-WebRequest -UseBasicParsing "http://localhost:8000/api/parcours?city=Paris&group_type=ville&moment=dejeuner" | Select-Object StatusCode
```

### Verifier MongoDB

Si seed échoue avec `ECONNREFUSED 27017`, c’est que MongoDB n’est pas lancé.

---

## Depannage

### Erreur seed: `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

- MongoDB n’est pas démarré.
- Lancer Docker Desktop + conteneur Mongo (Option A), ou démarrer le service Windows (Option B).

### Le parcours affiche : "Impossible de charger les resultats"

Le script du parcours (`frontend/public/js/parcours.js`) appelle :

- `/api/parcours?...` (via proxy CRA)
- fallback `http://localhost:8000/api/parcours?...`

A verifier :

- backend bien lance sur `8000`
- frontend bien lance via `npm start` (pas un simple fichier opening)

---

## Commandes utiles

### Backend

```powershell
cd backend
npm test
```

### Frontend

```powershell
cd frontend
npm run build
```


