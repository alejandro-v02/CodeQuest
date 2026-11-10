import type { ProgrammingLanguageSlug } from '../../modules/users/entities/user.entity';
import { pythonExtraExercises } from './python/extra-exercises';
import { pythonExtraModules } from './python';
import type {
  BugPayload,
  ExerciseType,
  FillPayload,
  QuizPayload,
  SortPayload,
} from '../../modules/exercises/entities/exercise.entity';

export interface SeedTestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface SeedExercise {
  type: ExerciseType;
  prompt: string;
  difficulty: number;
  // 'code' only:
  starterCode?: string;
  testCases?: SeedTestCase[];
  // Reference answer for 'code' exercises. Never persisted by seed.ts — only
  // scripts/verify-seeds.js runs it to prove the test cases are consistent.
  solution?: string;
  // Fase 4B types only — shape depends on `type` (see exercise.entity.ts):
  payload?: QuizPayload | FillPayload | SortPayload | BugPayload;
}

export interface SeedLesson {
  title: string;
  contentMarkdown: string | null;
  xpReward: number;
  // Only a handful of lessons have a hand-written exercise so far (Fase 4
  // end-to-end proof); the rest get real ones once Fase 5A's generator
  // exists.
  exercises?: SeedExercise[];
}

export interface SeedModule {
  title: string;
  lessons: SeedLesson[];
}

export interface SeedLanguage {
  slug: ProgrammingLanguageSlug;
  name: string;
  pathTitle: string;
  pathDescription: string;
  modules: SeedModule[];
}

