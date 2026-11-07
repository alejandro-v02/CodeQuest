# Plan de trabajo: App "Tutor de Programación Personalizado" (CodeQuest)

> Documento guía del proyecto. Se sigue fase por fase; no se avanza a la siguiente fase hasta confirmar que la actual funciona.

## 0. Instrucciones para Claude (leer primero)

- Trabajamos **por fases**. No avances a la siguiente fase hasta que yo confirme que la actual funciona.
- Al terminar cada fase: resume qué hiciste, cómo probarlo y qué archivos clave tocaste.
- Explica brevemente **por qué** tomas decisiones de arquitectura; quiero entender el código, no solo recibirlo.
- Responde y comenta en **español**. Código, nombres de variables y commits en **inglés**.
- Usa TypeScript estricto en todo el proyecto. Nada de `any` salvo justificación.
- **Nunca** pongas API keys en el frontend. Todo acceso a la IA y a servicios externos pasa por el backend.
- Usa variables de entorno (`.env`, con `.env.example` versionado).
- Haz commits pequeños y descriptivos por cada bloque de trabajo.

## 1. Resumen del producto

App móvil que enseña programación de forma personalizada:

1. El usuario hace una **prueba de nivel** inicial.
2. La app genera una **ruta de aprendizaje** según su nivel y lenguaje.
3. Cada lección tiene teoría corta + ejercicios de código.
4. Un **editor de código** dentro de la app ejecuta el código del usuario.
5. Una **IA** genera ejercicios adaptados, da pistas sin revelar la solución y explica errores.
6. **Gamificación**: rachas diarias, puntos (XP), logros y ranking.
7. **Panel de progreso** con estadísticas.

