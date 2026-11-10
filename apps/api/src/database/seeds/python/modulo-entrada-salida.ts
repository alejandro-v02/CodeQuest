import type { SeedModule } from '../curriculum.data';
import { md } from './md';

export const moduloEntradaSalida: SeedModule = {
  title: 'Entrada, salida y lógica',
  lessons: [
    {
      title: 'Entrada y salida',
      xpReward: 10,
      contentMarkdown: md`
# Entrada y salida

Un programa útil se comunica: **muestra** información (salida) y **recibe** datos del usuario (entrada).

## Salida con §print()§

§§§python
print("Hola, mundo")
print("Tengo", 3, "gatos") # varios valores, separados por un espacio
§§§

Dos opciones útiles de §print()§:

§§§python
print("a", "b", "c", sep="-") # a-b-c (separador)
print("Cargando", end="...") # no salta de línea al final
print("listo") # Cargando...listo
§§§

## Entrada con §input()§

§input()§ pausa el programa, espera que la persona escriba y presione Enter, y devuelve lo escrito **siempre como texto** (§str§):

§§§python
nombre = input("¿Cómo te llamas? ")
print("Hola,", nombre)
§§§

Si necesitas un número, conviértelo:

§§§python
edad = int(input("Edad: "))
print("El año que viene tendrás", edad + 1)
§§§

**Error típico:** olvidar la conversión. §"5" + 1§ falla porque no se puede sumar texto con número.

En los ejercicios de CodeQuest la entrada llega **una línea por cada §input()§**, en orden.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print("a", "b", "c", sep="-")',
            options: ['a b c', 'a-b-c', 'abc', 'a, b, c'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Pide el nombre al usuario y salúdalo.',
          difficulty: 1,
          payload: {
            template:
              'nombre = {{0}}("¿Cómo te llamas? ")\nprint("Hola,", {{1}})',
            blanks: ['input', 'nombre'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un nombre y un apellido (uno por línea) e imprime `apellido, nombre`.',
          starterCode: 'nombre = input()\napellido = input()\n',
          solution:
            'nombre = input()\napellido = input()\nprint(f"{apellido}, {nombre}")\n',
          difficulty: 1,
          testCases: [
            {
              input: 'Ana\nPérez',
              expectedOutput: 'Pérez, Ana',
              isHidden: false,
            },
            {
              input: 'Luis\nGómez',
              expectedOutput: 'Gómez, Luis',
              isHidden: false,
            },
            { input: 'Eva\nRuiz', expectedOutput: 'Ruiz, Eva', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee la base y la altura de un rectángulo (enteros, una por línea) e imprime su área.',
          starterCode: 'base = int(input())\naltura = int(input())\n',
          solution:
            'base = int(input())\naltura = int(input())\nprint(base * altura)\n',
          difficulty: 1,
          testCases: [
            { input: '3\n4', expectedOutput: '12', isHidden: false },
            { input: '10\n10', expectedOutput: '100', isHidden: false },
            { input: '7\n1', expectedOutput: '7', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Este programa debería mostrar la edad, pero falla al ejecutarse. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: ['edad = int(input())', 'print("Tienes " + edad + " años")'],
            buggyLineIndex: 1,
            explanation:
              'No se puede concatenar texto con un número usando §+§ (TypeError). Usa §print("Tienes", edad, "años")§ o un f-string.'.replace(
                /§/g,
                '`',
              ),
          },
        },
      ],
    },
    {
      title: 'Operadores aritméticos',
      xpReward: 10,
      contentMarkdown: md`
# Operadores aritméticos

| Operador | Significado                   | Ejemplo  | Resultado |
| -------- | ----------------------------- | -------- | --------- |
| §+§      | suma                          | §7 + 2§  | §9§       |
| §-§      | resta                         | §7 - 2§  | §5§       |
| §*§      | multiplicación                | §7 * 2§  | §14§      |
| §/§      | división (siempre da §float§) | §7 / 2§  | §3.5§     |
| §//§     | división entera               | §7 // 2§ | §3§       |
| §%§      | resto (módulo)                | §7 % 2§  | §1§       |
| §**§     | potencia                      | §2 ** 3§ | §8§       |

## Precedencia

Python respeta el orden matemático: primero §**§, luego §*§ §/§ §//§ §%§, y al final §+§ §-§. Los paréntesis mandan:

§§§python
print(2 + 3 * 4) # 14
print((2 + 3) * 4) # 20
§§§

## Para qué sirve el resto §%§

- Saber si un número es par: §n % 2 == 0§.
- Obtener el último dígito: §n % 10§.
- Convertir segundos en minutos y segundos: §s // 60§ y §s % 60§.

## Operadores abreviados

§§§python
total = 10
total += 5 # 15
total *= 2 # 30
§§§
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(17 // 5)',
            options: ['3.4', '3', '2', '4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(2 + 3 * 4)',
            options: ['20', '14', '24', '9'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Usa el operador correcto para obtener el resto y la potencia.',
          difficulty: 1,
          payload: {
            template: 'print(17 {{0}} 5)   # 2\nprint(2 {{1}} 3)    # 8',
            blanks: ['%', '**'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una cantidad de segundos (entero) e imprime `M min S s`, donde M son los minutos completos y S los segundos restantes.',
          starterCode: 'segundos = int(input())\n',
          solution:
            'segundos = int(input())\nminutos = segundos // 60\nresto = segundos % 60\nprint(f"{minutos} min {resto} s")\n',
          difficulty: 2,
          testCases: [
            { input: '125', expectedOutput: '2 min 5 s', isHidden: false },
            { input: '59', expectedOutput: '0 min 59 s', isHidden: false },
            { input: '3600', expectedOutput: '60 min 0 s', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt: 'Lee un entero positivo e imprime su último dígito.',
          starterCode: 'n = int(input())\n',
          solution: 'n = int(input())\nprint(n % 10)\n',
          difficulty: 1,
          testCases: [
            { input: '457', expectedOutput: '7', isHidden: false },
            { input: '10', expectedOutput: '0', isHidden: false },
            { input: '9', expectedOutput: '9', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una temperatura en grados Celsius (entero) e imprime los grados Fahrenheit redondeados a 1 decimal. Fórmula: `c * 9 / 5 + 32`.',
          starterCode: 'celsius = int(input())\n',
          solution:
            'celsius = int(input())\nprint(round(celsius * 9 / 5 + 32, 1))\n',
          difficulty: 2,
          testCases: [
            { input: '0', expectedOutput: '32.0', isHidden: false },
            { input: '100', expectedOutput: '212.0', isHidden: false },
            { input: '-40', expectedOutput: '-40.0', isHidden: true },
            { input: '37', expectedOutput: '98.6', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Debería calcular el promedio de `a` y `b`, pero el resultado es incorrecto. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'a = 10',
              'b = 20',
              'promedio = a + b / 2',
              'print(promedio)',
            ],
            buggyLineIndex: 2,
            explanation:
              'La división se ejecuta antes que la suma: queda §10 + 10§ = 20. Hacen falta paréntesis: §(a + b) / 2§.'.replace(
                /§/g,
                '`',
              ),
          },
        },
      ],
    },
    {
      title: 'Comparaciones y lógica booleana',
      xpReward: 10,
      contentMarkdown: md`
# Comparaciones y lógica booleana

Una comparación produce un valor **booleano**: §True§ o §False§.

§§§python
5 > 3 # True
5 == 5 # True (igual)
5 != 5 # False (distinto)
"a" < "b" # True (orden alfabético)
§§§

## Combinar condiciones

| Operador  | Es verdadero cuando...        |
| --------- | ----------------------------- |
| §A and B§ | **ambas** son verdaderas      |
| §A or B§  | **al menos una** es verdadera |
| §not A§   | A es falsa                    |

Tabla de verdad de §and§ y §or§:

| A     | B     | A and B | A or B |
| ----- | ----- | ------- | ------ |
| True  | True  | True    | True   |
| True  | False | False   | True   |
| False | True  | False   | True   |
| False | False | False   | False  |

## Comparaciones encadenadas

Python permite escribir como en matemáticas:

§§§python
x = 7
print(1 < x < 10) # True
§§§

**Error típico:** §x > 1 and < 10§ no es válido; cada lado de §and§ debe ser una comparación completa (§x > 1 and x < 10§).

## Cortocircuito

En §A and B§, si A es falso Python ni siquiera evalúa B. En §A or B§, si A es verdadero tampoco evalúa B.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'print(not (True and False))',
            options: ['True', 'False', 'None', 'Error'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'x = 5\nprint(x > 3 and x < 4)',
            options: ['True', 'False', '5', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa para que sea verdadero cuando x está entre 3 y 10.',
          difficulty: 1,
          payload: {
            template: 'x = 7\nprint(x > 3 {{0}} x < 10)',
            blanks: ['and'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un entero e imprime `True` si está entre 10 y 20 (ambos incluidos), o `False` si no lo está.',
          starterCode: 'n = int(input())\n',
          solution: 'n = int(input())\nprint(10 <= n <= 20)\n',
          difficulty: 1,
          testCases: [
            { input: '15', expectedOutput: 'True', isHidden: false },
            { input: '25', expectedOutput: 'False', isHidden: false },
            { input: '10', expectedOutput: 'True', isHidden: true },
            { input: '9', expectedOutput: 'False', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un año e imprime `bisiesto` o `no bisiesto`. Un año es bisiesto si es divisible entre 4 y no entre 100, o si es divisible entre 400.',
          starterCode: 'anio = int(input())\n',
          solution:
            'anio = int(input())\nif (anio % 4 == 0 and anio % 100 != 0) or anio % 400 == 0:\n    print("bisiesto")\nelse:\n    print("no bisiesto")\n',
          difficulty: 3,
          testCases: [
            { input: '2024', expectedOutput: 'bisiesto', isHidden: false },
            { input: '1900', expectedOutput: 'no bisiesto', isHidden: false },
            { input: '2000', expectedOutput: 'bisiesto', isHidden: true },
            { input: '2023', expectedOutput: 'no bisiesto', isHidden: true },
          ],
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas para mostrar un aviso solo si la temperatura está entre 25 y 35.',
          difficulty: 1,
          payload: {
            blocks: [
              'temperatura = 30',
              'if temperatura > 25 and temperatura < 35:',
              '    print("calor agradable")',
            ],
          },
        },
        {
          type: 'bug',
          prompt:
            'Esta comparación lanza un error de sintaxis. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'nota = 75',
              'if nota > 60 and < 100:',
              '    print("válida")',
            ],
            buggyLineIndex: 1,
            explanation:
              'Cada lado de §and§ necesita una comparación completa: §nota > 60 and nota < 100§ (o §60 < nota < 100§).'.replace(
                /§/g,
                '`',
              ),
          },
        },
      ],
    },
    {
      title: 'Pensar como un programa',
      xpReward: 15,
      contentMarkdown: md`
# Pensar como un programa

Antes de escribir código hay que saber **qué pasos** hay que dar. Una lista de pasos ordenados y sin ambigüedad se llama **algoritmo**.

## De la idea al código

Problema: _calcular el total a pagar con un descuento_.

1. Pedir el precio.
2. Pedir el porcentaje de descuento.
3. Calcular cuánto se descuenta.
4. Restar el descuento al precio.
5. Mostrar el resultado.

Cada paso se vuelve una o dos líneas de Python:

§§§python
precio = int(input())
porcentaje = int(input())
descuento = precio * porcentaje / 100
total = precio - descuento
print(total)
§§§

## El orden importa

Python ejecuta **de arriba hacia abajo, una línea a la vez**. No puedes usar una variable antes de crearla:

§§§python
print(total) # NameError: name 'total' is not defined
total = 10
§§§

## Trazar un programa

Para entender (o depurar) un programa, sigue los valores línea por línea como una tabla:

§§§python
x = 2
y = 3
x = y
y = x + 1
§§§

| Línea       | x   | y   |
| ----------- | --- | --- |
| §x = 2§     | 2   | –   |
| §y = 3§     | 2   | 3   |
| §x = y§     | 3   | 3   |
| §y = x + 1§ | 3   | 4   |

## Pseudocódigo

Es una forma de escribir el algoritmo en palabras antes de programar:

§§§text
SI edad >= 18 ENTONCES
mostrar "mayor de edad"
SINO
mostrar "menor de edad"
§§§

Traducirlo a Python es casi directo: §if§, §else§, dos puntos e indentación.

**Consejo:** si no sabes cómo empezar, resuelve el problema a mano con un ejemplo pequeño y anota cada paso que hiciste.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: 'Traza el programa. ¿Qué imprime?',
          difficulty: 2,
          payload: {
            code: 'x = 2\ny = 3\nx = y\ny = x + 1\nprint(x, y)',
            options: ['2 3', '3 4', '3 3', '2 4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué ocurre al ejecutar este código?',
          difficulty: 1,
          payload: {
            code: 'print(total)\ntotal = 10',
            options: [
              'Imprime 10',
              'Imprime None',
              'Lanza NameError porque total aún no existe',
              'Imprime 0',
            ],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Traduce el pseudocódigo `SI edad >= 18 ENTONCES` a Python.',
          difficulty: 1,
          payload: {
            template: '{{0}} edad >= 18{{1}}\n    print("mayor de edad")',
            blanks: ['if', ':'],
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena los pasos del algoritmo: calcular el área de un triángulo.',
          difficulty: 1,
          payload: {
            blocks: [
              'base = int(input())',
              'altura = int(input())',
              'area = base * altura / 2',
              'print(area)',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un precio y un porcentaje de descuento (enteros, uno por línea) e imprime el total a pagar.',
          starterCode: 'precio = int(input())\nporcentaje = int(input())\n',
          solution:
            'precio = int(input())\nporcentaje = int(input())\ndescuento = precio * porcentaje / 100\nprint(precio - descuento)\n',
          difficulty: 2,
          testCases: [
            { input: '200\n10', expectedOutput: '180.0', isHidden: false },
            { input: '50\n20', expectedOutput: '40.0', isHidden: false },
            { input: '100\n0', expectedOutput: '100.0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'FizzBuzz de un número: lee un entero `n`. Si es múltiplo de 3 y de 5 imprime `FizzBuzz`; si solo de 3, `Fizz`; si solo de 5, `Buzz`; en otro caso imprime el número.',
          starterCode: 'n = int(input())\n',
          solution:
            'n = int(input())\nif n % 15 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelif n % 5 == 0:\n    print("Buzz")\nelse:\n    print(n)\n',
          difficulty: 3,
          testCases: [
            { input: '15', expectedOutput: 'FizzBuzz', isHidden: false },
            { input: '9', expectedOutput: 'Fizz', isHidden: false },
            { input: '10', expectedOutput: 'Buzz', isHidden: false },
            { input: '7', expectedOutput: '7', isHidden: true },
            { input: '30', expectedOutput: 'FizzBuzz', isHidden: true },
          ],
        },
      ],
    },
  ],
};
