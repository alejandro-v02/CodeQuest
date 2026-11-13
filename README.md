# CodeQuest

App móvil de aprendizaje de programación personalizado: prueba de nivel, rutas de aprendizaje adaptativas, editor de código ejecutable en sandbox, IA tutora y gamificación (XP, rachas, logros).

Lenguajes objetivo: **Python, JavaScript, TypeScript y C++** (motor de contenido extensible a otros lenguajes).

## Stack

- **App móvil:** Ionic + Angular (standalone components, signals) + Capacitor
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Ejecución de código:** Piston autoalojado en Docker (vía backend, nunca en el servidor de la API)
- **IA:** OpenAI (chat y embeddings), llamado siempre desde el backend, con tope diario por usuario
- **Cola de trabajos:** BullMQ + Redis
- **Editor:** área de texto propia, ligera y compatible con el teclado del móvil

## Estructura del repositorio

```
CodeQuest/
├── apps/
│   ├── mobile/        # Ionic + Angular + Capacitor
│   └── api/            # NestJS
├── docs/                # decisiones, diagramas, notas
├── docker-compose.yml   # Postgres, Redis y Piston locales
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

### Primera vez: lenguajes y contenido

```bash
cd apps/api
npm run setup:piston   # instala los runtimes en Piston (Python, Node, TypeScript, GCC)
npm run seed           # carga el currículo y los conceptos en la base de datos
```

### Comandos útiles (`apps/api`)

| Comando                | Qué hace                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run verify:seeds` | revisa la estructura de los ejercicios y corre las soluciones de Python y JS en local |
| `npm run verify:piston`| corre todas las soluciones dentro de Piston (único chequeo que cubre TypeScript) |
| `npm test`             | pruebas unitarias                                                     |

Si el móvil está conectado por USB, redirige el puerto del backend con `adb reverse tcp:3000 tcp:3000` (hay que repetirlo al reinstalar la app o reiniciar adb).

### App móvil (`apps/mobile`)

```bash
cd apps/mobile
npm install
ionic cap run android -l --external
```

## Estado del proyecto

Ver [`PLAN.md`](./PLAN.md) para las fases de trabajo y el detalle de cada entrega.
