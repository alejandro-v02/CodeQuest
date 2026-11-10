import type { SeedModule } from '../curriculum.data';
import { md } from './md';

export const moduloCadenas: SeedModule = {
  title: 'Cadenas de texto',
  lessons: [
    {
      title: 'Operaciones con strings',
      xpReward: 10,
      contentMarkdown: md`
# Operaciones con strings

Un **string** (§str§) es una secuencia de caracteres entre comillas simples o dobles.

§§§python
saludo = "Hola"
otro = 'mundo'
§§§

## Operaciones básicas

§§§python
len("hola mundo") # 10 (cuenta también el espacio)
"Hola" + " " + "mundo" # "Hola mundo" (concatenar)
"ja" * 3 # "jajaja" (repetir)
"a" in "casa" # True (contiene)
§§§

## Mayúsculas, minúsculas y espacios

§§§python
nombre = " Ana María "
nombre.upper() # " ANA MARÍA "
nombre.lower() # " ana maría "
nombre.strip() # "Ana María" (quita espacios de los extremos)
§§§

Los métodos **no modifican** el string original: devuelven uno nuevo. Hay que guardar el resultado:

§§§python
nombre = nombre.strip()
§§§

## Los strings son inmutables

No puedes cambiar un carácter "en el sitio":

§§§python
palabra = "casa"
palabra[0] = "m" # TypeError
palabra = "m" + palabra[1:] # forma correcta: crear uno nuevo
§§§

## Comparar

§"a" == "a"§ es §True§. Python distingue mayúsculas: §"Hola" == "hola"§ es §False§. Para comparar sin importar mayúsculas, pasa ambos a §.lower()§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(len("hola mundo"))',
            options: ['9', '10', '11', '2'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print("ab" * 3)',
            options: ['ab3', 'ababab', 'aaabbb', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Pasa el texto a mayúsculas.',
          difficulty: 1,
          payload: {
            template: 'print("hola".{{0}}())',
            blanks: ['upper'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime su longitud y la palabra en mayúsculas, separadas por un espacio.',
          starterCode: 'palabra = input()\n',
          solution: 'palabra = input()\nprint(len(palabra), palabra.upper())\n',
          difficulty: 1,
          testCases: [
            { input: 'hola', expectedOutput: '4 HOLA', isHidden: false },
            { input: 'python', expectedOutput: '6 PYTHON', isHidden: false },
            { input: 'a', expectedOutput: '1 A', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra y un número entero `n` (uno por línea) e imprime la palabra repetida `n` veces, sin separadores.',
          starterCode: 'palabra = input()\nn = int(input())\n',
          solution: 'palabra = input()\nn = int(input())\nprint(palabra * n)\n',
          difficulty: 1,
          testCases: [
            { input: 'ja\n3', expectedOutput: 'jajaja', isHidden: false },
            { input: 'ho\n2', expectedOutput: 'hoho', isHidden: false },
            { input: 'x\n5', expectedOutput: 'xxxxx', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos palabras (una por línea) e imprime `iguales` si son la misma sin importar mayúsculas o minúsculas, o `distintas` si no.',
          starterCode: 'a = input()\nb = input()\n',
          solution:
            'a = input()\nb = input()\nif a.lower() == b.lower():\n    print("iguales")\nelse:\n    print("distintas")\n',
          difficulty: 2,
          testCases: [
            { input: 'Hola\nhOLA', expectedOutput: 'iguales', isHidden: false },
            {
              input: 'casa\ncasas',
              expectedOutput: 'distintas',
              isHidden: false,
            },
            {
              input: 'PYTHON\npython',
              expectedOutput: 'iguales',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere cambiar la primera letra de "Ana" por "E", pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: ['nombre = "Ana"', 'nombre[0] = "E"', 'print(nombre)'],
            buggyLineIndex: 1,
            explanation:
              'Los strings son inmutables: no se puede asignar a una posición (TypeError). Hay que crear uno nuevo, por ejemplo `nombre = "E" + nombre[1:]`.',
          },
        },
      ],
    },
    {
      title: 'Indexación y slicing de strings',
      xpReward: 10,
      contentMarkdown: md`
# Indexación y slicing de strings

Cada carácter de un string tiene una **posición** (índice). Se empieza a contar en **0**:

| P   | y   | t   | h   | o   | n   |
| --- | --- | --- | --- | --- | --- |
| 0   | 1   | 2   | 3   | 4   | 5   |
| -6  | -5  | -4  | -3  | -2  | -1  |

§§§python
palabra = "Python"
palabra[0] # "P"
palabra[5] # "n"
palabra[-1] # "n" (el último)
palabra[6] # IndexError: no existe esa posición
§§§

## Slicing: tomar un trozo

§texto[inicio:fin]§ incluye §inicio§ y **excluye** §fin§:

§§§python
palabra[1:4] # "yth"
palabra[:2] # "Py" (desde el principio)
palabra[3:] # "hon" (hasta el final)
palabra[-3:] # "hon" (últimos tres)
§§§

## Paso (step)

§texto[inicio:fin:paso]§:

§§§python
palabra[::2] # "Pto" (de dos en dos)
palabra[::-1] # "nohtyP" (al revés)
§§§

## Recorrer con índices

§§§python
for i in range(len(palabra)):
print(i, palabra[i])
§§§

o directamente por letra:

§§§python
for letra in palabra:
print(letra)
§§§
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print("python"[1:4])',
            options: ['pyt', 'yth', 'ytho', 'tho'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print("python"[::-1])',
            options: ['python', 'nohtyp', 'pytho', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Obtén la última letra y el texto al revés.',
          difficulty: 2,
          payload: {
            template:
              'palabra = "hola"\nprint(palabra[{{0}}])     # a\nprint(palabra[::{{1}}])    # aloh',
            blanks: ['-1', '-1'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime su primera y su última letra juntas.',
          starterCode: 'palabra = input()\n',
          solution: 'palabra = input()\nprint(palabra[0] + palabra[-1])\n',
          difficulty: 1,
          testCases: [
            { input: 'hola', expectedOutput: 'ha', isHidden: false },
            { input: 'python', expectedOutput: 'pn', isHidden: false },
            { input: 'ab', expectedOutput: 'ab', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt: 'Lee un texto e imprímelo al revés.',
          starterCode: 'texto = input()\n',
          solution: 'texto = input()\nprint(texto[::-1])\n',
          difficulty: 2,
          testCases: [
            { input: 'hola', expectedOutput: 'aloh', isHidden: false },
            { input: 'abc def', expectedOutput: 'fed cba', isHidden: false },
            { input: 'a', expectedOutput: 'a', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra (en minúsculas, sin espacios) e imprime `palindromo` si se lee igual al derecho y al revés, o `no palindromo` si no.',
          starterCode: 'palabra = input()\n',
          solution:
            'palabra = input()\nif palabra == palabra[::-1]:\n    print("palindromo")\nelse:\n    print("no palindromo")\n',
          difficulty: 3,
          testCases: [
            {
              input: 'reconocer',
              expectedOutput: 'palindromo',
              isHidden: false,
            },
            {
              input: 'python',
              expectedOutput: 'no palindromo',
              isHidden: false,
            },
            { input: 'oso', expectedOutput: 'palindromo', isHidden: true },
            { input: 'ab', expectedOutput: 'no palindromo', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime sus primeras 3 letras en mayúsculas (o todas, si tiene menos de 3).',
          starterCode: 'palabra = input()\n',
          solution: 'palabra = input()\nprint(palabra[:3].upper())\n',
          difficulty: 2,
          testCases: [
            { input: 'programa', expectedOutput: 'PRO', isHidden: false },
            { input: 'ab', expectedOutput: 'AB', isHidden: false },
            { input: 'sol', expectedOutput: 'SOL', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            '"hola" tiene 4 letras, pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'palabra = "hola"',
              'print(palabra[0])',
              'print(palabra[4])',
            ],
            buggyLineIndex: 2,
            explanation:
              'Los índices válidos van de 0 a 3. `palabra[4]` lanza `IndexError`; la última letra es `palabra[3]` o `palabra[-1]`.',
          },
        },
      ],
    },
    {
      title: 'Métodos de texto',
      xpReward: 10,
      contentMarkdown: md`
# Métodos de texto

Los strings traen muchos métodos listos para usar.

## Dividir y unir

§§§python
"a,b,c".split(",") # ["a", "b", "c"]
"hola mundo".split() # ["hola", "mundo"] (separa por espacios)
"-".join(["x", "y", "z"]) # "x-y-z"
§§§

§split()§ devuelve una **lista**; §join()§ hace lo contrario.

## Buscar y reemplazar

§§§python
frase = "banana"
frase.replace("a", "o") # "bonono"
frase.count("a") # 3
frase.find("n") # 2 (posición; -1 si no existe)
frase.startswith("ba") # True
frase.endswith("na") # True
§§§

## Comprobar el contenido

§§§python
"123".isdigit() # True
"12a".isdigit() # False
"hola".isalpha() # True
"hola mundo".title() # "Hola Mundo"
"hola".capitalize() # "Hola"
§§§

## Encadenar métodos

§§§python
entrada = " JUAN "
limpio = entrada.strip().lower().capitalize() # "Juan"
§§§

Recuerda: cada método devuelve un string nuevo; el original no cambia.

**Error típico:** llamar §"a-b-c".split()§ sin separador cuando el texto no tiene espacios: devuelve la lista con un solo elemento.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print("a,b,c".split(","))',
            options: ['a,b,c', "['a', 'b', 'c']", "['a,b,c']", 'abc'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print("-".join(["x", "y"]))',
            options: ['xy', 'x-y', "['x', 'y']", '-xy-'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Cuenta las "a" de banana y comprueba si "hola" empieza por "h".',
          difficulty: 2,
          payload: {
            template: 'print("banana".{{0}}("a"))\nprint("hola".{{1}}("h"))',
            blanks: ['count', 'startswith'],
          },
        },
        {
          type: 'code',
          prompt: 'Lee una frase e imprime cuántas palabras tiene.',
          starterCode: 'frase = input()\n',
          solution: 'frase = input()\nprint(len(frase.split()))\n',
          difficulty: 1,
          testCases: [
            { input: 'hola mundo cruel', expectedOutput: '3', isHidden: false },
            { input: 'uno', expectedOutput: '1', isHidden: false },
            { input: 'a b c d e', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase e imprímela reemplazando los espacios por guiones bajos.',
          starterCode: 'frase = input()\n',
          solution: 'frase = input()\nprint(frase.replace(" ", "_"))\n',
          difficulty: 1,
          testCases: [
            {
              input: 'mi nombre es Ana',
              expectedOutput: 'mi_nombre_es_Ana',
              isHidden: false,
            },
            { input: 'hola', expectedOutput: 'hola', isHidden: false },
            { input: 'a b', expectedOutput: 'a_b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase e imprime cada palabra con la primera letra en mayúscula.',
          starterCode: 'frase = input()\n',
          solution: 'frase = input()\nprint(frase.title())\n',
          difficulty: 2,
          testCases: [
            {
              input: 'hola mundo',
              expectedOutput: 'Hola Mundo',
              isHidden: false,
            },
            {
              input: 'python es genial',
              expectedOutput: 'Python Es Genial',
              isHidden: false,
            },
            { input: 'sol', expectedOutput: 'Sol', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un correo e imprime `valido` si contiene `@` y termina en `.com`; en caso contrario `invalido`.',
          starterCode: 'correo = input()\n',
          solution:
            'correo = input()\nif "@" in correo and correo.endswith(".com"):\n    print("valido")\nelse:\n    print("invalido")\n',
          difficulty: 2,
          testCases: [
            {
              input: 'ana@correo.com',
              expectedOutput: 'valido',
              isHidden: false,
            },
            {
              input: 'ana.correo.com',
              expectedOutput: 'invalido',
              isHidden: false,
            },
            {
              input: 'ana@correo.org',
              expectedOutput: 'invalido',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere imprimir la segunda parte ("b"), pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'texto = "a-b-c"',
              'partes = texto.split()',
              'print(partes[1])',
            ],
            buggyLineIndex: 1,
            explanation:
              'Sin argumento, `split()` separa por espacios; como el texto no tiene, devuelve `["a-b-c"]` y `partes[1]` falla. Hay que indicar el separador: `texto.split("-")`.',
          },
        },
      ],
    },
    {
      title: 'Formato con f-strings',
      xpReward: 10,
      contentMarkdown: md`
# Formato con f-strings

Un **f-string** lleva una §f§ antes de las comillas y permite insertar variables y expresiones entre llaves:

§§§python
nombre = "Ana"
edad = 20
print(f"{nombre} tiene {edad} años")
print(f"El año que viene tendrá {edad + 1}")
§§§

Sin la §f§ las llaves se imprimen tal cual: §"{nombre}"§ muestra literalmente §{nombre}§.

## Controlar el formato

Después de dos puntos puedes indicar cómo mostrar el valor:

| Formato | Ejemplo            | Resultado   |
| ------- | ------------------ | ----------- |
| §:.2f§  | §f"{3.14159:.2f}"§ | §3.14§      |
| §:.1%§  | §f"{0.256:.1%}"§   | §25.6%§     |
| §:,§    | §f"{1234567:,}"§   | §1,234,567§ |
| §:05d§  | §f"{42:05d}"§      | §00042§     |

## Alinear en columnas

§§§python
print(f"{'Ana':<10}{42:>5}") # texto a la izquierda (10), número a la derecha (5)
print(f"{'Luis':^10}") # centrado en 10
§§§

- §<§ izquierda, §>§ derecha, §^§ centro.
- El número es el **ancho** mínimo de la columna.

## Cuándo usarlos

Casi siempre que mezcles texto con valores. Son más legibles que concatenar con §+§ y no exigen convertir los números con §str()§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'x = 2\nprint(f"{x + 3}")',
            options: ['{x + 3}', '5', '2 + 3', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print(f"{3.14159:.2f}")',
            options: ['3', '3.1', '3.14', '3.14159'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt:
            'Completa el f-string y el método para mostrar el nombre en mayúsculas.',
          difficulty: 2,
          payload: {
            template:
              'nombre = "Ana"\nprint({{0}}"Hola, {nombre}")\nprint(f"{nombre.{{1}}()}")',
            blanks: ['f', 'upper'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un precio (decimal) e imprime `Total: $X` con exactamente 2 decimales.',
          starterCode: 'precio = float(input())\n',
          solution: 'precio = float(input())\nprint(f"Total: ${precio:.2f}")\n',
          difficulty: 2,
          testCases: [
            { input: '9.5', expectedOutput: 'Total: $9.50', isHidden: false },
            { input: '10', expectedOutput: 'Total: $10.00', isHidden: false },
            {
              input: '3.14159',
              expectedOutput: 'Total: $3.14',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un nombre y un entero (uno por línea). Imprime el nombre alineado a la izquierda en 10 columnas seguido del número alineado a la derecha en 5 columnas.',
          starterCode: 'nombre = input()\nvalor = int(input())\n',
          solution:
            'nombre = input()\nvalor = int(input())\nprint(f"{nombre:<10}{valor:>5}")\n',
          difficulty: 3,
          testCases: [
            {
              input: 'Ana\n42',
              expectedOutput: 'Ana' + ' '.repeat(10) + '42',
              isHidden: false,
            },
            {
              input: 'Luis\n7',
              expectedOutput: 'Luis' + ' '.repeat(10) + '7',
              isHidden: false,
            },
            {
              input: 'Eva\n12345',
              expectedOutput: 'Eva       12345',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee los aciertos y el total de preguntas (enteros, uno por línea) e imprime el porcentaje de aciertos con 1 decimal, por ejemplo `70.0%`.',
          starterCode: 'aciertos = int(input())\ntotal = int(input())\n',
          solution:
            'aciertos = int(input())\ntotal = int(input())\nprint(f"{aciertos / total:.1%}")\n',
          difficulty: 3,
          testCases: [
            { input: '7\n10', expectedOutput: '70.0%', isHidden: false },
            { input: '1\n3', expectedOutput: '33.3%', isHidden: false },
            { input: '5\n5', expectedOutput: '100.0%', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa debería mostrar `Edad: 25`, pero muestra las llaves. ¿Qué línea tiene el error?',
          difficulty: 1,
          payload: {
            lines: ['edad = 25', 'print("Edad: {edad}")'],
            buggyLineIndex: 1,
            explanation:
              'Falta la `f` antes de las comillas: sin ella Python no reemplaza `{edad}` y lo imprime tal cual. Debe ser `print(f"Edad: {edad}")`.',
          },
        },
      ],
    },
  ],
};