**Lenguajes a enseñar (4):** **Python, JavaScript, TypeScript y C++.**
Se construye todo con **Python y JavaScript primero**; TypeScript y C++ se activan después reutilizando el mismo motor. El modelo de datos debe permitir añadir otros (Java, SQL, C#, Go) sin rehacer nada: un lenguaje nuevo = un mapa de currículo + su configuración de ejecución.

**Notas por lenguaje para el motor de ejecución:**
- **TypeScript:** se compila/transpila antes de ejecutar; los ejercicios pueden validar también errores de tipos (el compilador es parte de la corrección). Verificar que Judge0/Piston lo soporte o transpilar en el backend con `typescript`/`esbuild` y ejecutar el JS resultante.
- **C++:** se compila con `g++` (estándar C++17/20); manejar errores de compilación como feedback al usuario, y límites estrictos de tiempo y memoria (riesgo de bucles infinitos y fallos de memoria). Tests de entrada/salida por consola.
- **JavaScript:** Node.js. **Python:** Python 3.

**Principio clave de contenido:** ejercicios casi ilimitados y **nunca repetidos** para el mismo usuario, generados por un motor propio (ver sección 4B), con corrección **verificada ejecutando código**, no confiando ciegamente en la IA.

**Tipos de ejercicio (pensados para móvil):**
1. Quiz de opción múltiple (¿qué imprime este código?)
2. Completar el hueco
3. Ordenar bloques de código (arrastrar líneas)
4. Encontrar el error
5. Escribir código corto (1–5 líneas) con barra de símbolos sobre el teclado
6. Ejercicio largo (recomendado en tablet/web con teclado)

## 2. Stack tecnológico (decidido)

| Capa | Tecnología |
|---|---|
| App móvil | **Ionic + Angular + Capacitor** (standalone components, signals) |
| Estilos | SCSS con tokens de diseño + componentes Ionic |
| Estado | Angular Signals + servicios (RxJS solo donde haga falta) |
| Backend | **NestJS** (TypeScript) |
| Base de datos | **PostgreSQL** + **TypeORM** |
| Autenticación | JWT (access + refresh), contraseñas con argon2/bcrypt |
| IA | API de un LLM (Anthropic u otro), siempre desde el backend |
| Ejecución de código | **Judge0** (API o autoalojado) o **Piston**, llamado desde el backend; soporta los 4 lenguajes |
| Anti-repetición | **pgvector** (extensión de PostgreSQL) para detectar ejercicios parecidos |
| Cola de trabajos | **BullMQ + Redis** para generar ejercicios en segundo plano |
| Editor de código en app | **CodeMirror 6** (o Monaco) dentro del componente Angular |
| Notificaciones | `@capacitor/local-notifications` (recordatorios de racha) y/o push |
| Despliegue backend | Railway o Render (+ Postgres gestionado) |
| Build de la app | Android Studio solo para compilar el APK/AAB final |

**Pruebas durante el desarrollo:** teléfono Android real conectado por USB con depuración activada.
Comando de referencia: `ionic cap run android -l --external` (live reload).

## 3. Arquitectura

### 3.1 Estructura del repositorio (monorepo simple)

```
CodeQuest/
├── apps/
│   ├── mobile/        # Ionic + Angular + Capacitor
│   └── api/           # NestJS
├── docs/              # decisiones, diagramas, notas
├── docker-compose.yml # Postgres local
├── .env.example
└── README.md
```

### 3.2 Backend (NestJS) – módulos

- `auth` – registro, login, refresh, guards, roles.
- `users` – perfil, preferencias (lenguaje, nivel, meta diaria).
- `placement` – prueba de nivel.
- `courses` – lenguajes, rutas, módulos, lecciones.
- `exercises` – ejercicios, casos de prueba, intentos.
- `execution` – integración con Judge0/Piston (ejecutar y validar código).
- `ai` – generación de ejercicios, pistas, explicación de errores, evaluación del nivel.
- `gamification` – XP, rachas, logros, ranking.
- `progress` – estadísticas y panel.
- `notifications` – recordatorios.

Arquitectura limpia por módulo: `controller → service → repository/entities`, con DTOs validados (`class-validator`).

### 3.3 Frontend (Angular) – estructura

```
src/app/
├── core/        # auth, interceptors, guards, config, servicios globales
├── shared/      # componentes UI reutilizables, pipes, directivas
├── features/
│   ├── auth/
│   ├── onboarding/      # elegir lenguaje, meta diaria, prueba de nivel
│   ├── home/            # ruta de aprendizaje
│   ├── lesson/          # teoría + ejercicios
│   ├── editor/          # editor de código + consola de salida
│   ├── progress/        # estadísticas
│   ├── leaderboard/
│   └── profile/
└── styles/      # tokens SCSS, tema claro/oscuro
```

## 4. Modelo de datos (borrador)

- **User**: id, email, passwordHash, displayName, createdAt, dailyGoalMinutes, timezone
- **Language**: id, slug (`javascript`, `python`…), name, judge0LanguageId
- **Course / Path**: id, languageId, level (`beginner|intermediate|advanced`), title
- **Module**: id, pathId, order, title
- **Lesson**: id, moduleId, order, title, contentMarkdown, xpReward
- **Exercise**: id, lessonId, type (`code|quiz|fill`), prompt, starterCode, difficulty, isAiGenerated
- **TestCase**: id, exerciseId, input, expectedOutput, isHidden
- **Attempt**: id, userId, exerciseId, code, passed, output, errorMessage, createdAt
- **UserProgress**: userId, lessonId, status, completedAt
- **PlacementResult**: userId, languageId, score, assignedLevel
- **Streak**: userId, currentStreak, longestStreak, lastActivityDate
- **XpEvent**: userId, amount, reason, createdAt
- **Achievement** / **UserAchievement**
- **AiInteraction** (log opcional): userId, type, tokensUsed, createdAt — para controlar costos

## 4B. Motor de ejercicios ilimitados (corazón del proyecto)

### Las 3 capas

**Capa 1 — Mapa de currículo (la "información completa" de cada lenguaje).**
Un árbol de conceptos por lenguaje: tema → subtema → habilidad, con prerrequisitos y dificultad (1–10). Ejemplo Python: variables → tipos → strings (métodos, f-strings, slicing) → listas → comprensiones → diccionarios → funciones → clases → excepciones → archivos → módulos → asíncrono, etc.
- Se construye a partir de la documentación oficial y roadmaps conocidos; se revisa manualmente.
- Cada nodo tiene una lección base **revisada manualmente** (calidad garantizada) y alimenta al generador.
- Guardar como datos (JSON/seed versionado), no en el código.

**Capa 2 — Generación de ejercicios.**
Cada ejercicio nuevo se genera con parámetros: `lenguaje + concepto + dificultad + tipo + tema/contexto aleatorio + semilla`. El "tema/contexto" (tienda, videojuego, banco, clima, escuela…) cambia la historia para que no se sienta repetido.
Dos fuentes:
- **Plantillas parametrizadas (gratis e ilimitadas):** quizzes de "qué imprime" con valores aleatorios; la respuesta correcta se obtiene **ejecutando** el código en el sandbox.
- **Generación con IA:** para enunciados, completar huecos, errores, ejercicios de escribir código.

**Capa 3 — Verificación y filtro (obligatoria antes de servir cualquier ejercicio).**
Pipeline de cada ejercicio generado:
1. La IA devuelve JSON estricto: enunciado, código inicial, **solución de referencia**, casos de prueba, pista 1/2/3.
2. Se **ejecuta la solución de referencia** contra los casos de prueba en Judge0. Si falla, se descarta.
3. Se verifica que el código inicial **no** pase los tests (el ejercicio debe requerir trabajo).
4. **Anti-duplicado:** se calcula un embedding del enunciado y se compara con pgvector; si es demasiado parecido a uno existente, se descarta.
5. Se guarda como `status = approved` con su dificultad estimada.
6. Al servirlo, se excluyen todos los que el usuario ya vio (`UserExerciseHistory`).

### Cómo se sirve al usuario
- **Banco de ejercicios aprobados** + **trabajo en segundo plano** (BullMQ) que mantiene siempre un colchón (ej. ≥ 30 ejercicios sin ver por concepto y nivel). Así el usuario nunca espera a la IA.
- Los ejercicios aprobados se **comparten entre usuarios** (se genera una vez, sirve a muchos); cada usuario solo ve los que no ha hecho.
- **Adaptativo:** si falla un concepto, se le sirven más ejercicios de ese concepto y bajan de dificultad; si acierta, suben. Repaso espaciado de conceptos débiles.
- **Calibración:** la dificultad real se ajusta con la tasa de aciertos de usuarios; ejercicios con tasa absurda (0 % o 100 %) o reportados se revisan/retiran.
- Botón "Reportar ejercicio" en la app.

### Realismo y costos (importante)
- "Infinito" aquí = decenas de miles de ejercicios únicos, no infinito matemático; es más que suficiente.
- Costos de IA: controlar con generación por lotes, caché, modelos baratos para tareas simples y límites diarios.
- La IA puede equivocarse: por eso **nunca** se sirve un ejercicio sin la verificación por ejecución.
- Contenido teórico de lecciones: lo central, revisado manualmente; la IA complementa, no reemplaza.

## 5. Fases de trabajo

### Fase 1 — Base del proyecto
- [x] Crear monorepo, `docker-compose.yml` con Postgres, `.env.example`.
- [x] Inicializar NestJS (`apps/api`) con TypeORM, validación global, manejo de errores, config por entorno.
- [x] Inicializar Ionic + Angular + Capacitor (`apps/mobile`), tema base oscuro.
- [x] Health check del backend y pantalla de prueba en el teléfono llamándolo.
- **Entrega:** la app en el teléfono muestra "API OK" leyendo el backend.

### Fase 2 — Autenticación y usuarios
- [x] Backend: registro, login, refresh token, guard JWT, endpoint `GET /me`.
- [x] App: pantallas de registro/login, almacenamiento seguro del token, interceptor HTTP y guards de ruta.
- [x] Onboarding: elegir lenguaje y meta diaria.
- **Entrega:** puedo registrarme, iniciar sesión y mantener la sesión al reabrir la app.

### Fase 3 — Contenido: rutas, módulos y lecciones
- [ ] Entidades y migraciones del contenido.
- [ ] Cargar el **mapa de currículo** (sección 4B, capa 1) de los 4 lenguajes (Python, JavaScript, TypeScript, C++) como datos; lecciones completas de **Python y JavaScript nivel principiante** (variables, tipos, condicionales, bucles, funciones, listas/arrays, diccionarios/objetos).
- [ ] App: pantalla "Ruta de aprendizaje" (mapa de módulos con estados bloqueado/en curso/completo) y pantalla de lección (renderizar Markdown).
- **Entrega:** navego la ruta y leo lecciones reales desde la API.

### Fase 4 — Editor y ejecución de código
- [ ] Integrar CodeMirror en un componente `code-editor` (resaltado, tema, teclado móvil usable).
- [ ] Backend `execution`: enviar código a Judge0/Piston, manejar timeouts y límites, devolver stdout/stderr.
- [ ] Validar el ejercicio contra los `TestCase` y registrar `Attempt`.
- [ ] App: consola de salida, botón "Ejecutar" y "Enviar", feedback de casos pasados/fallidos.
- **Entrega:** resuelvo un ejercicio, se ejecuta mi código y se valida contra los tests.
- **Seguridad:** nunca ejecutar código del usuario en el propio servidor de la API; solo vía sandbox externo.

### Fase 4B — Tipos de ejercicio para móvil
- [ ] Componentes: quiz, completar hueco, ordenar bloques (drag & drop), encontrar el error, código corto con barra de símbolos (`{ } ( ) [ ] ; = " ' :`).
- [ ] Todos comparten un contrato de ejercicio común (`type`, `payload`, `validation`).
- **Entrega:** puedo hacer los 5 tipos de ejercicio cómodamente en el teléfono.

### Fase 5A — Motor de ejercicios ilimitados
- [ ] Tablas: `Concept`, `Exercise` (con `status`, `embedding`, `difficulty`), `UserExerciseHistory`, `ExerciseReport`.
- [ ] Activar `pgvector`; servicio de embeddings y detección de duplicados.
- [ ] Generador con IA (JSON estricto, prompts versionados) + **plantillas parametrizadas** para quizzes.
- [ ] Pipeline de verificación por ejecución (solución de referencia vs tests, código inicial no debe pasar).
- [ ] Cola BullMQ + Redis que rellena el banco por concepto/nivel/tipo.
- [ ] Servicio "siguiente ejercicio": excluye vistos, adapta dificultad, repaso de conceptos débiles.
- [ ] Reportar ejercicio y recalibrar dificultad según aciertos.
- [ ] Panel de administración mínimo para ver cuántos ejercicios hay por lenguaje/concepto y los descartados.
- **Entrega:** puedo hacer 50 ejercicios seguidos del mismo concepto sin ver ninguno repetido, todos con corrección correcta.

### Fase 5B — IA tutora
- [ ] Servicio `ai` con prompts versionados en archivos aparte y salida estructurada (JSON validado).
- [ ] **Prueba de nivel adaptativa:** generar preguntas, evaluar respuestas y asignar nivel.
- [ ] **Pistas graduales:** 3 niveles de pista, sin revelar la solución.
- [ ] **Explicar errores:** el usuario envía su código + el error y recibe una explicación didáctica.
- [ ] Priorizar en el motor 5A los conceptos débiles del usuario (basado en `Attempt`).
- [ ] Límites de uso por usuario/día, caché y registro en `AiInteraction`.
- **Entrega:** prueba de nivel funcional, pistas y explicación de errores dentro de la app.

### Fase 6 — Gamificación
- [ ] XP por lección/ejercicio, cálculo de nivel de usuario.
- [ ] Racha diaria (respetando zona horaria) y su pantalla.
- [ ] Logros (primer ejercicio, racha de 7 días, 10 ejercicios sin pistas, etc.).
- [ ] Ranking semanal.
- [ ] Recordatorios con notificaciones locales según la meta diaria.
- **Entrega:** gano XP, mantengo racha y recibo recordatorios.

### Fase 7 — Panel de progreso y pulido
- [ ] Estadísticas: tiempo de estudio, ejercicios resueltos, tasa de acierto, temas fuertes/débiles.
- [ ] Estados de carga, vacíos y errores en todas las pantallas; modo offline básico (mostrar lecciones ya cargadas).
- [ ] Accesibilidad básica, animaciones suaves, iconos y splash screen.
- **Entrega:** app consistente y agradable de usar.

### Fase 8 — Calidad y despliegue
- [ ] Tests: unitarios del backend (servicios clave), e2e de auth y ejecución; pruebas de componentes críticos del front.
  - Nota (Fase 1): el e2e por defecto de Nest se eliminó porque `@nestjs/config`/`@nestjs/typeorm` ya son ESM puro y chocan con `ts-jest` + `module: nodenext`. Resolver aquí (transform/ESM config de Jest) antes de escribir la suite real.
- [ ] CI básico (lint + tests) con GitHub Actions.
- [ ] Desplegar API + Postgres en Railway/Render, migraciones en producción.
- [ ] Generar APK/AAB firmado con Capacitor + Android Studio.
- [ ] README con instrucciones de instalación y capturas.
- **Entrega:** backend en producción y APK instalable.

## 6. Reglas técnicas

- DTOs validados y respuestas tipadas; nada de lógica de negocio en controllers.
- Migraciones de TypeORM (no `synchronize: true` fuera de desarrollo).
- Rate limiting en endpoints de auth, ejecución e IA.
- Sanitizar el Markdown renderizado en la app.
- Contenido de lecciones en la base de datos (seed versionado), no hardcodeado en el front.
- Prompts de IA fuera del código de negocio y fáciles de iterar.
- Controlar costos de IA: límites diarios, caché de pistas/explicaciones repetidas.

## 7. Definición de "terminado" por funcionalidad

Una funcionalidad está lista cuando: funciona en un teléfono real, maneja errores y estados de carga, tiene validación en backend, y se puede explicar cómo funciona.

## 9. Ideas para después (fuera del alcance inicial)

- Más lenguajes (Java, SQL, C#, Go): solo requieren mapa de currículo + configuración de Judge0.
- Retos 1 vs 1 y modo competitivo.
- Modo "revisión de código" donde la IA critica tu solución.
- Versión iOS.
- Suscripción premium con más uso de IA.
