import type { SeedModule } from '../curriculum.data';
import { md } from './md';

export const moduloEstructuras: SeedModule = {
  title: 'Estructuras de datos',
  lessons: [
    {
      title: 'Tuplas y desempaquetado',
      xpReward: 10,
      contentMarkdown: md`
# Tuplas y desempaquetado

Una **tupla** es como una lista, pero **inmutable**: una vez creada no se puede cambiar. Se escribe con paréntesis.

§§§python
punto = (3, 4)
colores = ("rojo", "verde", "azul")
print(punto[0])      # 3
print(len(colores))  # 3
§§§

Una tupla de un solo elemento lleva coma: §(5,)§. Sin la coma, §(5)§ es solo el número 5.

## ¿Para qué sirven?

Para agrupar valores que **van juntos** y no deben cambiar: unas coordenadas, un día y mes, un nombre y su edad.

## Desempaquetado

Puedes repartir los valores de una tupla en variables de un solo paso:

§§§python
x, y = (3, 4)
print(x)   # 3
print(y)   # 4
§§§

Funciona con cualquier secuencia, y es la forma elegante de **intercambiar** dos variables:

§§§python
a, b = 1, 2
a, b = b, a
print(a, b)   # 2 1
§§§

## Funciones que devuelven varios valores

§§§python
def min_y_max(a, b, c):
    return min(a, b, c), max(a, b, c)    # devuelve una tupla

menor, mayor = min_y_max(5, 2, 9)
§§§

## Son inmutables

§§§python
punto = (3, 4)
punto[0] = 10   # TypeError: 'tuple' object does not support item assignment
§§§`,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 't = (10, 20, 30)\nprint(t[1])',
            options: ['10', '20', '30', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'a, b = 1, 2\na, b = b, a\nprint(a, b)',
            options: ['1 2', '2 1', '2 2', '1 1'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Desempaqueta la tupla en dos variables y súmalas.',
          difficulty: 1,
          payload: {
            template: 'punto = (3, 4)\n{{0}}, y = punto\nprint(x + {{1}})',
            blanks: ['x', 'y'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros (uno por línea) e imprímelos intercambiados, separados por un espacio. Usa desempaquetado.',
          starterCode: 'a = int(input())\nb = int(input())\n',
          solution: 'a = int(input())\nb = int(input())\na, b = b, a\nprint(a, b)\n',
          difficulty: 1,
          testCases: [
            { input: '3\n7', expectedOutput: '7 3', isHidden: false },
            { input: '-1\n0', expectedOutput: '0 -1', isHidden: false },
            { input: '5\n5', expectedOutput: '5 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `min_y_max(a, b, c)` que devuelva una tupla con el menor y el mayor. Lee tres enteros (uno por línea) e imprime `menor mayor` separados por un espacio.',
          starterCode:
            'def min_y_max(a, b, c):\n    # Escribe tu código aquí\n    pass\n\na = int(input())\nb = int(input())\nc = int(input())\nmenor, mayor = min_y_max(a, b, c)\nprint(menor, mayor)\n',
          solution:
            'def min_y_max(a, b, c):\n    return min(a, b, c), max(a, b, c)\n\na = int(input())\nb = int(input())\nc = int(input())\nmenor, mayor = min_y_max(a, b, c)\nprint(menor, mayor)\n',
          difficulty: 2,
          testCases: [
            { input: '5\n2\n9', expectedOutput: '2 9', isHidden: false },
            { input: '-4\n-9\n0', expectedOutput: '-9 0', isHidden: false },
            { input: '3\n3\n3', expectedOutput: '3 3', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee las coordenadas `x y` de un punto en una sola línea (dos enteros separados por espacio) e imprime `x^2 + y^2` (es decir, `x * x + y * y`).',
          starterCode: 'x, y = [int(v) for v in input().split()]\n',
          solution: 'x, y = [int(v) for v in input().split()]\nprint(x * x + y * y)\n',
          difficulty: 2,
          testCases: [
            { input: '3 4', expectedOutput: '25', isHidden: false },
            { input: '0 5', expectedOutput: '25', isHidden: false },
            { input: '-2 -2', expectedOutput: '8', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt: 'Se quiere cambiar la primera coordenada del punto, pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: ['punto = (3, 4)', 'punto[0] = 10', 'print(punto)'],
            buggyLineIndex: 1,
            explanation:
              'Las tuplas son inmutables: no admiten asignación por índice (TypeError). Hay que crear una nueva: `punto = (10, punto[1])`.',
          },
        },
      ],
    },
    {
      title: 'Conjuntos',
      xpReward: 10,
      contentMarkdown: md`
# Conjuntos (set)

Un **conjunto** guarda elementos **sin repetir y sin orden**. Se escribe con llaves:

§§§python
colores = {"rojo", "verde", "azul"}
numeros = {1, 2, 2, 3, 3, 3}
print(numeros)   # {1, 2, 3}  (los repetidos desaparecen)
§§§

Para un conjunto vacío usa §set()§ (porque §{}§ crea un diccionario).

## Quitar repetidos de una lista

§§§python
lista = [1, 2, 2, 3, 3, 3]
unicos = set(lista)      # {1, 2, 3}
len(unicos)              # 3
§§§

## Operaciones

§§§python
colores.add("amarillo")      # agrega
colores.discard("rojo")      # quita (sin error si no existe)
"verde" in colores           # True — muy rápido
§§§

## Teoría de conjuntos

§§§python
a = {1, 2, 3}
b = {2, 3, 4}
a | b    # unión:        {1, 2, 3, 4}
a & b    # intersección: {2, 3}
a - b    # diferencia:   {1}
§§§

## Qué no puedes hacer

No tienen orden, así que **no hay índices**: §colores[0]§ es un error. Si necesitas el orden, conviértelo: §sorted(colores)§ devuelve una lista ordenada.`,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(len(set([1, 2, 2, 3, 3, 3])))',
            options: ['6', '3', '2', '1'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print({1, 2, 3} & {2, 3, 4})',
            options: ['{1, 2, 3, 4}', '{2, 3}', '{1}', '{4}'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Calcula la unión y la intersección de los conjuntos.',
          difficulty: 2,
          payload: {
            template: 'a = {1, 2}\nb = {2, 3}\nprint(a {{0}} b)   # {1, 2, 3}\nprint(a {{1}} b)   # {2}',
            blanks: ['|', '&'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprime cuántos valores **distintos** hay.',
          starterCode: 'numeros = input().split()\n',
          solution: 'numeros = input().split()\nprint(len(set(numeros)))\n',
          difficulty: 1,
          testCases: [
            { input: '1 2 2 3 3 3', expectedOutput: '3', isHidden: false },
            { input: '5 5 5', expectedOutput: '1', isHidden: false },
            { input: '1 2 3 4', expectedOutput: '4', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos líneas de enteros separados por espacios. Imprime, ordenados de menor a mayor y separados por un espacio, los números que aparecen en **ambas** líneas. Si no hay ninguno, imprime `ninguno`.',
          starterCode:
            'a = {int(x) for x in input().split()}\nb = {int(x) for x in input().split()}\n',
          solution:
            'a = {int(x) for x in input().split()}\nb = {int(x) for x in input().split()}\ncomunes = sorted(a & b)\nif comunes:\n    print(" ".join(str(n) for n in comunes))\nelse:\n    print("ninguno")\n',
          difficulty: 3,
          testCases: [
            { input: '1 2 3 4\n3 4 5 6', expectedOutput: '3 4', isHidden: false },
            { input: '1 2\n3 4', expectedOutput: 'ninguno', isHidden: false },
            { input: '5 5 1\n1 5 9', expectedOutput: '1 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime `unicas` si todas sus letras son distintas, o `repetidas` si alguna letra aparece más de una vez.',
          starterCode: 'palabra = input()\n',
          solution:
            'palabra = input()\nif len(set(palabra)) == len(palabra):\n    print("unicas")\nelse:\n    print("repetidas")\n',
          difficulty: 2,
          testCases: [
            { input: 'python', expectedOutput: 'unicas', isHidden: false },
            { input: 'hola mundo', expectedOutput: 'repetidas', isHidden: false },
            { input: 'sol', expectedOutput: 'unicas', isHidden: true },
            { input: 'casa', expectedOutput: 'repetidas', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt: 'El programa intenta leer el primer elemento del conjunto y falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: ['numeros = {10, 20, 30}', 'print(numeros[0])'],
            buggyLineIndex: 1,
            explanation:
              'Los conjuntos no tienen orden ni índices (TypeError). Para recorrerlos usa `for n in numeros`, o conviértelos con `sorted(numeros)`.',
          },
        },
      ],
    },
    {
      title: 'Recorrer y ordenar colecciones',
      xpReward: 10,
      contentMarkdown: md`
# Recorrer y ordenar colecciones

Python trae funciones muy útiles para trabajar con listas, tuplas, conjuntos y cualquier secuencia.

## Resumir valores

§§§python
numeros = [4, 9, 1, 7]
min(numeros)   # 1
max(numeros)   # 9
sum(numeros)   # 21
len(numeros)   # 4
§§§

## Ordenar con §sorted()§

§§§python
sorted(numeros)                  # [1, 4, 7, 9]
sorted(numeros, reverse=True)    # [9, 7, 4, 1]
sorted(["pera", "uva", "kiwi"])  # ["kiwi", "pera", "uva"]
§§§

§sorted()§ devuelve una lista **nueva**. El método §lista.sort()§ ordena la lista **en el sitio** y devuelve §None§.

## Recorrer con posición: §enumerate()§

§§§python
frutas = ["pera", "uva", "kiwi"]
for i, fruta in enumerate(frutas):
    print(i, fruta)        # 0 pera / 1 uva / 2 kiwi

for i, fruta in enumerate(frutas, start=1):
    print(f"{i}. {fruta}")   # empieza a contar en 1
§§§

## Recorrer dos listas a la vez: §zip()§

§§§python
nombres = ["Ana", "Luis"]
notas = [90, 75]
for nombre, nota in zip(nombres, notas):
    print(nombre, nota)
§§§

## Preguntar por toda la colección

§§§python
any(n < 0 for n in numeros)   # ¿hay algún negativo?
all(n > 0 for n in numeros)   # ¿todos son positivos?
§§§`,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(sorted([3, 1, 2], reverse=True))',
            options: ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', 'None'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print(list(zip([1, 2], ["a", "b"])))',
            options: [
              "[(1, 'a'), (2, 'b')]",
              "[1, 2, 'a', 'b']",
              "[(1, 2), ('a', 'b')]",
              'Error',
            ],
            correctIndex: 0,
          },
        },
        {
          type: 'fill',
          prompt: 'Recorre la lista con su posición y ordénala.',
          difficulty: 2,
          payload: {
            template:
              'for i, x in {{0}}(["a", "b"]):\n    print(i, x)\nprint({{1}}([3, 1, 2]))',
            blanks: ['enumerate', 'sorted'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprime el mayor, el menor y la suma, separados por un espacio.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\nprint(max(numeros), min(numeros), sum(numeros))\n',
          difficulty: 1,
          testCases: [
            { input: '3 1 5 4', expectedOutput: '5 1 13', isHidden: false },
            { input: '7', expectedOutput: '7 7 7', isHidden: false },
            { input: '-2 -8 0', expectedOutput: '0 -8 -10', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprímelos ordenados de mayor a menor, separados por un espacio.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\nprint(" ".join(str(n) for n in sorted(numeros, reverse=True)))\n',
          difficulty: 2,
          testCases: [
            { input: '3 1 2', expectedOutput: '3 2 1', isHidden: false },
            { input: '10 -5 7 7', expectedOutput: '10 7 7 -5', isHidden: false },
            { input: '4', expectedOutput: '4', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea con nombres separados por espacios e imprime una lista numerada desde 1, un nombre por línea, con el formato `1. Ana`.',
          starterCode: 'nombres = input().split()\n',
          solution:
            'nombres = input().split()\nfor i, nombre in enumerate(nombres, start=1):\n    print(f"{i}. {nombre}")\n',
          difficulty: 2,
          testCases: [
            { input: 'Ana Luis Eva', expectedOutput: '1. Ana\n2. Luis\n3. Eva', isHidden: false },
            { input: 'Sofía', expectedOutput: '1. Sofía', isHidden: false },
            { input: 'a b', expectedOutput: '1. a\n2. b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios. Imprime `si` si alguno es negativo, o `no` si ninguno lo es.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\nprint("si" if any(n < 0 for n in numeros) else "no")\n',
          difficulty: 2,
          testCases: [
            { input: '1 2 -3 4', expectedOutput: 'si', isHidden: false },
            { input: '1 2 3', expectedOutput: 'no', isHidden: false },
            { input: '0 0', expectedOutput: 'no', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt: 'Se quiere recorrer la lista con su posición, pero el bucle falla. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: ['numeros = [10, 20, 30]', 'for i, n in numeros:', '    print(i, n)'],
            buggyLineIndex: 1,
            explanation:
              'Recorrer la lista directamente entrega un solo valor por vuelta, no dos. Para obtener índice y valor hay que usar `enumerate(numeros)`.',
          },
        },
      ],
    },
    {
      title: 'Listas anidadas y comprensiones',
      xpReward: 15,
      contentMarkdown: md`
# Listas anidadas y comprensiones

## Listas dentro de listas

Una lista puede contener otras listas. Es la forma habitual de representar una **tabla** o **matriz**:

§§§python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print(matriz[1][2])   # 6  (fila 1, columna 2)
§§§

Para recorrerla se anidan dos bucles:

§§§python
for fila in matriz:
    for valor in fila:
        print(valor, end=" ")
    print()   # salto de línea al terminar cada fila
§§§

## Comprensiones de lista

Una forma compacta de crear listas a partir de otra secuencia:

§§§python
[n * 2 for n in range(4)]          # [0, 2, 4, 6]
[n for n in range(10) if n % 2 == 0]   # [0, 2, 4, 6, 8]
[letra.upper() for letra in "hola"]    # ["H", "O", "L", "A"]
§§§

Estructura: §[expresión for variable in secuencia if condición]§, y el §if§ es opcional.

## Aplanar una matriz

§§§python
plana = [valor for fila in matriz for valor in fila]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
§§§

## Cuidado al copiar

§§§python
a = [[0] * 2] * 2      # ¡las dos filas son LA MISMA lista!
a[0][0] = 1
print(a)               # [[1, 0], [1, 0]]
b = [[0] * 2 for _ in range(2)]   # forma correcta: filas independientes
§§§`,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'm = [[1, 2], [3, 4]]\nprint(m[1][0])',
            options: ['1', '2', '3', '4'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print([n * 2 for n in range(4)])',
            options: ['[0, 1, 2, 3]', '[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 2, 4]'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa las comprensiones: cuadrados y solo los pares.',
          difficulty: 2,
          payload: {
            template:
              'cuadrados = [n {{0}} 2 for n in range(5)]\npares = [n for n in range(10) {{1}} n % 2 == 0]',
            blanks: ['**', 'if'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un entero `n` (de 1 a 9) e imprime su tabla de multiplicar del 1 al 10, una línea por producto, con el formato `3 x 2 = 6`.',
          starterCode: 'n = int(input())\n',
          solution:
            'n = int(input())\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")\n',
          difficulty: 1,
          testCases: [
            {
              input: '3',
              expectedOutput:
                '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
              isHidden: false,
            },
            {
              input: '1',
              expectedOutput:
                '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10',
              isHidden: false,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una matriz de 3 filas (cada fila son 3 enteros separados por espacios, una fila por línea) e imprime la suma de su diagonal principal (posiciones [0][0], [1][1] y [2][2]).',
          starterCode: 'matriz = [[int(x) for x in input().split()] for _ in range(3)]\n',
          solution:
            'matriz = [[int(x) for x in input().split()] for _ in range(3)]\nprint(sum(matriz[i][i] for i in range(3)))\n',
          difficulty: 3,
          testCases: [
            { input: '1 2 3\n4 5 6\n7 8 9', expectedOutput: '15', isHidden: false },
            { input: '1 0 0\n0 1 0\n0 0 1', expectedOutput: '3', isHidden: false },
            { input: '5 5 5\n5 -1 5\n5 5 2', expectedOutput: '6', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime, separados por un espacio, el cuadrado de cada número **impar**. Si no hay impares, imprime `ninguno`. Usa una comprensión de lista.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\ncuadrados = [n * n for n in numeros if n % 2 == 1]\nif cuadrados:\n    print(" ".join(str(c) for c in cuadrados))\nelse:\n    print("ninguno")\n',
          difficulty: 3,
          testCases: [
            { input: '1 2 3 4 5', expectedOutput: '1 9 25', isHidden: false },
            { input: '2 4 6', expectedOutput: 'ninguno', isHidden: false },
            { input: '7', expectedOutput: '49', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un entero `n` e imprime un triángulo de `n` filas hecho de asteriscos: la fila 1 tiene 1 `*`, la fila 2 tiene 2, y así hasta `n`.',
          starterCode: 'n = int(input())\n',
          solution: 'n = int(input())\nfor fila in range(1, n + 1):\n    print("*" * fila)\n',
          difficulty: 2,
          testCases: [
            { input: '3', expectedOutput: '*\n**\n***', isHidden: false },
            { input: '1', expectedOutput: '*', isHidden: false },
            { input: '5', expectedOutput: '*\n**\n***\n****\n*****', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt: 'La matriz tiene 2 filas, pero el programa falla al leer la última. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'matriz = [[1, 2], [3, 4]]',
              'print(matriz[0][0])',
              'print(matriz[2][0])',
            ],
            buggyLineIndex: 2,
            explanation:
              'Hay dos filas, con índices 0 y 1. `matriz[2]` no existe y lanza `IndexError`; la última fila es `matriz[1]` o `matriz[-1]`.',
          },
        },
      ],
    },
  ],
};
