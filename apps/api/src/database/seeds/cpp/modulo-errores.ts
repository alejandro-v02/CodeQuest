import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES } from './common';

export const moduloErrores: SeedModule = {
  title: 'Errores y depuración',
  lessons: [
    {
      title: 'Leer errores del compilador',
      xpReward: 10,
      contentMarkdown: md`
# Leer errores del compilador

En C++ casi todos los errores aparecen **antes de ejecutar**: el compilador (g++) revisa tu código y, si algo no encaja, no genera el programa. Aprender a leer sus mensajes es una habilidad clave.

## Anatomía de un error

§§§text
main.cpp:6:22: error: 'totl' was not declared in this scope
§§§

1. **Dónde**: §main.cpp:6:22§ es el archivo, la **línea 6** y la **columna 22**.
2. **Tipo**: §error§ (no compila) o §warning§ (compila, pero algo huele mal).
3. **Qué pasó**: el mensaje, casi siempre en inglés.

Si hay varios errores, **arregla primero el de más arriba**: muchas veces uno provoca a los demás.

## Los errores más comunes

| Mensaje (resumido)                               | Qué significa                                                 |
| ------------------------------------------------ | ------------------------------------------------------------- |
| §'x' was not declared in this scope§             | usas una variable que no existe (¿errata? ¿falta declararla?) |
| §expected ';' before ...§                        | falta un punto y coma (¡en la línea **anterior**!)            |
| §invalid conversion from 'const char*' to 'int'§ | guardas un texto en un entero                                 |
| §too few arguments to function§                  | llamas a la función con menos argumentos                      |
| §assignment of read-only variable 'x'§           | intentas cambiar una §const§                                  |

## El punto y coma olvidado

§§§cpp
int x = 5
cout << x;
§§§

El compilador se queja en la línea de §cout§ (la 2), pero el olvido está en la línea 1. Cuando el error parece "no tener sentido", **mira la línea anterior**.

## Warnings: avisos que no hay que ignorar

Una función que promete devolver un valor y no lo hace compila (con aviso), pero el resultado es basura:

§§§cpp
int doble(int n) {
int r = n * 2;
// falta: return r;
}
§§§

## Errores que el compilador no ve

El compilador comprueba **sintaxis y tipos**, no tu lógica. Este código compila pero está mal:

§§§cpp
double promedio = a + b / 2; // falta el paréntesis: (a + b) / 2
§§§

Y hay errores que solo aparecen **al ejecutar** (como acceder a un índice que no existe, o dividir entre cero con enteros). Para esos, prueba tu programa con varios valores, incluidos los extremos (0, negativos, listas vacías).

## Pasos para depurar

1. Lee el **primer** error y su línea.
2. Revisa esa línea **y la anterior**.
3. Busca erratas: mayúsculas, ortografía del nombre, llaves y paréntesis sin cerrar.
4. Si sigue sin salir, imprime los valores con §cout§ para ver qué está pasando.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿En qué línea y columna se produce este error?',
          difficulty: 1,
          payload: {
            code: "main.cpp:6:22: error: 'totl' was not declared in this scope",
            options: [
              'Línea 22, columna 6',
              'Línea 6, columna 22',
              'En todo el archivo',
              'En la línea de main()',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué significa este error?',
          difficulty: 1,
          payload: {
            code: "error: 'totl' was not declared in this scope",
            options: [
              'totl es una constante',
              'totl no existe: errata o falta declararla',
              'totl debe ser un int',
              'Falta un include',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            'Falta un `;` y el compilador marca la línea 2. ¿Dónde está realmente el olvido?',
          difficulty: 2,
          payload: {
            code: "int x = 5\ncout << x;\n// error: expected ',' or ';' before 'cout'  (línea 2)",
            options: [
              'En la línea 2',
              'En la línea 1, antes del cout',
              'En el include',
              'En la última línea del programa',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Este código compila? ¿Hace lo que parece?',
          difficulty: 3,
          payload: {
            code: 'double a = 4, b = 6;\ndouble promedio = a + b / 2;\ncout << promedio;',
            options: [
              'No compila: falta un paréntesis',
              'Compila, pero imprime 7 en vez de 5 (error lógico)',
              'No compila: b / 2 no es un double',
              'Compila e imprime 5',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'bug',
          prompt:
            'El compilador responde "\'totl\' was not declared". ¿Qué línea tiene la errata?',
          difficulty: 2,
          payload: {
            lines: [
              'int total = 10;',
              'int iva = total * 19 / 100;',
              'cout << totl + iva;',
            ],
            buggyLineIndex: 2,
            explanation: 'La variable se llama total, no totl.',
          },
        },
        {
          type: 'bug',
          prompt:
            "El compilador responde \"expected ';' before 'cout'\" en la línea 3. ¿Qué línea tiene el olvido?",
          difficulty: 3,
          payload: {
            lines: ['int a = 4;', 'int b = 6', 'cout << a + b;'],
            buggyLineIndex: 1,
            explanation:
              'A int b = 6 le falta el punto y coma; el compilador lo detecta al llegar a la línea siguiente.',
          },
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (conversión inválida). Corrígelo para que lea un número e imprima su doble.',
          starterCode: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  string doble = n * 2;\n  cout << doble << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  int doble = n * 2;\n  cout << doble << endl;\n${FIN}`,
          difficulty: 1,
          testCases: [
            { input: '4', expectedOutput: '8', isHidden: false },
            { input: '-3', expectedOutput: '-6', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (variable no declarada). Corrígelo para que lea dos números e imprima su suma.',
          starterCode: `${INCLUDES}int main() {\n  int a, b;\n  cin >> a >> b;\n  int suma = a + c;\n  cout << suma << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}int main() {\n  int a, b;\n  cin >> a >> b;\n  int suma = a + b;\n  cout << suma << endl;\n${FIN}`,
          difficulty: 1,
          testCases: [
            { input: '2\n3', expectedOutput: '5', isHidden: false },
            { input: '10 -4', expectedOutput: '6', isHidden: false },
            { input: '0 0', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (faltan argumentos) y además tiene un error lógico. Corrígelo para que lea dos notas e imprima su promedio con 1 decimal.',
          starterCode: `${INCLUDES}double promedio(double a, double b) {\n  return a + b / 2;\n}\n\nint main() {\n  double a, b;\n  cin >> a >> b;\n  cout << fixed << setprecision(1) << promedio(a) << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}double promedio(double a, double b) {\n  return (a + b) / 2;\n}\n\nint main() {\n  double a, b;\n  cin >> a >> b;\n  cout << fixed << setprecision(1) << promedio(a, b) << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '4\n5', expectedOutput: '4.5', isHidden: false },
            { input: '3\n3', expectedOutput: '3.0', isHidden: false },
            { input: '10 0', expectedOutput: '5.0', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Excepciones',
      xpReward: 10,
      contentMarkdown: md`
# Excepciones

Algunos errores solo se descubren **mientras el programa corre**: un texto que no es un número, un índice que no existe, una división que no debería hacerse. Para tratarlos existen las excepciones.

## try / catch

§§§cpp
#include <stdexcept>

try {
int n = stoi("abc"); // lanza una excepción
cout << n << endl;
} catch (const invalid_argument& e) {
cout << "no es un numero" << endl;
}
§§§

- §try§: el código que podría fallar.
- §catch§: qué hacer si falla; recibe el error.
- Si dentro del §try§ ocurre una excepción, el resto del bloque se **salta** y se ejecuta el §catch§ que corresponda.

## Lanzar tus propias excepciones

§§§cpp
double dividir(int a, int b) {
if (b == 0) {
throw invalid_argument("No se puede dividir entre cero");
}
return static_cast<double>(a) / b;
}

try {
cout << dividir(5, 0) << endl;
} catch (const exception& e) {
cout << e.what() << endl; // No se puede dividir entre cero
}
§§§

- §throw§ detiene la función y salta al §catch§ más cercano.
- §e.what()§ devuelve el mensaje del error.
- §exception§ es la clase base de todas las excepciones estándar, así que §catch (const exception& e)§ atrapa cualquiera de ellas.

## Excepciones estándar útiles

| Excepción          | Cuándo aparece                              |
| ------------------ | ------------------------------------------- |
| §invalid_argument§ | un argumento no es válido (§stoi("abc")§)   |
| §out_of_range§     | un índice fuera de rango con §v.at(i)§      |
| §runtime_error§    | un error general que ocurre en la ejecución |

## at() frente a []

§§§cpp
vector<int> v = {1, 2, 3};
v[10]; // sin avisar: comportamiento indefinido
v.at(10); // lanza out_of_range, que puedes atrapar
§§§

Usa §at()§ cuando no estés seguro de que el índice sea válido.

## Excepción sin atrapar

Si nadie atrapa la excepción, el programa **termina de golpe**:

§§§text
terminate called after throwing an instance of 'std::runtime_error'
what(): boom
§§§

## Cuándo usar excepciones

- Para situaciones **excepcionales** (datos inválidos, recursos que fallan).
- No para el flujo normal: comprobar con un §if§ si la lista está vacía es más claro que provocar un error.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'try {\n  int n = stoi("abc");\n  cout << n;\n} catch (const invalid_argument& e) {\n  cout << "invalido";\n}',
            options: ['0', 'abc', 'invalido', 'Nada'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'try {\n  cout << "A";\n  throw runtime_error("fallo");\n  cout << "B";\n} catch (const exception& e) {\n  cout << "C";\n}',
            options: ['AB', 'AC', 'ABC', 'C'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué devuelve `e.what()`?',
          difficulty: 2,
          payload: {
            code: 'try {\n  throw invalid_argument("dato mal");\n} catch (const exception& e) {\n  cout << e.what();\n}',
            options: ['invalid_argument', 'dato mal', 'Nada', 'Un número'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué ocurre si nadie atrapa la excepción?',
          difficulty: 2,
          payload: {
            code: 'int main() {\n  throw runtime_error("boom");\n}',
            options: [
              'El programa continúa normalmente',
              'El programa termina de golpe con un mensaje de error',
              'No compila',
              'Imprime boom',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Lanza una excepción cuando el divisor es cero.',
          difficulty: 2,
          payload: {
            template:
              'if (b == 0) {\n  {{0}} invalid_argument("No se puede dividir entre cero");\n}',
            blanks: ['throw'],
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas del bloque que intenta convertir un texto y avisa si falla.',
          difficulty: 2,
          payload: {
            blocks: [
              'try {',
              '  int n = stoi(texto);',
              '  cout << n << endl;',
              '} catch (const invalid_argument& e) {',
              '  cout << "invalido" << endl;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un texto e imprime `valido` si se puede convertir a número entero con `stoi`, o `invalido` si no. Usa `try`/`catch`.',
          starterCode: `${INCLUDES}int main() {\n  string texto;\n  cin >> texto;\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}int main() {\n  string texto;\n  cin >> texto;\n  try {\n    stoi(texto);\n    cout << "valido" << endl;\n  } catch (const invalid_argument& e) {\n    cout << "invalido" << endl;\n  }\n${FIN}`,
          difficulty: 2,
          testCases: [
            { input: '42', expectedOutput: 'valido', isHidden: false },
            { input: 'hola', expectedOutput: 'invalido', isHidden: false },
            { input: '-7', expectedOutput: 'valido', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros. Si el segundo es 0, `dividir` lanza `invalid_argument("No se puede dividir entre cero")` y el programa imprime el mensaje; si no, imprime el cociente con 2 decimales.',
          starterCode: `${INCLUDES}double dividir(int a, int b) {\n  // TODO: lanza invalid_argument si b es 0\n  return static_cast<double>(a) / b;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  try {\n    cout << fixed << setprecision(2) << dividir(a, b) << endl;\n  } catch (const exception& e) {\n    cout << e.what() << endl;\n  }\n  return 0;\n}\n`,
          solution: `${INCLUDES}double dividir(int a, int b) {\n  if (b == 0) {\n    throw invalid_argument("No se puede dividir entre cero");\n  }\n  return static_cast<double>(a) / b;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  try {\n    cout << fixed << setprecision(2) << dividir(a, b) << endl;\n  } catch (const exception& e) {\n    cout << e.what() << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '10\n4', expectedOutput: '2.50', isHidden: false },
            {
              input: '5\n0',
              expectedOutput: 'No se puede dividir entre cero',
              isHidden: false,
            },
            { input: '9 3', expectedOutput: '3.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N, luego N enteros y al final un índice `i`. Imprime el elemento en esa posición usando `at()`; si el índice no existe, imprime `fuera de rango`.',
          starterCode: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int k = 0; k < n; k++) {\n    cin >> v[k];\n  }\n  int i;\n  cin >> i;\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int k = 0; k < n; k++) {\n    cin >> v[k];\n  }\n  int i;\n  cin >> i;\n  try {\n    cout << v.at(i) << endl;\n  } catch (const out_of_range& e) {\n    cout << "fuera de rango" << endl;\n  }\n${FIN}`,
          difficulty: 3,
          testCases: [
            { input: '3\n10 20 30\n1', expectedOutput: '20', isHidden: false },
            {
              input: '3\n10 20 30\n5',
              expectedOutput: 'fuera de rango',
              isHidden: false,
            },
            {
              input: '2\n7 8\n-1',
              expectedOutput: 'fuera de rango',
              isHidden: true,
            },
          ],
        },
      ],
    },
  ],
};
