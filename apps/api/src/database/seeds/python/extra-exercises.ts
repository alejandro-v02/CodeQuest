import type { SeedExercise } from '../curriculum.data';

// Extra exercises appended (by lesson title) to the original "Fundamentos"
// lessons. Appending keeps the existing exercises' order index — and so
// their database ids — untouched.
export const pythonExtraExercises: Record<string, SeedExercise[]> = {
  'Variables y asignación': [
    {
      type: 'quiz',
      prompt: '¿Cuál es el valor de `x` al final?',
      difficulty: 1,
      payload: {
        code: 'x = 4\nx = x + 3\nx += 2',
        options: ['4', '7', '9', '12'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Completa para guardar el nombre y mostrar el saludo.',
      difficulty: 1,
      payload: {
        template: 'nombre {{0}} "Ana"\nprint({{1}})',
        blanks: ['=', 'nombre'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee dos números enteros (uno por línea) e imprime su suma.',
      starterCode: 'a = int(input())\nb = int(input())\n',
      solution: 'a = int(input())\nb = int(input())\nprint(a + b)\n',
      difficulty: 1,
      testCases: [
        { input: '2\n3', expectedOutput: '5', isHidden: false },
        { input: '10\n-4', expectedOutput: '6', isHidden: false },
        { input: '0\n0', expectedOutput: '0', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt: 'Este programa debería intercambiar `a` y `b`. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'a = 1',
          'b = 2',
          'a = b',
          'b = a',
          'print(a, b)',
        ],
        buggyLineIndex: 2,
        explanation:
          'Al hacer `a = b` se pierde el valor original de `a`; después `b = a` copia el mismo valor. Hace falta una variable temporal (o `a, b = b, a`).',
      },
    },
  ],
  'Tipos de datos básicos': [
    {
      type: 'code',
      prompt:
        'Lee un número decimal (`float`) que es el radio de un círculo e imprime su área con `3.14159 * radio ** 2`, redondeada a 2 decimales con `round(valor, 2)`.',
      starterCode: 'radio = float(input())\n',
      solution:
        'radio = float(input())\nprint(round(3.14159 * radio ** 2, 2))\n',
      difficulty: 2,
      testCases: [
        { input: '1', expectedOutput: '3.14', isHidden: false },
        { input: '2', expectedOutput: '12.57', isHidden: false },
        { input: '0.5', expectedOutput: '0.79', isHidden: true },
      ],
    },
    {
      type: 'fill',
      prompt: 'Convierte el texto a número entero para poder sumarle 1.',
      difficulty: 1,
      payload: {
        template: 'texto = "41"\nnumero = {{0}}(texto)\nprint(numero + {{1}})',
        blanks: ['int', '1'],
      },
    },
    {
      type: 'quiz',
      prompt: '¿Qué tipo tiene el resultado de `7 / 2`?',
      difficulty: 2,
      payload: {
        code: 'resultado = 7 / 2\nprint(type(resultado))',
        options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
        correctIndex: 1,
      },
    },
    {
      type: 'code',
      prompt:
        'Lee un nombre y una edad (una por línea) e imprime: `Nombre tiene N años` usando un f-string.',
      starterCode: 'nombre = input()\nedad = int(input())\n',
      solution:
        'nombre = input()\nedad = int(input())\nprint(f"{nombre} tiene {edad} años")\n',
      difficulty: 2,
      testCases: [
        { input: 'Luis\n30', expectedOutput: 'Luis tiene 30 años', isHidden: false },
        { input: 'Eva\n8', expectedOutput: 'Eva tiene 8 años', isHidden: false },
        { input: 'Sofía\n101', expectedOutput: 'Sofía tiene 101 años', isHidden: true },
      ],
    },
  ],
  Condicionales: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'nota = 65\nif nota >= 90:\n    print("A")\nelif nota >= 60:\n    print("B")\nelse:\n    print("C")',
        options: ['A', 'B', 'C', 'No imprime nada'],
        correctIndex: 1,
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una nota (entero 0-100). Imprime "aprobado" si es 60 o más, de lo contrario "reprobado".',
      starterCode: 'nota = int(input())\n',
      solution:
        'nota = int(input())\nif nota >= 60:\n    print("aprobado")\nelse:\n    print("reprobado")\n',
      difficulty: 1,
      testCases: [
        { input: '75', expectedOutput: 'aprobado', isHidden: false },
        { input: '59', expectedOutput: 'reprobado', isHidden: false },
        { input: '60', expectedOutput: 'aprobado', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee tres números enteros (uno por línea) e imprime el mayor, sin usar `max()`.',
      starterCode: 'a = int(input())\nb = int(input())\nc = int(input())\n',
      solution:
        'a = int(input())\nb = int(input())\nc = int(input())\nmayor = a\nif b > mayor:\n    mayor = b\nif c > mayor:\n    mayor = c\nprint(mayor)\n',
      difficulty: 3,
      testCases: [
        { input: '1\n5\n3', expectedOutput: '5', isHidden: false },
        { input: '9\n2\n4', expectedOutput: '9', isHidden: false },
        { input: '-3\n-8\n-1', expectedOutput: '-1', isHidden: true },
        { input: '7\n7\n7', expectedOutput: '7', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt: 'Este código debería imprimir "mayor" solo si la edad es 18 o más. ¿Qué línea tiene el error?',
      difficulty: 2,
      payload: {
        lines: [
          'edad = 18',
          'if edad = 18:',
          '    print("mayor")',
        ],
        buggyLineIndex: 1,
        explanation:
          'Para comparar se usa `==` (o `>=` en este caso); un solo `=` es una asignación y provoca un SyntaxError dentro de un `if`.',
      },
    },
  ],
  Bucles: [
    {
      type: 'code',
      prompt:
        'Lee un entero `n` e imprime los números del 1 al `n`, uno por línea.',
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)\n',
      difficulty: 1,
      testCases: [
        { input: '3', expectedOutput: '1\n2\n3', isHidden: false },
        { input: '1', expectedOutput: '1', isHidden: false },
        { input: '5', expectedOutput: '1\n2\n3\n4\n5', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee un entero `n` e imprime la suma de los números del 1 al `n`.',
      starterCode: 'n = int(input())\ntotal = 0\n',
      solution:
        'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)\n',
      difficulty: 2,
      testCases: [
        { input: '4', expectedOutput: '10', isHidden: false },
        { input: '10', expectedOutput: '55', isHidden: false },
        { input: '1', expectedOutput: '1', isHidden: true },
      ],
    },
    {
      type: 'quiz',
      prompt: '¿Cuántas veces se imprime "hola"?',
      difficulty: 1,
      payload: {
        code: 'for i in range(2, 6):\n    print("hola")',
        options: ['2', '3', '4', '5'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Completa para recorrer del 0 al 4 y saltar los números impares.',
      difficulty: 2,
      payload: {
        template:
          'for n in range({{0}}):\n    if n % 2 == 1:\n        {{1}}\n    print(n)',
        blanks: ['5', 'continue'],
      },
    },
    {
      type: 'bug',
      prompt: 'Este bucle debería terminar, pero se queda corriendo para siempre. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'contador = 0',
          'while contador < 5:',
          '    print(contador)',
        ],
        buggyLineIndex: 2,
        explanation:
          'Falta incrementar `contador` dentro del bucle (`contador += 1`); sin eso la condición siempre es verdadera y el bucle es infinito.',
      },
    },
  ],
  Funciones: [
    {
      type: 'code',
      prompt:
        'Define `cuadrado(n)` que devuelva `n * n`. Lee un entero, llama a la función e imprime el resultado.',
      starterCode:
        'def cuadrado(n):\n    # Escribe tu código aquí\n    pass\n\nprint(cuadrado(int(input())))\n',
      solution:
        'def cuadrado(n):\n    return n * n\n\nprint(cuadrado(int(input())))\n',
      difficulty: 1,
      testCases: [
        { input: '4', expectedOutput: '16', isHidden: false },
        { input: '-3', expectedOutput: '9', isHidden: false },
        { input: '0', expectedOutput: '0', isHidden: true },
      ],
    },
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'def saludar(nombre, idioma="es"):\n    if idioma == "es":\n        return "Hola " + nombre\n    return "Hello " + nombre\n\nprint(saludar("Ana", "en"))',
        options: ['Hola Ana', 'Hello Ana', 'Ana', 'None'],
        correctIndex: 1,
      },
    },
    {
      type: 'sort',
      prompt: 'Ordena las líneas para definir y usar una función que suma dos números.',
      difficulty: 1,
      payload: {
        blocks: [
          'def sumar(a, b):',
          '    return a + b',
          '',
          'resultado = sumar(2, 3)',
          'print(resultado)',
        ],
      },
    },
    {
      type: 'code',
      prompt:
        'Define `promedio(a, b, c)` que devuelva el promedio de tres números. Lee tres enteros (uno por línea) e imprime el promedio redondeado a 2 decimales con `round(valor, 2)`.',
      starterCode:
        'def promedio(a, b, c):\n    # Escribe tu código aquí\n    pass\n\na = int(input())\nb = int(input())\nc = int(input())\nprint(round(promedio(a, b, c), 2))\n',
      solution:
        'def promedio(a, b, c):\n    return (a + b + c) / 3\n\na = int(input())\nb = int(input())\nc = int(input())\nprint(round(promedio(a, b, c), 2))\n',
      difficulty: 2,
      testCases: [
        { input: '3\n4\n5', expectedOutput: '4.0', isHidden: false },
        { input: '1\n2\n2', expectedOutput: '1.67', isHidden: false },
        { input: '10\n10\n10', expectedOutput: '10.0', isHidden: true },
      ],
    },
  ],
  Listas: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'frutas = ["manzana", "pera", "uva"]\nprint(frutas[-1])',
        options: ['manzana', 'pera', 'uva', 'Error'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Agrega un elemento al final de la lista y muestra cuántos hay.',
      difficulty: 1,
      payload: {
        template: 'numeros = [1, 2, 3]\nnumeros.{{0}}(4)\nprint({{1}}(numeros))',
        blanks: ['append', 'len'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una línea con números enteros separados por espacios e imprime su suma. Pista: `input().split()` devuelve una lista de textos.',
      starterCode: 'numeros = [int(x) for x in input().split()]\n',
      solution:
        'numeros = [int(x) for x in input().split()]\nprint(sum(numeros))\n',
      difficulty: 2,
      testCases: [
        { input: '1 2 3 4', expectedOutput: '10', isHidden: false },
        { input: '10', expectedOutput: '10', isHidden: false },
        { input: '-5 5 7', expectedOutput: '7', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee una línea de enteros separados por espacios e imprime solo los pares, separados por espacios. Si no hay ninguno, imprime `ninguno`.',
      starterCode: 'numeros = [int(x) for x in input().split()]\n',
      solution:
        'numeros = [int(x) for x in input().split()]\npares = [n for n in numeros if n % 2 == 0]\nif pares:\n    print(" ".join(str(n) for n in pares))\nelse:\n    print("ninguno")\n',
      difficulty: 3,
      testCases: [
        { input: '1 2 3 4 5 6', expectedOutput: '2 4 6', isHidden: false },
        { input: '7 9', expectedOutput: 'ninguno', isHidden: false },
        { input: '8', expectedOutput: '8', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt: 'Esta lista tiene 3 elementos, pero el código falla. ¿Qué línea tiene el error?',
      difficulty: 2,
      payload: {
        lines: [
          'colores = ["rojo", "verde", "azul"]',
          'print(colores[0])',
          'print(colores[3])',
        ],
        buggyLineIndex: 2,
        explanation:
          'Los índices van de 0 a 2. `colores[3]` no existe y lanza un `IndexError`; el último elemento es `colores[2]` o `colores[-1]`.',
      },
    },
  ],
  Diccionarios: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'precios = {"pan": 800, "leche": 2500}\nprint(precios["leche"])',
        options: ['800', '2500', 'leche', 'Error'],
        correctIndex: 1,
      },
    },
    {
      type: 'fill',
      prompt: 'Lee el teléfono con un valor por defecto si la clave no existe.',
      difficulty: 2,
      payload: {
        template:
          'contacto = {"nombre": "Ana"}\nprint(contacto.{{0}}("telefono", "{{1}}"))',
        blanks: ['get', 'N/A'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una palabra y cuenta cuántas veces aparece cada letra. Imprime una línea `letra: cantidad` por cada letra, en el orden en que aparece por primera vez.',
      starterCode: 'palabra = input()\nconteo = {}\n',
      solution:
        'palabra = input()\nconteo = {}\nfor letra in palabra:\n    conteo[letra] = conteo.get(letra, 0) + 1\nfor letra, cantidad in conteo.items():\n    print(f"{letra}: {cantidad}")\n',
      difficulty: 3,
      testCases: [
        { input: 'hola', expectedOutput: 'h: 1\no: 1\nl: 1\na: 1', isHidden: false },
        { input: 'casa', expectedOutput: 'c: 1\na: 2\ns: 1', isHidden: false },
        { input: 'aaa', expectedOutput: 'a: 3', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt: 'Este código debería imprimir la edad de Luis, pero lanza un error. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'persona = {"nombre": "Luis", "edad": 30}',
          'print(persona["nombre"])',
          'print(persona["Edad"])',
        ],
        buggyLineIndex: 2,
        explanation:
          'Las claves distinguen mayúsculas: `"Edad"` no existe (la clave es `"edad"`), así que se lanza un `KeyError`.',
      },
    },
  ],
};
