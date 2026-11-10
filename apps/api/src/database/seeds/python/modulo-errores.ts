import type { SeedModule } from '../curriculum.data';
import { md } from '../md';

export const moduloErrores: SeedModule = {
  title: 'Errores y depuración',
  lessons: [
    {
      title: 'Leer mensajes de error',
      xpReward: 10,
      contentMarkdown: md`
# Leer mensajes de error

Equivocarse es parte de programar: incluso quien lleva años escribiendo código ve errores todos los días. La habilidad no es no cometerlos, sino **leerlos bien**.

## Anatomía de un error

§§§text
Traceback (most recent call last):
File "main.py", line 3, in <module>
print(lista[5])
IndexError: list index out of range
§§§

1. **La última línea** dice el tipo de error y qué pasó (§IndexError: list index out of range§).
2. **Arriba** dice en qué archivo y **en qué línea** ocurrió (§line 3§).
3. Muestra el código de esa línea.

Lee siempre de abajo hacia arriba: primero _qué_, después _dónde_.

## Los errores más comunes

| Error               | Cuándo aparece                                               | Ejemplo                     |
| ------------------- | ------------------------------------------------------------ | --------------------------- |
| §SyntaxError§       | el código está mal escrito (falta §:§, comillas, paréntesis) | §if x > 3§                  |
| §NameError§         | usas una variable que no existe                              | §print(totl)§ (por §total§) |
| §TypeError§         | operación con tipos incompatibles                            | §"5" + 2§                   |
| §ValueError§        | tipo correcto, valor inválido                                | §int("hola")§               |
| §IndexError§        | índice fuera de la lista                                     | §[1, 2, 3][5]§              |
| §KeyError§          | clave inexistente en un diccionario                          | §{"a": 1}["b"]§             |
| §ZeroDivisionError§ | división entre cero                                          | §10 / 0§                    |
| §IndentationError§  | indentación incorrecta                                       | cuerpo de §if§ sin sangría  |

## Errores que no avisan

Hay un tipo peor: el programa **no falla pero da un resultado equivocado** (un error lógico). Por ejemplo, §promedio = a + b / 2§ funciona, pero calcula mal. Esos se encuentran probando con valores conocidos, como verás en la lección de depuración.

## Primera ayuda

- Relee la línea que indica el error **y la anterior**.
- Busca letras de más o de menos en los nombres.
- Copia el mensaje de error (la última línea) y búscalo tal cual: casi seguro alguien lo ha tenido antes.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 1,
          payload: {
            code: 'total = 10\nprint(totl)',
            options: ['SyntaxError', 'NameError', 'TypeError', 'ValueError'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 1,
          payload: {
            code: 'numero = int("hola")',
            options: ['TypeError', 'NameError', 'ValueError', 'IndexError'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 2,
          payload: {
            code: 'datos = {"a": 1}\nprint(datos["b"])',
            options: ['KeyError', 'IndexError', 'ValueError', 'NameError'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt:
            'En un traceback, ¿dónde está el tipo de error y su descripción?',
          difficulty: 1,
          payload: {
            code: 'Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print(10 / 0)\nZeroDivisionError: division by zero',
            options: [
              'En la primera línea',
              'En la línea que dice File',
              'En la última línea',
              'No aparece',
            ],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Corrige el TypeError convirtiendo el texto a número.',
          difficulty: 2,
          payload: {
            template: 'edad = "15"\nprint({{0}}(edad) + 1)',
            blanks: ['int'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros `a` y `b` (uno por línea). Si `b` es 0 imprime `no se puede dividir entre cero`; en caso contrario imprime `a / b` redondeado a 2 decimales.',
          starterCode: 'a = int(input())\nb = int(input())\n',
          solution:
            'a = int(input())\nb = int(input())\nif b == 0:\n    print("no se puede dividir entre cero")\nelse:\n    print(round(a / b, 2))\n',
          difficulty: 2,
          testCases: [
            { input: '10\n2', expectedOutput: '5.0', isHidden: false },
            {
              input: '7\n0',
              expectedOutput: 'no se puede dividir entre cero',
              isHidden: false,
            },
            { input: '1\n3', expectedOutput: '0.33', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt: 'El programa lanza `IndexError`. ¿Qué línea es la causa?',
          difficulty: 2,
          payload: {
            lines: [
              'lista = [1, 2, 3]',
              'for i in range(4):',
              '    print(lista[i])',
            ],
            buggyLineIndex: 1,
            explanation:
              'La lista tiene 3 elementos (índices 0 a 2) pero el bucle llega hasta 3. Debe ser `range(len(lista))`.',
          },
        },
        {
          type: 'bug',
          prompt: 'El programa lanza `TypeError`. ¿Qué línea es la causa?',
          difficulty: 2,
          payload: {
            lines: ['precio = "10"', 'total = precio * 2.5', 'print(total)'],
            buggyLineIndex: 0,
            explanation:
              '`precio` es un string, no un número, así que no se puede multiplicar por 2.5. Debe guardarse como número: `precio = 10` (o `float("10")`).',
          },
        },
      ],
    },
    {
      title: 'Manejo de excepciones',
      xpReward: 10,
      contentMarkdown: md`
# Manejo de excepciones

Un error que ocurre mientras el programa corre se llama **excepción**. Si no se atiende, el programa se detiene. Con §try§ / §except§ puedes **atenderla** y seguir.

§§§python
try:
numero = int(input("Número: "))
print(100 / numero)
except ValueError:
print("Eso no es un número")
except ZeroDivisionError:
print("No se puede dividir entre cero")
§§§

## Cómo funciona

1. Python ejecuta el bloque §try§ línea por línea.
2. Si ocurre una excepción, **salta** al §except§ que coincida con su tipo; el resto del §try§ no se ejecuta.
3. Si no hay error, los §except§ se ignoran.

## Bloques opcionales

§§§python
try:
n = int(texto)
except ValueError:
print("inválido")
else:
print("convertido:", n) # solo si NO hubo excepción
finally:
print("fin") # siempre se ejecuta
§§§

## Buenas prácticas

- Captura **excepciones concretas** (§ValueError§), no un §except:§ pelado que esconde errores que no esperabas.
- Mete en el §try§ **solo** las líneas que pueden fallar.
- No uses §try§ para ocultar errores de lógica: arréglalos.

## Pedir hasta que sea válido

§§§python
while True:
try:
edad = int(input("Edad: "))
break # salió bien: salimos del bucle
except ValueError:
print("Escribe un número entero")
§§§

## Lanzar tus propias excepciones

§§§python
def raiz(n):
if n < 0:
raise ValueError("n no puede ser negativo")
return n ** 0.5
§§§
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'try:\n    print("a")\n    int("x")\n    print("b")\nexcept ValueError:\n    print("c")\nfinally:\n    print("d")',
            options: ['a b d', 'a c d', 'a b c d', 'a c'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué excepción captura `10 / 0`?',
          difficulty: 1,
          payload: {
            code: 'try:\n    print(10 / 0)\nexcept ______:\n    print("error")',
            options: [
              'ValueError',
              'ZeroDivisionError',
              'TypeError',
              'KeyError',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Atrapa el error de conversión y usa un bloque que siempre se ejecute.',
          difficulty: 2,
          payload: {
            template:
              'try:\n    n = int("abc")\nexcept {{0}}:\n    n = 0\n{{1}}:\n    print("fin")',
            blanks: ['ValueError', 'finally'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un texto. Si se puede convertir a entero, imprime el doble; si no, imprime `invalido`.',
          starterCode: 'texto = input()\n',
          solution:
            'texto = input()\ntry:\n    print(int(texto) * 2)\nexcept ValueError:\n    print("invalido")\n',
          difficulty: 2,
          testCases: [
            { input: '21', expectedOutput: '42', isHidden: false },
            { input: 'abc', expectedOutput: 'invalido', isHidden: false },
            { input: '3.5', expectedOutput: 'invalido', isHidden: true },
            { input: '-4', expectedOutput: '-8', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos valores (uno por línea) e intenta dividir el primero entre el segundo como números decimales. Si algún valor no es un número imprime `valor invalido`; si divides entre cero imprime `division por cero`; si todo sale bien imprime el resultado redondeado a 2 decimales.',
          starterCode: 'a = input()\nb = input()\n',
          solution:
            'a = input()\nb = input()\ntry:\n    resultado = float(a) / float(b)\nexcept ValueError:\n    print("valor invalido")\nexcept ZeroDivisionError:\n    print("division por cero")\nelse:\n    print(round(resultado, 2))\n',
          difficulty: 3,
          testCases: [
            { input: '10\n2', expectedOutput: '5.0', isHidden: false },
            {
              input: '5\n0',
              expectedOutput: 'division por cero',
              isHidden: false,
            },
            {
              input: 'x\n2',
              expectedOutput: 'valor invalido',
              isHidden: false,
            },
            { input: '1\n3', expectedOutput: '0.33', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La entrada trae varias líneas: las que no sean números enteros hay que ignorarlas, hasta llegar a la primera que sí lo sea. Imprime ese número. (Usa un bucle `while True` con `try` / `except`.)',
          starterCode: '',
          solution:
            'while True:\n    try:\n        n = int(input())\n        break\n    except ValueError:\n        pass\nprint(n)\n',
          difficulty: 3,
          testCases: [
            { input: 'abc\n7', expectedOutput: '7', isHidden: false },
            { input: '5', expectedOutput: '5', isHidden: false },
            { input: 'a\nb\nc\n12', expectedOutput: '12', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros y, en la línea siguiente, un índice. Imprime el elemento de esa posición, o `fuera de rango` si el índice no existe. Resuélvelo con `try` / `except IndexError`.',
          starterCode: 'lista = input().split()\nindice = int(input())\n',
          solution:
            'lista = input().split()\nindice = int(input())\ntry:\n    print(lista[indice])\nexcept IndexError:\n    print("fuera de rango")\n',
          difficulty: 2,
          testCases: [
            { input: '10 20 30\n1', expectedOutput: '20', isHidden: false },
            {
              input: '10 20 30\n5',
              expectedOutput: 'fuera de rango',
              isHidden: false,
            },
            { input: '10 20 30\n-1', expectedOutput: '30', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere evitar el cierre del programa cuando el texto no es un número, pero igual falla. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'try:',
              '    n = int("abc")',
              'except ZeroDivisionError:',
              '    print("error")',
            ],
            buggyLineIndex: 2,
            explanation:
              '`int("abc")` lanza `ValueError`, pero el `except` solo atrapa `ZeroDivisionError`, así que la excepción sigue sin atenderse. Debe ser `except ValueError:`.',
          },
        },
      ],
    },
    {
      title: 'Depurar tu código',
      xpReward: 15,
      contentMarkdown: md`
# Depurar tu código

**Depurar** (_debugging_) es encontrar y corregir errores. Los más difíciles son los lógicos: el programa corre pero el resultado es incorrecto.

## Método en 5 pasos

1. **Reproduce** el problema con una entrada concreta y pequeña.
2. **Predice** qué debería salir, escrito a mano.
3. **Observa** qué sale realmente.
4. **Localiza** dónde se separan lo esperado y lo real.
5. **Corrige** una sola cosa y vuelve a probar.

## Depurar con §print()§

Muestra los valores en puntos clave para ver dónde el programa se aparta de lo que crees:

§§§python
total = 0
for n in [1, 2, 3]:
print("antes:", total, "n:", n) # <- pista de depuración
total = n # ¿ves el error?
print(total)
§§§

Al ver §antes: 0 n: 1§, §antes: 1 n: 2§... notas que §total§ nunca acumula: falta §total += n§. Borra los §print§ de depuración al terminar.

## Errores lógicos frecuentes

- **Off-by-one:** quedarse una vuelta corto o largo (§range(1, n)§ en vez de §range(1, n + 1)§).
- **Precedencia:** §a + b / 2§ en vez de §(a + b) / 2§.
- **§=§ por §==§:** asignar en vez de comparar.
- **Condición invertida:** §>§ en vez de §<§.
- **Variable no reiniciada:** dejar el contador con el valor de una vuelta anterior.
- **Sombrear nombres:** llamar §list§, §sum§ o §max§ a una variable y luego intentar usar la función original.

## §assert§: comprobar suposiciones

§§§python
def promedio(numeros):
assert len(numeros) > 0, "la lista no puede estar vacía"
return sum(numeros) / len(numeros)
§§§

Si la condición es falsa, el programa se detiene en ese punto con tu mensaje, en vez de seguir con datos incorrectos.

## Más trucos

- Prueba con **casos límite**: lista vacía, un solo elemento, cero, negativos.
- Explica el código en voz alta, línea a línea (_rubber duck debugging_): muchas veces el error aparece al contarlo.
- Divide el problema: comprueba cada función por separado.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt:
            'El programa corre sin errores pero da un resultado incorrecto. ¿Qué conviene hacer primero?',
          difficulty: 1,
          payload: {
            code: 'def promedio(a, b):\n    return a + b / 2\n\nprint(promedio(10, 20))   # imprime 20.0, se esperaba 15.0',
            options: [
              'Reinstalar Python',
              'Probar con valores sencillos y revisar paso a paso qué calcula cada parte',
              'Borrar la función y empezar de cero',
              'Ignorarlo: no hay mensaje de error',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Cuánto vale `total` al final?',
          difficulty: 2,
          payload: {
            code: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
            options: ['3', '6', '10', '0'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Protege la función: detén el programa si la lista está vacía.',
          difficulty: 2,
          payload: {
            template:
              'def promedio(numeros):\n    {{0}} len(numeros) > 0, "lista vacía"\n    return sum(numeros) / len({{1}})',
            blanks: ['assert', 'numeros'],
          },
        },
        {
          type: 'code',
          prompt:
            'Este programa debería imprimir la suma de los números del 1 al `n`, pero falla por una vuelta. Corrígelo.',
          starterCode:
            'n = int(input())\ntotal = 0\nfor i in range(1, n):\n    total += i\nprint(total)\n',
          solution:
            'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)\n',
          difficulty: 2,
          testCases: [
            { input: '4', expectedOutput: '10', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '55', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa debería imprimir el promedio de una línea de enteros, pero el resultado es incorrecto. Corrígelo (imprime el promedio sin redondear).',
          starterCode:
            'numeros = [int(x) for x in input().split()]\ntotal = 0\nfor n in numeros:\n    total = n\nprint(total / len(numeros))\n',
          solution:
            'numeros = [int(x) for x in input().split()]\ntotal = 0\nfor n in numeros:\n    total += n\nprint(total / len(numeros))\n',
          difficulty: 2,
          testCases: [
            { input: '4 6', expectedOutput: '5.0', isHidden: false },
            { input: '10 20 30', expectedOutput: '20.0', isHidden: false },
            { input: '7', expectedOutput: '7.0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Debería imprimir los números pares del 1 al `n` (uno por línea), pero imprime los impares y se queda corto. Corrígelo.',
          starterCode:
            'n = int(input())\nfor i in range(1, n):\n    if i % 2 == 1:\n        print(i)\n',
          solution:
            'n = int(input())\nfor i in range(1, n + 1):\n    if i % 2 == 0:\n        print(i)\n',
          difficulty: 2,
          testCases: [
            { input: '6', expectedOutput: '2\n4\n6', isHidden: false },
            { input: '2', expectedOutput: '2', isHidden: false },
            { input: '9', expectedOutput: '2\n4\n6\n8', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            "El programa lanza `TypeError: 'list' object is not callable`. ¿Qué línea es la causa raíz?",
          difficulty: 3,
          payload: {
            lines: [
              'list = [3, 1, 2]',
              'print(sorted(list))',
              'print(list(range(3)))',
            ],
            buggyLineIndex: 0,
            explanation:
              'Al llamar `list` a una variable se tapa la función integrada `list()`. Cuando después se intenta usar `list(range(3))`, Python ve la lista, no la función. Hay que elegir otro nombre (por ejemplo `numeros`).',
          },
        },
      ],
    },
  ],
};
