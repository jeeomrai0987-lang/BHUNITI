# PROJECT_CONTEXT.md — BHUNITI Land Governance Platform
*Unified Master Context & UP Bhunaksha 10-Parcel Cadastral Integration*
*Last Verified: August 30, 2026*

---

## 1. System Architecture Overview

```
+---------------------------------------------------------------------------------------+
|                                    USER BROWSER                                       |
|                React 18 Single Page Application (bhuniti-react)                      |
|                Running on: http://127.0.0.1:5173 / http://localhost:5173              |
|                                                                                       |
|  [NEW] UP Bhunaksha (भू-नक्शा) Cadastral Engine (Ghaziabad 10 Contiguous Parcels)      |
|  [NEW] ParcelMapViewer (Bhunaksha Palette + Khasra Badges + Bigha/Biswa Conversion)  |
|  [NEW] Virtual360Viewer (360° Field Survey Inspection + Drone Orbit + DGPS Hotspots)  |
|  [NEW] Digital Registry wizard at /registry (src/registry — 6 steps, own chrome,      |
|        opened by the Platform section's Digital Registry card)                         |
|  [NEW] English + हिंदी throughout, one language choice shared by both i18n runtimes    |
+------------------------------------------+--------------------------------------------+
                                           |
                                [REST API / JSON / JWT]
                                (src/services/api.js)
                                           v
+---------------------------------------------------------------------------------------+
|                                  FASTAPI BACKEND                                      |
|               Python 3.14 + FastAPI + SQLAlchemy Async + Pydantic v2                 |
|               Running on: http://127.0.0.1:8000 (Docs: /docs)                         |
|               Directory: d:\sih\BHUNITI\bhuniti-backend\                             |
+---------------------+-----------------------------------+-----------------------------+
                      |                                   |
           [Primary Supabase Connection]       [Secondary Supabase Connection]
                      |                                   |
                      v                                   v
+---------------------------------------+  +--------------------------------------------+
|     SUPABASE CLOUD DB 1 (Primary)     |  |    SUPABASE CLOUD DB 2 (Secondary Mirror)  |
| Host: Configured via .env             |  | Host: Configured via .env                  |
| Rest: Configured via .env             |  | Rest: Configured via .env                  |
| Status: 13 Live PostGIS Parcels       |  | Status: Synchronized & 0 Conflicts         |
+---------------------------------------+  +--------------------------------------------+
```

---

## 2. 10 Active Contiguous UP Bhunaksha Parcels (Ghaziabad District)

| Khasra No. | ULPIN | Registered Owner | Area (ha / Bigha) | Land Category | Status & Palette |
|---|---|---|---|---|---|
| **ख. 412/1** | `09-0824-0014-1024` | Rahul Sharma (Sunita Sharma) | 2.00 ha (7.90 Bigha) | Agricultural (Zamin) | 🟢 Verified Cadastral |
| **ख. 412/2** | `09-0824-0014-1025` | Sunita Devi & Ramesh Chand | 1.45 ha (5.73 Bigha) | Agricultural (Zamin) | 🟢 Verified Cadastral |
| **ख. 413** | `09-0824-0014-1026` | Rajesh Kumar (Vikas Kumar) | 14.68 ha (57.98 Bigha)| Agricultural (Fasli) | 🟡 Under Mutation (M-2026-018) |
| **ख. 414** | `09-0824-0014-1027` | Manoj Tyagi | 3.40 ha (13.43 Bigha) | Commercial / Warehouse | 🔴 Disputed (1.2m Road Overlap) |
| **ख. 415/1** | `09-0824-0014-1028` | Gram Sabha (Govt of UP) | 5.80 ha (22.91 Bigha) | Pasture / Charnot (Public)| 🟠 Gram Sabha State Land |
| **ख. 415/2** | `09-0824-0014-1029` | Dr. Arvind Mishra & Family | 0.85 ha (3.36 Bigha) | Residential / Abadi | 🔵 Residential Abadi |
| **ख. 416** | `09-0824-0014-1030` | UP Irrigation Department | 1.20 ha (4.74 Bigha) | Waterbody / Canal Nala | 🔷 Protected Water Reserve |
| **ख. 417** | `09-0824-0014-1031` | Amit Choudhary & Brothers | 4.10 ha (16.19 Bigha) | Agricultural (Fasli) | 🟢 Verified Cadastral |
| **ख. 418** | `09-0824-0014-1032` | Balram Singh | 2.75 ha (10.86 Bigha) | Horticulture / Bagh | 🍏 Mango Orchard (Bagh) |
| **ख. 419** | `09-0824-0014-1033` | Priya Sharma (Transferee) | 1.95 ha (7.70 Bigha) | Agricultural (Zamin) | 🟡 Title Transfer (MUT-2023-8941) |

---

## 3. Database Configuration
Database connections are securely configured via environment variables (refer to `.env.example`).
- **Primary Database**: Configured via `DATABASE_URL` in `.env`
- **Secondary Database**: Configured via environment variables for synchronization
- **Local Fallback**: SQLite (`./bhuniti_local.db`) enabled by default when remote DB is offline.

---

## 4. Startup & Execution Commands

### Start Backend Server:
```bash
cd d:\sih\BHUNITI\bhuniti-backend
python -m uvicorn app.main:app --reload --port 8000
```

### Start Frontend Server:
```bash
cd d:\sih\BHUNITI\bhuniti-react
npm run dev -- --host 127.0.0.1 --port 5173
```

### Run Full-Stack Automated Verification:
```bash
cd d:\sih\BHUNITI\bhuniti-backend
python test_e2e_live.py
```
