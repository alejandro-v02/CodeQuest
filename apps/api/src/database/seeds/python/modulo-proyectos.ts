import type { SeedModule } from '../curriculum.data';
import { md } from '../md';

export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    {
      title: 'Proyecto: calculadora',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: calculadora

Vas a construir una calculadora de consola **por etapas**, igual que se hace en un proyecto real: primero que funcione lo básico, después que sea robusta, al final que sea cómoda de usar.

## Etapa 1 — Una operación

La entrada es una línea con el formato §número operador número§, por ejemplo §10 / 4§. Para separarla:

§§§python
a, op, b = input().split() # "10 / 4" -> "10", "/", "4"
a = int(a)
b = int(b)
§§§

Luego decide qué hacer según §op§ con §if§ / §elif§.

## Etapa 2 — Casos especiales

Un buen programa piensa en lo que **puede salir mal**:

- Un operador que no existe (§%§, §x§…).
- Dividir entre cero.

## Etapa 3 — Muchas operaciones

Repite hasta que la persona escriba §salir§:

§§§python
while True:
linea = input()
if linea == "salir":
break # ... calcular e imprimir ...
§§§

## Etapa 4 — Acumular

Una calculadora real "recuerda" el resultado anterior. Empezarás con un número y le irás aplicando operaciones.

**Consejo:** mete la lógica de calcular en una **función** (§calcular(a, op, b)§) y reutilízala en cada etapa.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué valor guarda `partes`?',
          difficulty: 1,
          payload: {
            code: 'partes = "10 + 5".split()\nprint(partes)',
            options: [
              "['10 + 5']",
              "['10', '+', '5']",
              "['1', '0', '+', '5']",
              '10 + 5',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'code',
          prompt:
            'Etapa 1. Lee una línea `a op b` con enteros y uno de los operadores `+`, `-`, `*`, `/`. Imprime el resultado (en la división, redondeado a 2 decimales).',
          starterCode: 'a, op, b = input().split()\na = int(a)\nb = int(b)\n',
          solution:
            'a, op, b = input().split()\na = int(a)\nb = int(b)\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    print(round(a / b, 2))\n',
          difficulty: 2,
          testCases: [
            { input: '3 + 4', expectedOutput: '7', isHidden: false },
            { input: '10 - 15', expectedOutput: '-5', isHidden: false },
            { input: '6 * 7', expectedOutput: '42', isHidden: false },
            { input: '10 / 4', expectedOutput: '2.5', isHidden: true },
            { input: '9 / 3', expectedOutput: '3.0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 2. Igual que antes, pero: si el operador no es `+ - * /` imprime `operacion invalida`, y si divides entre cero imprime `no se puede dividir entre cero`.',
          starterCode: 'a, op, b = input().split()\na = int(a)\nb = int(b)\n',
          solution:
            'a, op, b = input().split()\na = int(a)\nb = int(b)\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    if b == 0:\n        print("no se puede dividir entre cero")\n    else:\n        print(round(a / b, 2))\nelse:\n    print("operacion invalida")\n',
          difficulty: 2,
          testCases: [
            { input: '2 + 2', expectedOutput: '4', isHidden: false },
            {
              input: '5 / 0',
              expectedOutput: 'no se puede dividir entre cero',
              isHidden: false,
            },
            {
              input: '5 % 2',
              expectedOutput: 'operacion invalida',
              isHidden: false,
            },
            { input: '8 / 2', expectedOutput: '4.0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 3. Define `calcular(a, op, b)` que devuelva el resultado (o el mensaje de error de la etapa 2). Lee líneas `a op b` hasta que llegue `salir` e imprime el resultado de cada una.',
          starterCode:
            'def calcular(a, op, b):\n    # Escribe tu código aquí\n    pass\n\nwhile True:\n    linea = input()\n    if linea == "salir":\n        break\n    a, op, b = linea.split()\n    print(calcular(int(a), op, int(b)))\n',
          solution:
            'def calcular(a, op, b):\n    if op == "+":\n        return a + b\n    if op == "-":\n        return a - b\n    if op == "*":\n        return a * b\n    if op == "/":\n        if b == 0:\n            return "no se puede dividir entre cero"\n        return round(a / b, 2)\n    return "operacion invalida"\n\nwhile True:\n    linea = input()\n    if linea == "salir":\n        break\n    a, op, b = linea.split()\n    print(calcular(int(a), op, int(b)))\n',
          difficulty: 3,
          testCases: [
            {
              input: '1 + 1\n2 * 3\nsalir',
              expectedOutput: '2\n6',
              isHidden: false,
            },
            {
              input: '4 / 0\n9 - 10\nsalir',
              expectedOutput: 'no se puede dividir entre cero\n-1',
              isHidden: false,
            },
            { input: 'salir', expectedOutput: '', isHidden: true },
            {
              input: '7 ^ 2\n8 / 2\nsalir',
              expectedOutput: 'operacion invalida\n4.0',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 4. La primera línea es un número inicial. Cada línea siguiente es `operador número` (`+`, `-` o `*`) y se aplica al resultado acumulado. Termina con `salir` e imprime el resultado final.',
          starterCode: 'total = int(input())\n',
          solution:
            'total = int(input())\nwhile True:\n    linea = input()\n    if linea == "salir":\n        break\n    op, n = linea.split()\n    n = int(n)\n    if op == "+":\n        total += n\n    elif op == "-":\n        total -= n\n    elif op == "*":\n        total *= n\nprint(total)\n',
          difficulty: 3,
          testCases: [
            {
              input: '10\n+ 5\n* 2\nsalir',
              expectedOutput: '30',
              isHidden: false,
            },
            { input: '5\n- 10\nsalir', expectedOutput: '-5', isHidden: false },
            { input: '3\nsalir', expectedOutput: '3', isHidden: true },
            {
              input: '2\n* 5\n* 5\n- 1\nsalir',
              expectedOutput: '49',
              isHidden: true,
            },
          ],
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas del bucle principal: repetir hasta que escriban `salir`.',
          difficulty: 2,
          payload: {
            blocks: [
              'while True:',
              '    linea = input()',
              '    if linea == "salir":',
              '        break',
              '    print(linea)',
            ],
          },
        },
      ],
    },
    {
      title: 'Proyecto: adivina el número',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: adivina el número

Un clásico: el programa guarda un número secreto y la persona intenta adivinarlo, recibiendo pistas.

Para que los ejercicios sean comprobables, el número secreto llega en la **primera línea de entrada** y los intentos en las siguientes.

## Etapa 1 — Un intento

Compara y da una pista:

§§§python
secreto = int(input())
intento = int(input())

if intento > secreto:
print("muy alto")
elif intento < secreto:
print("muy bajo")
else:
print("correcto")
§§§

## Etapa 2 — Repetir hasta acertar

Necesitas un bucle y un **contador de intentos**:

§§§python
intentos = 0
while True:
intento = int(input())
intentos += 1
if intento == secreto:
break # pista ...
§§§

Un detalle de lenguaje: "1 intento", pero "3 intentos". Un pequeño §if§ resuelve el plural.

## Etapa 3 — Un límite de intentos

Un juego sin final no es divertido. Con §for§ y §range()§ puedes limitar las vueltas, y §for ... else§ ejecuta el §else§ **solo si el bucle terminó sin §break§**:

§§§python
for numero_intento in range(1, 6):
...
if acierto:
break
else:
print("perdiste")
§§§

**Idea para ampliar:** que el programa elija el secreto con §random.randint(1, 100)§ (módulo §random§) para jugar tú mismo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Cuándo se ejecuta el `else` de un bucle `for`?',
          difficulty: 2,
          payload: {
            code: 'for i in range(3):\n    if i == 10:\n        break\nelse:\n    print("fin")',
            options: [
              'Nunca',
              'Siempre, después de cada vuelta',
              'Solo si el bucle terminó sin ejecutar break',
              'Solo si hubo un break',
            ],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa las pistas del juego.',
          difficulty: 1,
          payload: {
            template:
              'if intento {{0}} secreto:\n    print("muy alto")\n{{1}} intento < secreto:\n    print("muy bajo")\nelse:\n    print("correcto")',
            blanks: ['>', 'elif'],
          },
        },
        {
          type: 'code',
          prompt:
            'Etapa 1. Lee el número secreto y un intento (uno por línea). Imprime `muy alto`, `muy bajo` o `correcto`.',
          starterCode: 'secreto = int(input())\nintento = int(input())\n',
          solution:
            'secreto = int(input())\nintento = int(input())\nif intento > secreto:\n    print("muy alto")\nelif intento < secreto:\n    print("muy bajo")\nelse:\n    print("correcto")\n',
          difficulty: 1,
          testCases: [
            { input: '7\n9', expectedOutput: 'muy alto', isHidden: false },
            { input: '7\n3', expectedOutput: 'muy bajo', isHidden: false },
            { input: '7\n7', expectedOutput: 'correcto', isHidden: false },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 2. La primera línea es el secreto; las siguientes son intentos, hasta acertar. Por cada intento fallido imprime `muy alto` o `muy bajo`. Al acertar imprime `correcto en N intento` (o `intentos` si N es mayor que 1).',
          starterCode: 'secreto = int(input())\nintentos = 0\n',
          solution:
            'secreto = int(input())\nintentos = 0\nwhile True:\n    intento = int(input())\n    intentos += 1\n    if intento == secreto:\n        break\n    if intento > secreto:\n        print("muy alto")\n    else:\n        print("muy bajo")\npalabra = "intento" if intentos == 1 else "intentos"\nprint(f"correcto en {intentos} {palabra}")\n',
          difficulty: 3,
          testCases: [
            {
              input: '7\n3\n9\n7',
              expectedOutput: 'muy bajo\nmuy alto\ncorrecto en 3 intentos',
              isHidden: false,
            },
            {
              input: '5\n5',
              expectedOutput: 'correcto en 1 intento',
              isHidden: false,
            },
            {
              input: '10\n20\n15\n12\n10',
              expectedOutput:
                'muy alto\nmuy alto\nmuy alto\ncorrecto en 4 intentos',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 3. Igual que la etapa 2, pero hay un máximo de 5 intentos. Si aciertas imprime `correcto en N intento(s)` como antes; si fallas los 5, imprime `perdiste, era X` (con el secreto) y no leas más intentos.',
          starterCode: 'secreto = int(input())\n',
          solution:
            'secreto = int(input())\nfor numero in range(1, 6):\n    intento = int(input())\n    if intento == secreto:\n        palabra = "intento" if numero == 1 else "intentos"\n        print(f"correcto en {numero} {palabra}")\n        break\n    if intento > secreto:\n        print("muy alto")\n    else:\n        print("muy bajo")\nelse:\n    print(f"perdiste, era {secreto}")\n',
          difficulty: 3,
          testCases: [
            {
              input: '4\n1\n4',
              expectedOutput: 'muy bajo\ncorrecto en 2 intentos',
              isHidden: false,
            },
            {
              input: '4\n1\n2\n3\n5\n6',
              expectedOutput:
                'muy bajo\nmuy bajo\nmuy bajo\nmuy alto\nmuy alto\nperdiste, era 4',
              isHidden: false,
            },
            {
              input: '8\n8',
              expectedOutput: 'correcto en 1 intento',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Este bucle debería permitir 5 intentos, pero nunca termina. ¿Qué línea del bucle falla?',
          difficulty: 2,
          payload: {
            lines: [
              'intentos = 0',
              'while intentos < 5:',
              '    intento = int(input())',
              '    print("probaste", intento)',
            ],
            buggyLineIndex: 3,
            explanation:
              'Dentro del bucle falta aumentar el contador (`intentos += 1`); sin eso `intentos < 5` siempre es verdadero y el bucle no termina.',
          },
        },
      ],
    },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: notas de estudiantes

Un programa para el profesor: recibe las notas de un grupo y genera estadísticas.

**Formato de entrada:** la primera línea es la cantidad §n§ de estudiantes; después hay §n§ líneas con §nombre nota§ (la nota es un entero):

§§§text
3
Ana 80
Luis 90
Eva 70
§§§

## Leer los datos

Una buena estructura para guardar esto es una **lista de tuplas** o un **diccionario**:

§§§python
n = int(input())
estudiantes = []
for _ in range(n):
nombre, nota = input().split()
estudiantes.append((nombre, int(nota)))
§§§

Con §estudiantes§ en una lista de tuplas §(nombre, nota)§ puedes aplicar casi todo lo aprendido:

- **Promedio:** §sum(nota for _, nota in estudiantes) / n§
- **Mejor nota:** §max(estudiantes, key=lambda e: e[1])§
- **Ordenar:** §sorted(estudiantes, key=lambda e: (-e[1], e[0]))§ — por nota descendente y, en empate, por nombre.

## Pasos de la lección

1. Promedio del grupo.
2. Mejor estudiante.
3. Cuántos aprobaron (nota mínima 60).
4. Letra de cada estudiante (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F menos de 60).
5. Un ranking numerado.

Al terminar tendrás un programa que combina entrada, listas, tuplas, funciones y formato: justo lo que se pide en programas reales.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'notas = {"Ana": 90}\nnotas["Luis"] = 80\nprint(len(notas))',
            options: ['1', '2', '90', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Obtén el nombre con la nota más alta.',
          difficulty: 3,
          payload: {
            template:
              'notas = {"Ana": 90, "Luis": 80}\nmejor = max(notas, key=notas.{{0}})',
            blanks: ['get'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee `n` y luego `n` líneas `nombre nota`. Imprime el promedio de las notas redondeado a 2 decimales.',
          starterCode:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\n',
          solution:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\nprint(round(sum(nota for _, nota in estudiantes) / n, 2))\n',
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: '80.0',
              isHidden: false,
            },
            { input: '1\nSol 55', expectedOutput: '55.0', isHidden: false },
            { input: '2\nA 90\nB 85', expectedOutput: '87.5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato de entrada, imprime el estudiante con la nota más alta como `nombre nota`. Si hay empate, el que aparece primero.',
          starterCode:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\n',
          solution:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\nmejor = max(estudiantes, key=lambda e: e[1])\nprint(mejor[0], mejor[1])\n',
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: 'Luis 90',
              isHidden: false,
            },
            { input: '2\nA 50\nB 50', expectedOutput: 'A 50', isHidden: false },
            { input: '1\nSol 100', expectedOutput: 'Sol 100', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime `aprobados: X de N`, donde X es la cantidad de estudiantes con nota 60 o más.',
          starterCode:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\n',
          solution:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\naprobados = sum(1 for _, nota in estudiantes if nota >= 60)\nprint(f"aprobados: {aprobados} de {n}")\n',
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 59\nEva 60',
              expectedOutput: 'aprobados: 2 de 3',
              isHidden: false,
            },
            {
              input: '2\nA 10\nB 20',
              expectedOutput: 'aprobados: 0 de 2',
              isHidden: false,
            },
            {
              input: '1\nSol 100',
              expectedOutput: 'aprobados: 1 de 1',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime una línea `nombre: letra` por estudiante, en el orden de entrada. Letras: A (90 o más), B (80-89), C (70-79), D (60-69), F (menos de 60). Define una función `letra(nota)`.',
          starterCode:
            'def letra(nota):\n    # Escribe tu código aquí\n    pass\n\nn = int(input())\nfor _ in range(n):\n    nombre, nota = input().split()\n    print(f"{nombre}: {letra(int(nota))}")\n',
          solution:
            'def letra(nota):\n    if nota >= 90:\n        return "A"\n    if nota >= 80:\n        return "B"\n    if nota >= 70:\n        return "C"\n    if nota >= 60:\n        return "D"\n    return "F"\n\nn = int(input())\nfor _ in range(n):\n    nombre, nota = input().split()\n    print(f"{nombre}: {letra(int(nota))}")\n',
          difficulty: 3,
          testCases: [
            {
              input: '3\nAna 95\nLuis 82\nEva 55',
              expectedOutput: 'Ana: A\nLuis: B\nEva: F',
              isHidden: false,
            },
            {
              input: '2\nA 70\nB 60',
              expectedOutput: 'A: C\nB: D',
              isHidden: false,
            },
            {
              input: '2\nC 90\nD 79',
              expectedOutput: 'C: A\nD: C',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime un ranking numerado desde 1 con el formato `1. Ana 90`, ordenado por nota de mayor a menor. Si hay empate, por nombre en orden alfabético.',
          starterCode:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\n',
          solution:
            'n = int(input())\nestudiantes = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    estudiantes.append((nombre, int(nota)))\nranking = sorted(estudiantes, key=lambda e: (-e[1], e[0]))\nfor posicion, (nombre, nota) in enumerate(ranking, start=1):\n    print(f"{posicion}. {nombre} {nota}")\n',
          difficulty: 3,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: '1. Luis 90\n2. Ana 80\n3. Eva 70',
              isHidden: false,
            },
            {
              input: '3\nZoe 80\nAna 80\nMax 95',
              expectedOutput: '1. Max 95\n2. Ana 80\n3. Zoe 80',
              isHidden: false,
            },
            { input: '1\nSol 10', expectedOutput: '1. Sol 10', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Debería calcular el promedio, pero lanza un error al final. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'notas = [80, 90, 70]',
              'suma = 0',
              'for nota in notas:',
              '    suma += nota',
              'promedio = suma / len(nota)',
            ],
            buggyLineIndex: 4,
            explanation:
              '`len(nota)` usa la variable del bucle (un número), no la lista. Debe ser `len(notas)`.',
          },
        },
      ],
    },
    {
      title: 'Proyecto: contador de palabras',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: contador de palabras

Analizar texto es una de las tareas más comunes en programación: buscadores, redes sociales, estadísticas. Aquí construirás un contador de frecuencias de palabras con **diccionarios**.

## Limpiar el texto

Para que "Hola," y "hola" cuenten como la misma palabra hay que **normalizar**: pasar a minúsculas y quitar signos de puntuación.

§§§python
texto = input().lower()
for signo in ".,;:!?¿¡":
texto = texto.replace(signo, "")
palabras = texto.split()
§§§

## Contar con un diccionario

§§§python
conteo = {}
for palabra in palabras:
conteo[palabra] = conteo.get(palabra, 0) + 1
§§§

§conteo.get(palabra, 0)§ devuelve las veces que ya apareció (o 0 si es la primera). Sin el §get§, la primera vez daría §KeyError§.

## Ordenar los resultados

Los diccionarios guardan pares; para ordenarlos usa §.items()§ y una §key§:

§§§python

# por frecuencia descendente y, en empate, por orden alfabético

orden = sorted(conteo.items(), key=lambda par: (-par[1], par[0]))
§§§

Una tupla como clave ordena primero por el primer valor y desempata con el segundo. El signo menos invierte el orden numérico.

## Pasos de la lección

1. Total de palabras y palabras distintas.
2. Frecuencia de cada palabra, en orden alfabético.
3. La palabra más frecuente.
4. Las 3 palabras más frecuentes.
5. La palabra más larga.

**Ampliación:** lee un archivo de texto en vez de §input()§, ignora palabras muy comunes ("el", "de", "y") o muestra un gráfico de barras con asteriscos.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué hace `conteo.get(palabra, 0)`?',
          difficulty: 2,
          payload: {
            code: 'conteo = {"sol": 2}\nprint(conteo.get("sol", 0))\nprint(conteo.get("luna", 0))',
            options: [
              'Imprime 2 y luego lanza KeyError',
              'Imprime 2 y luego 0',
              'Imprime 0 y luego 0',
              'Imprime sol y luna',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Suma una aparición a la palabra, sin fallar la primera vez.',
          difficulty: 2,
          payload: {
            template: 'conteo[palabra] = conteo.{{0}}(palabra, 0) + {{1}}',
            blanks: ['get', '1'],
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que cuentan las palabras de una lista.',
          difficulty: 2,
          payload: {
            blocks: [
              'conteo = {}',
              'for palabra in palabras:',
              '    conteo[palabra] = conteo.get(palabra, 0) + 1',
              'print(conteo)',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de texto. Pásala a minúsculas, quita los signos `. , ; : ! ? ¿ ¡` y divídela en palabras. Imprime `total: N, distintas: M`.',
          starterCode:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\n',
          solution:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\nprint(f"total: {len(palabras)}, distintas: {len(set(palabras))}")\n',
          difficulty: 2,
          testCases: [
            {
              input: 'hola mundo hola',
              expectedOutput: 'total: 3, distintas: 2',
              isHidden: false,
            },
            {
              input: 'Hola, mundo. HOLA!',
              expectedOutput: 'total: 3, distintas: 2',
              isHidden: false,
            },
            {
              input: '¿Quién? Yo.',
              expectedOutput: 'total: 2, distintas: 2',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime una línea `palabra: veces` por cada palabra distinta, en orden alfabético.',
          starterCode:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\n',
          solution:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\nconteo = {}\nfor palabra in palabras:\n    conteo[palabra] = conteo.get(palabra, 0) + 1\nfor palabra in sorted(conteo):\n    print(f"{palabra}: {conteo[palabra]}")\n',
          difficulty: 3,
          testCases: [
            {
              input: 'el gato y el perro',
              expectedOutput: 'el: 2\ngato: 1\nperro: 1\ny: 1',
              isHidden: false,
            },
            {
              input: 'Sol, sol, SOL!',
              expectedOutput: 'sol: 3',
              isHidden: false,
            },
            { input: 'b a', expectedOutput: 'a: 1\nb: 1', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime la palabra más frecuente con el formato `palabra (veces)`. Si hay empate, la que va primero en orden alfabético.',
          starterCode:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\n',
          solution:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\nconteo = {}\nfor palabra in palabras:\n    conteo[palabra] = conteo.get(palabra, 0) + 1\nmejor = sorted(conteo.items(), key=lambda par: (-par[1], par[0]))[0]\nprint(f"{mejor[0]} ({mejor[1]})")\n',
          difficulty: 3,
          testCases: [
            { input: 'a b b a c', expectedOutput: 'a (2)', isHidden: false },
            {
              input: 'uno dos dos tres tres tres',
              expectedOutput: 'tres (3)',
              isHidden: false,
            },
            { input: 'solo', expectedOutput: 'solo (1)', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime las 3 palabras más frecuentes como `palabra: veces`, una por línea, ordenadas por frecuencia descendente y, en empate, alfabéticamente. Si hay menos de 3 palabras distintas, imprime las que haya.',
          starterCode:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\n',
          solution:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\nconteo = {}\nfor palabra in palabras:\n    conteo[palabra] = conteo.get(palabra, 0) + 1\ntop = sorted(conteo.items(), key=lambda par: (-par[1], par[0]))[:3]\nfor palabra, veces in top:\n    print(f"{palabra}: {veces}")\n',
          difficulty: 3,
          testCases: [
            {
              input: 'a b b c c c d',
              expectedOutput: 'c: 3\nb: 2\na: 1',
              isHidden: false,
            },
            { input: 'x x y', expectedOutput: 'x: 2\ny: 1', isHidden: false },
            {
              input: 'b a b a c',
              expectedOutput: 'a: 2\nb: 2\nc: 1',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime la palabra más larga como `palabra (longitud)`. Si hay empate, la que aparece primero.',
          starterCode:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\n',
          solution:
            'texto = input().lower()\nfor signo in ".,;:!?¿¡":\n    texto = texto.replace(signo, "")\npalabras = texto.split()\nlarga = max(palabras, key=len)\nprint(f"{larga} ({len(larga)})")\n',
          difficulty: 2,
          testCases: [
            {
              input: 'el programador escribe codigo',
              expectedOutput: 'programador (11)',
              isHidden: false,
            },
            { input: 'sol mar', expectedOutput: 'sol (3)', isHidden: false },
            {
              input: 'Hola, ¿qué tal?',
              expectedOutput: 'hola (4)',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Al contar palabras el programa lanza `KeyError`. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'palabras = ["a", "b", "a"]',
              'conteo = {}',
              'for palabra in palabras:',
              '    conteo[palabra] += 1',
              'print(conteo)',
            ],
            buggyLineIndex: 3,
            explanation:
              'La primera vez que aparece una palabra no existe como clave, así que `+= 1` lanza `KeyError`. Hay que usar `conteo[palabra] = conteo.get(palabra, 0) + 1`.',
          },
        },
      ],
    },
  ],
};
