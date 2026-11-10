import type { SeedModule } from '../curriculum.data';
import { md } from '../md';

export const moduloFunciones: SeedModule = {
  title: 'Funciones a fondo',
  lessons: [
    {
      title: 'Parámetros y argumentos',
      xpReward: 10,
      contentMarkdown: md`
# Parámetros y argumentos

Un **parámetro** es el nombre que aparece en la definición de la función; un **argumento** es el valor real que le pasas al llamarla.

§§§python
def rectangulo(base, altura): # base, altura: parámetros
return base * altura

rectangulo(3, 4) # 3 y 4: argumentos
§§§

## Argumentos nombrados

Puedes indicar a qué parámetro corresponde cada valor, y entonces el orden ya no importa:

§§§python
def resta(a, b):
return a - b

resta(10, 3) # 7
resta(b=3, a=10) # 7
§§§

## Valores por defecto

§§§python
def potencia(base, exponente=2):
return base ** exponente

potencia(5) # 25 (usa exponente=2)
potencia(5, 3) # 125
§§§

**Regla:** los parámetros con valor por defecto van **al final**. Esto es un error de sintaxis:

§§§python
def area(base, altura=1, factor): # SyntaxError
...
§§§

## Cantidad variable de argumentos: §*args§

§§§python
def sumar(*numeros):
return sum(numeros)

sumar(1, 2) # 3
sumar(1, 2, 3, 4) # 10
§§§

Dentro de la función, §numeros§ es una **tupla** con todos los argumentos recibidos.

## Una función, una tarea

Si una función hace demasiadas cosas, divídela. Nombres claros (§calcular_promedio§, no §f1§) hacen el código casi autoexplicativo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'def multiplicar(a, b=2):\n    return a * b\n\nprint(multiplicar(3))',
            options: ['3', '5', '6', 'Error'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'def resta(a, b):\n    return a - b\n\nprint(resta(b=1, a=10))',
            options: ['-9', '9', '11', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Haz que la función acepte cualquier cantidad de números.',
          difficulty: 2,
          payload: {
            template: 'def sumar(*{{0}}):\n    return sum({{1}})',
            blanks: ['numeros', 'numeros'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `potencia(base, exponente=2)`. Lee un entero `base` e imprime `potencia(base)` y, en la línea siguiente, `potencia(base, 3)`.',
          starterCode:
            'def potencia(base, exponente=2):\n    # Escribe tu código aquí\n    pass\n\nbase = int(input())\nprint(potencia(base))\nprint(potencia(base, 3))\n',
          solution:
            'def potencia(base, exponente=2):\n    return base ** exponente\n\nbase = int(input())\nprint(potencia(base))\nprint(potencia(base, 3))\n',
          difficulty: 2,
          testCases: [
            { input: '3', expectedOutput: '9\n27', isHidden: false },
            { input: '2', expectedOutput: '4\n8', isHidden: false },
            { input: '-2', expectedOutput: '4\n-8', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `promedio(*numeros)` que devuelva el promedio de los valores recibidos. Lee una línea de enteros, pásalos a la función con `*` (desempaquetado) e imprime el promedio redondeado a 2 decimales.',
          starterCode:
            'def promedio(*numeros):\n    # Escribe tu código aquí\n    pass\n\nvalores = [int(x) for x in input().split()]\nprint(round(promedio(*valores), 2))\n',
          solution:
            'def promedio(*numeros):\n    return sum(numeros) / len(numeros)\n\nvalores = [int(x) for x in input().split()]\nprint(round(promedio(*valores), 2))\n',
          difficulty: 3,
          testCases: [
            { input: '4 6', expectedOutput: '5.0', isHidden: false },
            { input: '1 2 2', expectedOutput: '1.67', isHidden: false },
            { input: '10', expectedOutput: '10.0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `saludar(nombre, saludo="Hola")` que devuelva `saludo, nombre!`. Lee un nombre y un saludo (una por línea) e imprime el resultado llamando a la función con el argumento nombrado `saludo=`.',
          starterCode:
            'def saludar(nombre, saludo="Hola"):\n    # Escribe tu código aquí\n    pass\n\nnombre = input()\ntexto = input()\nprint(saludar(nombre, saludo=texto))\n',
          solution:
            'def saludar(nombre, saludo="Hola"):\n    return f"{saludo}, {nombre}!"\n\nnombre = input()\ntexto = input()\nprint(saludar(nombre, saludo=texto))\n',
          difficulty: 2,
          testCases: [
            {
              input: 'Ana\nBuenas',
              expectedOutput: 'Buenas, Ana!',
              isHidden: false,
            },
            {
              input: 'Luis\nHola',
              expectedOutput: 'Hola, Luis!',
              isHidden: false,
            },
            {
              input: 'Eva\nHello',
              expectedOutput: 'Hello, Eva!',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Esta definición no se puede ejecutar. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'def area(base, altura=1, factor):',
              '    return base * altura * factor',
              '',
              'print(area(2, 3, 4))',
            ],
            buggyLineIndex: 0,
            explanation:
              'Un parámetro sin valor por defecto (`factor`) no puede ir después de uno con valor por defecto (`altura=1`): SyntaxError. Los parámetros con valor por defecto van al final.',
          },
        },
      ],
    },
    {
      title: 'Alcance y buenas prácticas',
      xpReward: 10,
      contentMarkdown: md`
# Alcance y buenas prácticas

## Alcance (scope)

El **alcance** de una variable es la parte del programa donde existe.

§§§python
x = 10 # variable global

def cambiar():
x = 5 # otra variable, LOCAL a la función
print(x) # 5

cambiar()
print(x) # 10 — la global no cambió
§§§

Una variable creada dentro de una función desaparece cuando la función termina.

## Modificar una variable global

Se puede con la palabra §global§, pero **suele ser mala idea**: el código se vuelve difícil de seguir.

§§§python
total = 0

def sumar(n):
global total
total += n
§§§

La alternativa limpia: recibir lo que necesitas como parámetro y **devolver** el resultado.

§§§python
def sumar(total, n):
return total + n

total = sumar(total, 5)
§§§

## §return§ no es §print()§

- §print()§ **muestra** algo en pantalla.
- §return§ **entrega** un valor a quien llamó la función, para que lo guarde o lo use.

Una función sin §return§ devuelve §None§:

§§§python
def suma(a, b):
print(a + b)

resultado = suma(2, 3) # imprime 5
print(resultado) # None → resultado + 1 daría un error
§§§

## Documentar con docstrings

§§§python
def es_par(n):
"""Devuelve True si n es par."""
return n % 2 == 0
§§§

## Funciones "puras"

Una función que, con los mismos argumentos, siempre devuelve lo mismo y no cambia nada fuera de ella es fácil de probar y de reutilizar. Intenta escribir la mayoría así.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'x = 10\n\ndef f():\n    x = 5\n\nf()\nprint(x)',
            options: ['5', '10', 'None', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué valor guarda `r`?',
          difficulty: 2,
          payload: {
            code: 'def mostrar():\n    print("hola")\n\nr = mostrar()',
            options: ['"hola"', 'None', '0', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Modifica la variable global desde la función.',
          difficulty: 3,
          payload: {
            template:
              'total = 0\n\ndef sumar(n):\n    {{0}} total\n    total += n\n\nsumar(5)\nprint({{1}})',
            blanks: ['global', 'total'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `es_primo(n)` que devuelva `True` si `n` es primo (mayor que 1 y solo divisible entre 1 y él mismo). Lee un entero e imprime `primo` o `no primo`.',
          starterCode:
            'def es_primo(n):\n    # Escribe tu código aquí\n    pass\n\nn = int(input())\nif es_primo(n):\n    print("primo")\nelse:\n    print("no primo")\n',
          solution:
            'def es_primo(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nn = int(input())\nif es_primo(n):\n    print("primo")\nelse:\n    print("no primo")\n',
          difficulty: 3,
          testCases: [
            { input: '17', expectedOutput: 'primo', isHidden: false },
            { input: '9', expectedOutput: 'no primo', isHidden: false },
            { input: '2', expectedOutput: 'primo', isHidden: true },
            { input: '1', expectedOutput: 'no primo', isHidden: true },
            { input: '0', expectedOutput: 'no primo', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `contar_vocales(texto)` que devuelva cuántas vocales (a, e, i, o, u, en minúscula) tiene el texto. Lee una frase e imprime el resultado.',
          starterCode:
            'def contar_vocales(texto):\n    # Escribe tu código aquí\n    pass\n\nprint(contar_vocales(input()))\n',
          solution:
            'def contar_vocales(texto):\n    return sum(1 for letra in texto if letra in "aeiou")\n\nprint(contar_vocales(input()))\n',
          difficulty: 2,
          testCases: [
            { input: 'hola mundo', expectedOutput: '4', isHidden: false },
            { input: 'rhythm', expectedOutput: '0', isHidden: false },
            { input: 'aeiou', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `precio_final(precio, descuento=10)` que devuelva el precio tras aplicar el porcentaje de descuento. Lee un precio y un descuento (enteros, uno por línea) e imprime el resultado redondeado a 2 decimales.',
          starterCode:
            'def precio_final(precio, descuento=10):\n    # Escribe tu código aquí\n    pass\n\nprecio = int(input())\ndescuento = int(input())\nprint(round(precio_final(precio, descuento), 2))\n',
          solution:
            'def precio_final(precio, descuento=10):\n    return precio - precio * descuento / 100\n\nprecio = int(input())\ndescuento = int(input())\nprint(round(precio_final(precio, descuento), 2))\n',
          difficulty: 2,
          testCases: [
            { input: '200\n10', expectedOutput: '180.0', isHidden: false },
            { input: '99\n15', expectedOutput: '84.15', isHidden: false },
            { input: '50\n0', expectedOutput: '50.0', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa falla al ejecutarse. ¿Qué línea tiene la causa del error?',
          difficulty: 2,
          payload: {
            lines: [
              'def suma(a, b):',
              '    print(a + b)',
              '',
              'total = suma(2, 3) + 1',
              'print(total)',
            ],
            buggyLineIndex: 1,
            explanation:
              'La función imprime en vez de devolver, así que `suma(2, 3)` vale `None` y `None + 1` lanza TypeError. Debe usar `return a + b`.',
          },
        },
      ],
    },
    {
      title: 'Recursión',
      xpReward: 15,
      contentMarkdown: md`
# Recursión

Una función es **recursiva** cuando se llama a sí misma para resolver una versión más pequeña del mismo problema.

Toda recursión necesita dos partes:

1. **Caso base:** la situación más simple, que se responde directamente y detiene la recursión.
2. **Caso recursivo:** la función se llama con un problema **más pequeño**, acercándose al caso base.

## Ejemplo: factorial

§5! = 5 × 4 × 3 × 2 × 1§. Pero también §5! = 5 × 4!§, y así sucesivamente.

§§§python
def factorial(n):
if n <= 1: # caso base
return 1
return n * factorial(n - 1) # caso recursivo

factorial(4) # 24
§§§

Así se ejecuta §factorial(4)§:

§§§text
factorial(4) = 4 * factorial(3)
= 4 * (3 * factorial(2))
= 4 * (3 * (2 * factorial(1)))
= 4 * (3 * (2 * 1)) = 24
§§§

## Ejemplo: cuenta regresiva

§§§python
def cuenta(n):
if n == 0:
print("¡Listo!")
return
print(n)
cuenta(n - 1)
§§§

## El error clásico

Sin caso base (o si nunca se alcanza), la función se llama infinitamente hasta que Python se rinde con un §RecursionError§.

## ¿Recursión o bucle?

Todo lo recursivo se puede hacer con bucles, normalmente más rápido y con menos memoria. La recursión brilla cuando el problema es **naturalmente recursivo** (árboles, carpetas dentro de carpetas, divide y vencerás). Para aprender, practicarla es muy valioso.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))',
            options: ['10', '24', '12', '4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué parte es imprescindible para que una función recursiva termine?',
          difficulty: 1,
          payload: {
            code: 'def f(n):\n    return f(n - 1)',
            options: [
              'Un bucle for',
              'Un caso base que detenga las llamadas',
              'Una variable global',
              'Usar print en vez de return',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas para definir el factorial de forma recursiva.',
          difficulty: 2,
          payload: {
            blocks: [
              'def factorial(n):',
              '    if n <= 1:',
              '        return 1',
              '    return n * factorial(n - 1)',
            ],
          },
        },
        {
          type: 'fill',
          prompt:
            'Completa la cuenta regresiva: caso base y llamada más pequeña.',
          difficulty: 2,
          payload: {
            template:
              'def cuenta(n):\n    if n == {{0}}:\n        return\n    print(n)\n    cuenta(n {{1}} 1)',
            blanks: ['0', '-'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `factorial(n)` de forma recursiva. Lee un entero `n >= 0` e imprime su factorial (el factorial de 0 es 1).',
          starterCode:
            'def factorial(n):\n    # Escribe tu código aquí\n    pass\n\nprint(factorial(int(input())))\n',
          solution:
            'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(int(input())))\n',
          difficulty: 2,
          testCases: [
            { input: '5', expectedOutput: '120', isHidden: false },
            { input: '0', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '3628800', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `fibonacci(n)` recursivamente (`fibonacci(0) = 0`, `fibonacci(1) = 1`, y cada término es la suma de los dos anteriores). Lee `n` (0 a 20) e imprime `fibonacci(n)`.',
          starterCode:
            'def fibonacci(n):\n    # Escribe tu código aquí\n    pass\n\nprint(fibonacci(int(input())))\n',
          solution:
            'def fibonacci(n):\n    if n < 2:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(int(input())))\n',
          difficulty: 3,
          testCases: [
            { input: '6', expectedOutput: '8', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: true },
            { input: '15', expectedOutput: '610', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `suma_digitos(n)` de forma recursiva (la suma de los dígitos de `n` es el último dígito más la suma de los dígitos del resto). Lee un entero positivo e imprime el resultado.',
          starterCode:
            'def suma_digitos(n):\n    # Escribe tu código aquí\n    pass\n\nprint(suma_digitos(int(input())))\n',
          solution:
            'def suma_digitos(n):\n    if n < 10:\n        return n\n    return n % 10 + suma_digitos(n // 10)\n\nprint(suma_digitos(int(input())))\n',
          difficulty: 3,
          testCases: [
            { input: '123', expectedOutput: '6', isHidden: false },
            { input: '9', expectedOutput: '9', isHidden: false },
            { input: '9999', expectedOutput: '36', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Al ejecutarse, el programa termina con `RecursionError`. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'def factorial(n):',
              '    return n * factorial(n - 1)',
              '',
              'print(factorial(3))',
            ],
            buggyLineIndex: 1,
            explanation:
              'Falta el caso base: la función nunca deja de llamarse a sí misma. Hay que añadir antes `if n <= 1: return 1`.',
          },
        },
      ],
    },
    {
      title: 'Funciones lambda, map y filter',
      xpReward: 10,
      contentMarkdown: md`
# Funciones lambda, map y filter

## Lambda: funciones de una línea

Una **lambda** es una función pequeña, sin nombre, escrita en una sola expresión:

§§§python
doble = lambda x: x * 2
doble(4) # 8

(lambda a, b: a + b)(2, 3) # 5
§§§

Es equivalente a §def doble(x): return x * 2§. Úsala solo para funciones muy cortas, normalmente como argumento de otra función.

## §map()§: transformar cada elemento

§§§python
numeros = [1, 2, 3]
dobles = list(map(lambda n: n * 2, numeros)) # [2, 4, 6]
§§§

§map()§ devuelve un objeto "perezoso"; se convierte en lista con §list()§. No admite índices (§map(...)[0]§ falla).

## §filter()§: quedarse con los que cumplen

§§§python
pares = list(filter(lambda n: n % 2 == 0, [1, 2, 3, 4])) # [2, 4]
§§§

## Ordenar con §key§

§sorted()§, §min()§ y §max()§ aceptan una función §key§ que indica **por qué** comparar:

§§§python
palabras = ["pera", "uva", "kiwi"]
sorted(palabras, key=len) # ["uva", "pera", "kiwi"] (por longitud)
max(palabras, key=lambda p: p[-1]) # la de mayor última letra
§§§

## ¿Lambda o comprensión?

§[n * 2 for n in numeros]§ suele leerse mejor que §list(map(lambda ...))§. Aprende ambas: verás las dos en código real.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print((lambda x: x + 1)(4))',
            options: ['4', '5', 'x + 1', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'print(list(map(lambda x: x * 2, [1, 2, 3])))',
            options: ['[1, 2, 3]', '[2, 4, 6]', '[2, 4, 6, 8]', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Filtra los pares y ordena las palabras por longitud.',
          difficulty: 3,
          payload: {
            template:
              'print(list({{0}}(lambda n: n % 2 == 0, [1, 2, 3, 4])))\nprint(sorted(["pera", "uva"], key={{1}} p: len(p)))',
            blanks: ['filter', 'lambda'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime cada uno multiplicado por 2, separados por un espacio. Usa `map` con una lambda.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\nprint(" ".join(map(str, map(lambda n: n * 2, numeros))))\n',
          difficulty: 2,
          testCases: [
            { input: '1 2 3', expectedOutput: '2 4 6', isHidden: false },
            { input: '5', expectedOutput: '10', isHidden: false },
            { input: '-1 0 4', expectedOutput: '-2 0 8', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime solo los mayores que 10, separados por un espacio, usando `filter`. Si no hay ninguno, imprime `ninguno`.',
          starterCode: 'numeros = [int(x) for x in input().split()]\n',
          solution:
            'numeros = [int(x) for x in input().split()]\nmayores = list(filter(lambda n: n > 10, numeros))\nif mayores:\n    print(" ".join(map(str, mayores)))\nelse:\n    print("ninguno")\n',
          difficulty: 2,
          testCases: [
            { input: '5 12 8 30', expectedOutput: '12 30', isHidden: false },
            { input: '1 2 3', expectedOutput: 'ninguno', isHidden: false },
            { input: '11', expectedOutput: '11', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de palabras e imprímelas ordenadas de la más corta a la más larga (si empatan, se mantiene el orden original), separadas por un espacio.',
          starterCode: 'palabras = input().split()\n',
          solution:
            'palabras = input().split()\nprint(" ".join(sorted(palabras, key=len)))\n',
          difficulty: 2,
          testCases: [
            {
              input: 'pera uva kiwi',
              expectedOutput: 'uva pera kiwi',
              isHidden: false,
            },
            { input: 'sol luna', expectedOutput: 'sol luna', isHidden: false },
            {
              input: 'abeja gato pez',
              expectedOutput: 'pez gato abeja',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de palabras e imprime la más larga (si hay empate, la primera).',
          starterCode: 'palabras = input().split()\n',
          solution:
            'palabras = input().split()\nprint(max(palabras, key=len))\n',
          difficulty: 2,
          testCases: [
            {
              input: 'casa sol arbol',
              expectedOutput: 'arbol',
              isHidden: false,
            },
            { input: 'ab cd', expectedOutput: 'ab', isHidden: false },
            {
              input: 'python java c',
              expectedOutput: 'python',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa intenta leer el primer resultado de `map` y falla. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'cuadrados = map(lambda x: x * x, [1, 2, 3])',
              'print(cuadrados[0])',
            ],
            buggyLineIndex: 1,
            explanation:
              '`map()` devuelve un objeto iterable, no una lista, y no admite índices (TypeError). Hay que convertirlo primero: `list(map(...))`.',
          },
        },
      ],
    },
  ],
};
