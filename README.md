# CodeQuest

App móvil de aprendizaje de programación personalizado: prueba de nivel, rutas de aprendizaje adaptativas, editor de código ejecutable en sandbox, IA tutora y gamificación (XP, rachas, logros).

Lenguajes objetivo: **Python, JavaScript, TypeScript y C++** (motor de contenido extensible a otros lenguajes).

## Stack

- **App móvil:** Ionic + Angular (standalone components, signals) + Capacitor
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Ejecución de código:** Judge0 / Piston (vía backend, nunca en el servidor de la API)
- **IA:** LLM llamado siempre desde el backend
- **Cola de trabajos:** BullMQ + Redis
- **Editor:** CodeMirror 6

## Estructura del repositorio

```
CodeQuest/
├── apps/
│   ├── mobile/        # Ionic + Angular + Capacitor
│   └── api/            # NestJS
├── docs/                # decisiones, diagramas, notas
├── docker-compose.yml   # Postgres local
├── .env.example
└── PLAN.md              # plan de trabajo por fases
```

## Desarrollo local

### Requisitos

- Node.js 20+
- Docker (para PostgreSQL local)
- Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio + `adb` (para probar en un dispositivo real)

### Backend (`apps/api`)

```bash
cp .env.example .env
docker compose up -d
cd apps/api
npm install
npm run start:dev
```

### App móvil (`apps/mobile`)

```bash
cd apps/mobile
npm install
ionic cap run android -l --external
```

## Estado del proyecto

Ver [`PLAN.md`](./PLAN.md) para las fases de trabajo y el detalle de cada entrega.