// Fase 3 (PLAN.md): el mapa de currículo cubre los 4 lenguajes, pero las
// lecciones completas (contentMarkdown) solo están escritas para Python y
// JavaScript nivel principiante. TypeScript y C++ quedan con la estructura
// de temas cargada y contentMarkdown en null hasta una fase posterior.
const baseCurriculum: SeedLanguage[] = [
  {
    slug: 'python',
    name: 'Python',
    pathTitle: 'Python para principiantes',
    pathDescription:
      'Los fundamentos de Python: variables, tipos, control de flujo y estructuras de datos.',
    modules: [
      {
        title: 'Fundamentos',
        lessons: [
          {
            title: 'Variables y asignación',
            xpReward: 10,
            contentMarkdown: `# Variables y asignación

Una **variable** es un nombre que apunta a un valor guardado en memoria. En Python no declaras el tipo: se infiere al asignar.

\`\`\`python
edad = 25
nombre = "Ana"
altura = 1.68
\`\`\`

Usa \`snake_case\` para nombrar variables (\`puntaje_total\`, no \`PuntajeTotal\`). Python distingue mayúsculas de minúsculas: \`Edad\` y \`edad\` son variables distintas.

Puedes reasignar el valor de una variable en cualquier momento, incluso cambiando su tipo:

\`\`\`python
contador = 0
contador = contador + 1   # ahora vale 1
contador = "listo"        # ahora es un string
\`\`\`

Para modificar el valor actual existen operadores abreviados:

\`\`\`python
puntos = 10
puntos += 5   # equivalente a: puntos = puntos + 5
\`\`\`

**Constantes:** Python no tiene una palabra clave para constantes, pero por convención se escriben en mayúsculas (\`PI = 3.14159\`) para indicar que no deberían reasignarse.`,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Lee un número entero de la entrada estándar (con `input()`) y súmale 10. Imprime el resultado.',
                starterCode: 'numero = int(input())\n',
                solution: 'numero = int(input())\nprint(numero + 10)\n',
                difficulty: 1,
                testCases: [
                  { input: '5', expectedOutput: '15', isHidden: false },
                  { input: '0', expectedOutput: '10', isHidden: false },
                  { input: '37', expectedOutput: '47', isHidden: true },
                ],
              },
            ],
          },
          {
            title: 'Tipos de datos básicos',
            xpReward: 10,
            contentMarkdown: `# Tipos de datos básicos

Python tiene unos pocos tipos fundamentales que vas a usar todo el tiempo:

| Tipo | Ejemplo | Descripción |
|---|---|---|
| \`int\` | \`42\` | números enteros |
| \`float\` | \`3.14\` | números con decimales |
| \`str\` | \`"hola"\` | texto |
| \`bool\` | \`True\`, \`False\` | verdadero o falso |

Puedes revisar el tipo de cualquier valor con \`type()\`:

\`\`\`python
type(42)        # <class 'int'>
type("hola")    # <class 'str'>
\`\`\`

**Conversión entre tipos:**

\`\`\`python
edad_texto = "25"
edad_numero = int(edad_texto)   # 25 (int)
precio = str(19.99)             # "19.99" (str)
\`\`\`

Los strings se formatean con f-strings, la forma más cómoda de insertar variables en un texto:

\`\`\`python
nombre = "Luis"
edad = 30
mensaje = f"{nombre} tiene {edad} años"
\`\`\`

Ten cuidado al mezclar tipos sin convertir: \`"edad: " + 25\` lanza un error porque Python no suma automáticamente texto y números.`,
            exercises: [
              {
                type: 'quiz',
                prompt: '¿Qué imprime este código?',
                difficulty: 1,
                payload: {
                  code: 'precio = "19.99"\nprint(type(precio))',
                  options: [
                    "<class 'float'>",
                    "<class 'str'>",
                    "<class 'int'>",
                    '19.99',
                  ],
                  correctIndex: 1,
                },
              },
            ],
          },
          {
            title: 'Condicionales',
            xpReward: 10,
            contentMarkdown: `# Condicionales (if / elif / else)

Los condicionales permiten que tu programa tome decisiones según se cumpla o no una condición.

\`\`\`python
edad = 17

if edad >= 18:
    print("Eres mayor de edad")
elif edad >= 13:
    print("Eres adolescente")
else:
    print("Eres niño")
\`\`\`

Python usa **indentación** (espacios al inicio de línea) para marcar qué código pertenece a cada bloque, en vez de llaves \`{}\`. Es obligatoria: si te equivocas de indentación, el programa no funciona.

**Operadores de comparación:** \`==\` (igual), \`!=\` (distinto), \`>\`, \`<\`, \`>=\`, \`<=\`.

**Operadores lógicos:** combina condiciones con \`and\`, \`or\`, \`not\`:

\`\`\`python
edad = 20
tiene_entrada = True

if edad >= 18 and tiene_entrada:
    print("Puede entrar")
\`\`\`

Cualquier valor puede evaluarse como verdadero o falso: \`0\`, \`""\`, \`None\` y las listas vacías cuentan como \`False\`; casi todo lo demás es \`True\`.`,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Lee un número entero. Si es par, imprime "par"; si es impar, imprime "impar".',
                starterCode: 'numero = int(input())\n',
                solution:
                  'numero = int(input())\nif numero % 2 == 0:\n    print("par")\nelse:\n    print("impar")\n',
                difficulty: 2,
                testCases: [
                  { input: '4', expectedOutput: 'par', isHidden: false },
                  { input: '7', expectedOutput: 'impar', isHidden: false },
                  { input: '0', expectedOutput: 'par', isHidden: true },
                ],
              },
              {
                type: 'fill',
                prompt:
                  'Completa el condicional para que compare correctamente.',
                difficulty: 1,
                payload: {
                  template:
                    'edad = 15\n\nif edad {{0}} 18:\n    print("menor de edad")\n{{1}}:\n    print("mayor de edad")',
                  blanks: ['<', 'else'],
                },
              },
            ],
          },
          {
            title: 'Bucles',
            xpReward: 10,
            contentMarkdown: `# Bucles (for / while)

Un bucle repite un bloque de código varias veces.

**\`for\`** recorre los elementos de una secuencia (una lista, un rango de números, un texto):

\`\`\`python
for numero in range(5):
    print(numero)   # imprime 0, 1, 2, 3, 4

frutas = ["manzana", "pera", "uva"]
for fruta in frutas:
    print(fruta)
\`\`\`

\`range(5)\` genera los números del 0 al 4. \`range(2, 8)\` va de 2 a 7, y \`range(0, 10, 2)\` cuenta de 2 en 2.

**\`while\`** repite mientras una condición sea verdadera:

\`\`\`python
contador = 0
while contador < 3:
    print(contador)
    contador += 1
\`\`\`

Cuidado con los bucles infinitos: si la condición de un \`while\` nunca se vuelve falsa, el programa nunca termina.

\`break\` corta el bucle por completo; \`continue\` salta a la siguiente vuelta sin ejecutar el resto del bloque:

\`\`\`python
for numero in range(10):
    if numero == 5:
        break        # se detiene en 5
    if numero % 2 == 0:
        continue     # se salta los pares
    print(numero)
\`\`\``,
            exercises: [
              {
                type: 'sort',
                prompt:
                  'Ordena las líneas para que el bucle imprima los números del 1 al 3.',
                difficulty: 1,
                payload: {
                  blocks: [
                    'contador = 1',
                    'while contador <= 3:',
                    '    print(contador)',
                    '    contador += 1',
                  ],
                },
              },
            ],
          },
          {
            title: 'Funciones',
            xpReward: 10,
            contentMarkdown: `# Funciones

Una función agrupa código reutilizable bajo un nombre. Se define con \`def\`:

\`\`\`python
def saludar(nombre):
    return f"Hola, {nombre}!"

mensaje = saludar("Marta")
print(mensaje)   # Hola, Marta!
\`\`\`

\`return\` devuelve un valor y termina la función. Si no usas \`return\`, la función devuelve \`None\` por defecto.

**Parámetros con valor por defecto:**

\`\`\`python
def saludar(nombre, idioma="es"):
    if idioma == "es":
        return f"Hola, {nombre}"
    return f"Hello, {nombre}"

saludar("Ana")           # usa idioma="es"
saludar("Ana", "en")     # usa idioma="en"
\`\`\`

Una función puede devolver múltiples valores a la vez (como una tupla):

\`\`\`python
def dividir(a, b):
    cociente = a // b
    resto = a % b
    return cociente, resto

c, r = dividir(17, 5)   # c=3, r=2
\`\`\`

Las variables definidas dentro de una función solo existen dentro de ella (**alcance local**); no son visibles afuera.`,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Define una función `es_mayor_de_edad(edad)` que devuelva `True` si `edad` es mayor o igual a 18. Lee un número de la entrada estándar, pásalo a la función e imprime el resultado.',
                starterCode:
                  'def es_mayor_de_edad(edad):\n    # Escribe tu código aquí\n    pass\n\nedad = int(input())\nprint(es_mayor_de_edad(edad))\n',
                solution:
                  'def es_mayor_de_edad(edad):\n    return edad >= 18\n\nedad = int(input())\nprint(es_mayor_de_edad(edad))\n',
                difficulty: 2,
                testCases: [
                  { input: '20', expectedOutput: 'True', isHidden: false },
                  { input: '15', expectedOutput: 'False', isHidden: false },
                  { input: '18', expectedOutput: 'True', isHidden: true },
                ],
              },
              {
                type: 'bug',
                prompt:
                  'Este código debería duplicar el número, pero tiene un error. ¿En qué línea está?',
                difficulty: 2,
                payload: {
                  lines: [
                    'def duplicar(numero):',
                    '    resultado = numero * 2',
                    '    print(resultado)',
                    '',
                    'duplicar(5)',
                    'valor = duplicar(5)',
                    'print(valor + 1)',
                  ],
                  buggyLineIndex: 2,
                  explanation:
                    'La función usa `print(resultado)` en vez de `return resultado`, así que `duplicar(5)` siempre devuelve `None` y `valor + 1` falla.',
                },
              },
            ],
          },
          {
            title: 'Listas',
            xpReward: 10,
            contentMarkdown: `# Listas

Una lista guarda varios valores en orden, y puede crecer o cambiar.

\`\`\`python
numeros = [10, 20, 30]
nombres = ["Ana", "Luis", "Eva"]
mixta = [1, "dos", 3.0, True]
\`\`\`

**Acceso por índice** (empieza en 0):

\`\`\`python
numeros[0]    # 10
numeros[-1]   # 30 (el último elemento)
\`\`\`

**Operaciones comunes:**

\`\`\`python
numeros.append(40)        # agrega al final -> [10, 20, 30, 40]
numeros.remove(20)        # elimina el valor 20
numeros.pop()              # quita y devuelve el último elemento
len(numeros)               # cantidad de elementos
30 in numeros               # True si 30 está en la lista
\`\`\`

**Slicing** (sublistas): \`lista[inicio:fin]\` excluye el índice final.

\`\`\`python
letras = ["a", "b", "c", "d", "e"]
letras[1:3]    # ["b", "c"]
letras[:2]     # ["a", "b"]
letras[2:]     # ["c", "d", "e"]
\`\`\`

**List comprehensions** crean listas nuevas de forma compacta:

\`\`\`python
cuadrados = [n * n for n in range(5)]   # [0, 1, 4, 9, 16]
pares = [n for n in range(10) if n % 2 == 0]
\`\`\``,
          },
          {
            title: 'Diccionarios',
            xpReward: 10,
            contentMarkdown: `# Diccionarios

Un diccionario guarda pares **clave: valor**, útil cuando quieres buscar datos por nombre en vez de por posición.

\`\`\`python
persona = {
    "nombre": "Carla",
    "edad": 28,
    "activo": True,
}
\`\`\`

**Acceso y modificación:**

\`\`\`python
persona["nombre"]          # "Carla"
persona["edad"] = 29       # modifica el valor
persona["ciudad"] = "Lima" # agrega una clave nueva
\`\`\`

Acceder a una clave que no existe lanza un error; \`get()\` evita eso devolviendo \`None\` (o un valor por defecto) en su lugar:

\`\`\`python
persona.get("telefono")            # None
persona.get("telefono", "N/A")     # "N/A"
\`\`\`

**Recorrer un diccionario:**

\`\`\`python
for clave, valor in persona.items():
    print(clave, valor)

for clave in persona.keys():
    print(clave)

for valor in persona.values():
    print(valor)
\`\`\`

Puedes comprobar si una clave existe con \`in\`, y eliminarla con \`del\`:

\`\`\`python
"nombre" in persona   # True
del persona["activo"]
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    pathTitle: 'JavaScript para principiantes',
    pathDescription:
      'Los fundamentos de JavaScript: variables, tipos, control de flujo y estructuras de datos.',
    modules: [
      {
        title: 'Fundamentos',
        lessons: [
          {
            title: 'Variables y asignación',
            xpReward: 10,
            contentMarkdown: `# Variables y asignación

En JavaScript declaras variables con \`let\`, \`const\` o \`var\` (esta última, en desuso).

\`\`\`javascript
let edad = 25;
const nombre = "Ana";
let altura = 1.68;
\`\`\`

**\`let\`** permite reasignar el valor después. **\`const\`** no: una vez asignada, no puede cambiar (aunque si guarda un objeto o array, su contenido sí puede modificarse). Usa \`const\` por defecto y \`let\` solo cuando sepas que vas a reasignar.

\`\`\`javascript
let contador = 0;
contador = contador + 1;   // válido

const PI = 3.14159;
PI = 3;   // Error: Assignment to constant variable
\`\`\`

Cada línea termina (por convención) con \`;\`. JavaScript usa \`camelCase\` para nombrar variables: \`puntajeTotal\`, no \`puntaje_total\`.

**Operadores abreviados:**

\`\`\`javascript
let puntos = 10;
puntos += 5;   // equivalente a: puntos = puntos + 5
\`\`\``,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Lee un número entero de la entrada estándar y súmale 10. Imprime el resultado con `console.log`.',
                starterCode:
                  "const numero = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);\n",
                difficulty: 1,
                testCases: [
                  { input: '5', expectedOutput: '15', isHidden: false },
                  { input: '0', expectedOutput: '10', isHidden: false },
                  { input: '37', expectedOutput: '47', isHidden: true },
                ],
              },
            ],
          },
          {
            title: 'Tipos de datos básicos',
            xpReward: 10,
            contentMarkdown: `# Tipos de datos básicos

Los tipos primitivos más comunes en JavaScript:

| Tipo | Ejemplo | Descripción |
|---|---|---|
| \`number\` | \`42\`, \`3.14\` | enteros y decimales (un solo tipo numérico) |
| \`string\` | \`"hola"\` | texto |
| \`boolean\` | \`true\`, \`false\` | verdadero o falso |
| \`undefined\` | — | variable declarada sin valor |
| \`null\` | — | ausencia de valor, asignada a propósito |

Puedes revisar el tipo con \`typeof\`:

\`\`\`javascript
typeof 42        // "number"
typeof "hola"     // "string"
\`\`\`

**Conversión entre tipos:**

\`\`\`javascript
const edadTexto = "25";
const edadNumero = Number(edadTexto);   // 25
const precio = String(19.99);           // "19.99"
\`\`\`

Los **template literals** (comillas invertidas) son la forma más cómoda de insertar variables en un texto:

\`\`\`javascript
const nombre = "Luis";
const edad = 30;
const mensaje = \`\${nombre} tiene \${edad} años\`;
\`\`\`

Cuidado: \`+\` entre un número y un string concatena en vez de sumar: \`"edad: " + 25\` da \`"edad: 25"\`, y \`"5" + 1\` da \`"51"\`, no \`6\`.`,
          },
          {
            title: 'Condicionales',
            xpReward: 10,
            contentMarkdown: `# Condicionales (if / else if / else)

\`\`\`javascript
const edad = 17;

if (edad >= 18) {
  console.log("Eres mayor de edad");
} else if (edad >= 13) {
  console.log("Eres adolescente");
} else {
  console.log("Eres niño");
}
\`\`\`

A diferencia de Python, JavaScript usa llaves \`{}\` para marcar cada bloque, no indentación (aunque indentar bien sigue siendo buena práctica para leer el código).

**Operadores de comparación:** usa siempre \`===\` y \`!==\` (comparación estricta, compara tipo y valor) en vez de \`==\`/\`!=\`, que convierten los tipos antes de comparar y pueden dar resultados sorprendentes (\`"5" == 5\` es \`true\`, pero \`"5" === 5\` es \`false\`).

**Operadores lógicos:** \`&&\` (y), \`||\` (o), \`!\` (no):

\`\`\`javascript
const edad = 20;
const tieneEntrada = true;

if (edad >= 18 && tieneEntrada) {
  console.log("Puede entrar");
}
\`\`\`

Valores "falsy" (se comportan como \`false\` en un \`if\`): \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Casi todo lo demás es "truthy".`,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Lee un número entero. Si es par, imprime "par"; si es impar, imprime "impar".',
                starterCode:
                  "const numero = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);\n",
                difficulty: 2,
                testCases: [
                  { input: '4', expectedOutput: 'par', isHidden: false },
                  { input: '7', expectedOutput: 'impar', isHidden: false },
                  { input: '0', expectedOutput: 'par', isHidden: true },
                ],
              },
            ],
          },
          {
            title: 'Bucles',
            xpReward: 10,
            contentMarkdown: `# Bucles (for / while)

**\`for\`** clásico, con contador:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);   // imprime 0, 1, 2, 3, 4
}
\`\`\`

**\`for...of\`** recorre los elementos de un array directamente:

\`\`\`javascript
const frutas = ["manzana", "pera", "uva"];
for (const fruta of frutas) {
  console.log(fruta);
}
\`\`\`

**\`while\`** repite mientras una condición sea verdadera:

\`\`\`javascript
let contador = 0;
while (contador < 3) {
  console.log(contador);
  contador++;
}
\`\`\`

Cuidado con los bucles infinitos: si la condición nunca se vuelve falsa, el programa nunca termina.

\`break\` corta el bucle por completo; \`continue\` salta a la siguiente vuelta:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;            // se detiene en 5
  if (i % 2 === 0) continue;     // se salta los pares
  console.log(i);
}
\`\`\``,
          },
          {
            title: 'Funciones',
            xpReward: 10,
            contentMarkdown: `# Funciones

Hay varias formas de declarar una función en JavaScript:

\`\`\`javascript
function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}

const mensaje = saludar("Marta");
\`\`\`

**Arrow functions** (más comunes en código moderno), útiles para funciones cortas:

\`\`\`javascript
const saludar = (nombre) => \`Hola, \${nombre}!\`;

const sumar = (a, b) => {
  return a + b;
};
\`\`\`

\`return\` devuelve un valor y termina la función. Si no usas \`return\`, la función devuelve \`undefined\`.

**Parámetros con valor por defecto:**

\`\`\`javascript
function saludar(nombre, idioma = "es") {
  if (idioma === "es") return \`Hola, \${nombre}\`;
  return \`Hello, \${nombre}\`;
}

saludar("Ana");          // usa idioma = "es"
saludar("Ana", "en");    // usa idioma = "en"
\`\`\`

Las variables declaradas dentro de una función (con \`let\` o \`const\`) solo existen dentro de ella (**alcance local**).`,
            exercises: [
              {
                type: 'code',
                prompt:
                  'Define una función `esMayorDeEdad(edad)` que devuelva `true` si `edad` es mayor o igual a 18. Lee un número de la entrada estándar, pásalo a la función e imprime el resultado con `console.log`.',
                starterCode:
                  "function esMayorDeEdad(edad) {\n  // Escribe tu código aquí\n}\n\nconst edad = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);\nconsole.log(esMayorDeEdad(edad));\n",
                difficulty: 2,
                testCases: [
                  { input: '20', expectedOutput: 'true', isHidden: false },
                  { input: '15', expectedOutput: 'false', isHidden: false },
                  { input: '18', expectedOutput: 'true', isHidden: true },
                ],
              },
            ],
          },
          {
            title: 'Arrays',
            xpReward: 10,
            contentMarkdown: `# Arrays

Un array guarda varios valores en orden, y puede crecer o cambiar.

\`\`\`javascript
const numeros = [10, 20, 30];
const nombres = ["Ana", "Luis", "Eva"];
const mixto = [1, "dos", 3.0, true];
\`\`\`

**Acceso por índice** (empieza en 0):

\`\`\`javascript
numeros[0];    // 10
numeros[numeros.length - 1];   // 30 (el último elemento)
\`\`\`

**Operaciones comunes:**

\`\`\`javascript
numeros.push(40);          // agrega al final -> [10, 20, 30, 40]
numeros.pop();              // quita y devuelve el último elemento
numeros.length;              // cantidad de elementos
numeros.includes(30);        // true si 30 está en el array
\`\`\`

**\`slice(inicio, fin)\`** crea una sublista sin modificar el array original (excluye el índice final):

\`\`\`javascript
const letras = ["a", "b", "c", "d", "e"];
letras.slice(1, 3);   // ["b", "c"]
letras.slice(0, 2);   // ["a", "b"]
letras.slice(2);      // ["c", "d", "e"]
\`\`\`

**\`map\`** y **\`filter\`** crean arrays nuevos de forma compacta, sin bucles explícitos:

\`\`\`javascript
const cuadrados = [0, 1, 2, 3, 4].map((n) => n * n);          // [0, 1, 4, 9, 16]
const pares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n % 2 === 0);
\`\`\``,
          },
          {
            title: 'Objetos',
            xpReward: 10,
            contentMarkdown: `# Objetos

Un objeto guarda pares **clave: valor**, útil cuando quieres agrupar datos relacionados.

\`\`\`javascript
const persona = {
  nombre: "Carla",
  edad: 28,
  activo: true,
};
\`\`\`

**Acceso y modificación** (con punto o con corchetes):

\`\`\`javascript
persona.nombre;              // "Carla"
persona["edad"] = 29;        // modifica el valor
persona.ciudad = "Lima";     // agrega una propiedad nueva
\`\`\`

Acceder a una propiedad que no existe devuelve \`undefined\` en vez de dar error:

\`\`\`javascript
persona.telefono;   // undefined
\`\`\`

**Recorrer un objeto:**

\`\`\`javascript
for (const clave of Object.keys(persona)) {
  console.log(clave);
}

for (const [clave, valor] of Object.entries(persona)) {
  console.log(clave, valor);
}
\`\`\`

Puedes comprobar si una propiedad existe con \`in\`, y eliminarla con \`delete\`:

\`\`\`javascript
"nombre" in persona;   // true
delete persona.activo;
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    pathTitle: 'TypeScript para principiantes',
    pathDescription:
      'El mapa de temas está listo; las lecciones completas llegan en una fase posterior.',
    modules: [
      {
        title: 'Fundamentos',
        lessons: [
          {
            title: 'Variables y tipos explícitos',
            xpReward: 10,
            contentMarkdown: null,
          },
          {
            title: 'Tipos básicos y anotaciones',
            xpReward: 10,
            contentMarkdown: null,
          },
          { title: 'Condicionales', xpReward: 10, contentMarkdown: null },
          { title: 'Bucles', xpReward: 10, contentMarkdown: null },
          { title: 'Funciones tipadas', xpReward: 10, contentMarkdown: null },
          { title: 'Arrays tipados', xpReward: 10, contentMarkdown: null },
          {
            title: 'Interfaces y objetos',
            xpReward: 10,
            contentMarkdown: null,
          },
        ],
      },
    ],
  },
  {
    slug: 'cpp',
    name: 'C++',
    pathTitle: 'C++ para principiantes',
    pathDescription:
      'El mapa de temas está listo; las lecciones completas llegan en una fase posterior.',
    modules: [
      {
        title: 'Fundamentos',
        lessons: [
          { title: 'Variables y tipos', xpReward: 10, contentMarkdown: null },
          {
            title: 'Tipos de datos básicos',
            xpReward: 10,
            contentMarkdown: null,
          },
          { title: 'Condicionales', xpReward: 10, contentMarkdown: null },
          { title: 'Bucles', xpReward: 10, contentMarkdown: null },
          { title: 'Funciones', xpReward: 10, contentMarkdown: null },
          { title: 'Arrays y vectores', xpReward: 10, contentMarkdown: null },
          { title: 'Structs', xpReward: 10, contentMarkdown: null },
        ],
      },
    ],
  },
];

// Python's extra content lives in ./python/* to keep this file readable. It
// is only ever appended (extra exercises at the end of a lesson, new modules
// after "Fundamentos") because seed.ts matches rows by their order index, so
// reordering would overwrite rows users already have progress on.
export const curriculum: SeedLanguage[] = baseCurriculum.map((language) => {
  if (language.slug !== 'python') {
    return language;
  }
  return {
    ...language,
    modules: [
      {
        ...language.modules[0],
        lessons: language.modules[0].lessons.map((lesson) => ({
          ...lesson,
          exercises: [
            ...(lesson.exercises ?? []),
            ...(pythonExtraExercises[lesson.title] ?? []),
          ],
        })),
      },
      ...language.modules.slice(1),
      ...pythonExtraModules,
    ],
  };
});
