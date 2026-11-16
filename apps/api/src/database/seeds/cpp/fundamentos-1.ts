import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES, PLANTILLA } from './common';

// Fundamentos, lecciones 1-3. Order here is the order in the app.
export const fundamentosParte1: SeedLesson[] = [
  {
    title: 'Variables y tipos',
    xpReward: 10,
    contentMarkdown: md`
# Variables y tipos

C++ es un lenguaje **compilado** y de **tipos estáticos**: antes de ejecutarse, el compilador revisa tu programa, y cada variable tiene un tipo fijo que tú declaras.

## Tu primer programa

§§§cpp
#include <iostream>
using namespace std;

int main() {
cout << "Hola, mundo" << endl;
return 0;
}
§§§

- §#include <iostream>§ trae las herramientas de entrada y salida.
- §using namespace std;§ nos deja escribir §cout§ en vez de §std::cout§. Lo usaremos siempre para acortar el código.
- §main§ es donde empieza el programa.
- §cout << ...§ imprime; §endl§ termina la línea.

## Declarar variables

Se escribe el **tipo**, el **nombre** y, si quieres, un valor inicial:

§§§cpp
int edad = 20;
double precio = 9.99;
string nombre = "Ana";
bool activo = true;
char inicial = 'A';
§§§

| Tipo     | Guarda                | Ejemplo                    |
| -------- | --------------------- | -------------------------- |
| §int§    | números enteros       | §42§, §-7§                 |
| §double§ | números con decimales | §3.14§                     |
| §bool§   | verdadero o falso     | §true§, §false§            |
| §char§   | un solo carácter      | §'A'§ (comillas simples)   |
| §string§ | texto                 | §"hola"§ (comillas dobles) |

## El tipo no cambia

§§§cpp
int n = 5;
n = 8; // válido: sigue siendo un entero
n = "hola"; // ERROR de compilación
§§§

Si hay un error de tipos, el programa **ni siquiera se compila**: ves el mensaje de g++ y no hay ejecución.

## Entrada con cin

§cin >>§ lee un valor y lo guarda en una variable:

§§§cpp
int a, b;
cin >> a >> b; // lee dos enteros (separados por espacio o línea)
cout << a + b << endl;
§§§

Para leer una línea completa de texto (con espacios) usa §getline§:

§§§cpp
string nombre;
getline(cin, nombre);
§§§

## Recuerda

- Cada instrucción termina con §;§.
- Declara siempre el tipo y dale un valor inicial: una variable sin inicializar contiene basura.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'int x = 3.7;\ncout << x;',
          options: ['3.7', '4', '3', 'Error de compilación'],
          correctIndex: 2,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué tipo usarías para guardar el precio `9.99`?',
        difficulty: 1,
        payload: {
          code: '____ precio = 9.99;',
          options: ['int', 'double', 'char', 'bool'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué ocurre con esta línea?',
        difficulty: 2,
        payload: {
          code: 'int n = "hola";',
          options: [
            'Guarda 0 en n',
            'Error de compilación: un texto no es un int',
            'Guarda la longitud de "hola"',
            'Se ejecuta pero imprime basura',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara `edad` como un número entero.',
        difficulty: 1,
        payload: {
          template: '{{0}} edad = 20;',
          blanks: ['int'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'int a = 5;',
            'double b = 2.5;',
            'int c = "hola";',
            'cout << a + b;',
          ],
          buggyLineIndex: 2,
          explanation:
            'c es un int y "hola" es un texto: C++ no los convierte y no compila.',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas para leer dos enteros e imprimir su suma.',
        difficulty: 1,
        payload: {
          blocks: ['int a, b;', 'cin >> a >> b;', 'cout << a + b << endl;'],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (línea 1) y una edad (línea 2). Imprime `Hola, <nombre>. Edad: <edad>`.',
        starterCode: `${INCLUDES}int main() {\n  string nombre;\n  int edad;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}int main() {\n  string nombre;\n  int edad;\n  getline(cin, nombre);\n  cin >> edad;\n  cout << "Hola, " << nombre << ". Edad: " << edad << endl;\n${FIN}`,
        difficulty: 1,
        testCases: [
          {
            input: 'Ana\n20',
            expectedOutput: 'Hola, Ana. Edad: 20',
            isHidden: false,
          },
          {
            input: 'Luis Perez\n31',
            expectedOutput: 'Hola, Luis Perez. Edad: 31',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt: 'Lee dos números enteros e imprime su suma.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b << endl;\n${FIN}`,
        difficulty: 1,
        testCases: [
          { input: '2\n3', expectedOutput: '5', isHidden: false },
          { input: '10 -4', expectedOutput: '6', isHidden: false },
          { input: '0\n0', expectedOutput: '0', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee la base y la altura de un triángulo (números decimales) e imprime su área con 2 decimales. Usa `fixed << setprecision(2)`.',
        starterCode: `${INCLUDES}int main() {\n  double base, altura;\n  cin >> base >> altura;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}int main() {\n  double base, altura;\n  cin >> base >> altura;\n  double area = base * altura / 2;\n  cout << fixed << setprecision(2) << area << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '4\n3', expectedOutput: '6.00', isHidden: false },
          { input: '2.5 5', expectedOutput: '6.25', isHidden: false },
          { input: '10\n10', expectedOutput: '50.00', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Tipos de datos básicos',
    xpReward: 10,
    contentMarkdown: md`
# Tipos de datos básicos

Elegir bien el tipo importa: cambia cómo se calcula y cuánto puede guardar una variable.

## Enteros y decimales

§§§cpp
int a = 7;
int b = 2;
cout << a / b << endl; // 3 (división entera: se descarta el decimal)
cout << a % b << endl; // 1 (el resto de la división)
cout << a / 2.0 << endl; // 3.5 (si uno es decimal, el resultado es decimal)
§§§

Dos enteros divididos dan un **entero**. Para obtener decimales, al menos uno de los dos debe ser §double§.

## Conversión de tipos (cast)

§§§cpp
int total = 7, cantidad = 2;
double promedio = static_cast<double>(total) / cantidad; // 3.5
§§§

§static_cast<tipo>(valor)§ convierte el valor al tipo indicado de forma explícita y clara.

## Formato de decimales

§§§cpp
double x = 3.14159;
cout << fixed << setprecision(2) << x << endl; // 3.14
§§§

§setprecision§ (de §<iomanip>§) fija cuántos decimales se imprimen, y §fixed§ evita la notación científica.

## char y bool

§§§cpp
char letra = 'A';
cout << letra << endl; // A
cout << (char)(letra + 1); // B (los caracteres son números por debajo)

bool mayor = 5 > 3;
cout << mayor << endl; // 1 (true se imprime como 1)
§§§

## Límites de los enteros

Un §int§ normal guarda hasta unos 2.100 millones. Si el resultado es más grande, usa §long long§:

§§§cpp
long long grande = 3000000000LL;
§§§

Si un §int§ se desborda, el resultado es incorrecto **sin ningún aviso**.

## Recuerda

- División entera entre §int§; decimal si interviene un §double§.
- §%§ solo funciona con enteros.
- §bool§ se imprime como §1§ o §0§.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'cout << 7 / 2;',
          options: ['3.5', '3', '4', '3.0'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'cout << 17 % 5;',
          options: ['3', '2', '3.4', '12'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'int total = 7, n = 2;\ncout << static_cast<double>(total) / n;',
          options: ['3', '3.5', '4', '3.50'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: "char c = 'A';\ncout << (char)(c + 2);",
          options: ['A', 'C', '67', 'A2'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Imprime `x` con exactamente 2 decimales.',
        difficulty: 2,
        payload: {
          template: 'cout << {{0}} << setprecision({{1}}) << x << endl;',
          blanks: ['fixed', '2'],
        },
      },
      {
        type: 'bug',
        prompt:
          'El promedio de 7 y 2 sale 3 en vez de 3.5. ¿Qué línea tiene el problema?',
        difficulty: 2,
        payload: {
          lines: [
            'int a = 7;',
            'int b = 2;',
            'double promedio = a / b;',
            'cout << promedio << endl;',
          ],
          buggyLineIndex: 2,
          explanation:
            'a / b es una división entre enteros (da 3). Hay que convertir uno a double: static_cast<double>(a) / b.',
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un número entero `n` e imprime el cociente y el resto de dividirlo entre 7, separados por un espacio.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  cout << n / 7 << " " << n % 7 << endl;\n${FIN}`,
        difficulty: 1,
        testCases: [
          { input: '30', expectedOutput: '4 2', isHidden: false },
          { input: '7', expectedOutput: '1 0', isHidden: false },
          { input: '3', expectedOutput: '0 3', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una temperatura en grados Celsius e imprime los grados Fahrenheit con 1 decimal (F = C × 9 / 5 + 32).',
        starterCode: `${INCLUDES}int main() {\n  double celsius;\n  cin >> celsius;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}int main() {\n  double celsius;\n  cin >> celsius;\n  double f = celsius * 9 / 5 + 32;\n  cout << fixed << setprecision(1) << f << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '100', expectedOutput: '212.0', isHidden: false },
          { input: '0', expectedOutput: '32.0', isHidden: false },
          { input: '36.6', expectedOutput: '97.9', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos enteros `a` y `b` e imprime su promedio con 2 decimales (cuidado con la división entera).',
        starterCode: `${INCLUDES}int main() {\n  int a, b;\n  cin >> a >> b;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}int main() {\n  int a, b;\n  cin >> a >> b;\n  double promedio = static_cast<double>(a + b) / 2;\n  cout << fixed << setprecision(2) << promedio << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '7\n2', expectedOutput: '4.50', isHidden: false },
          { input: '10 10', expectedOutput: '10.00', isHidden: false },
          { input: '1\n2', expectedOutput: '1.50', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una letra mayúscula e imprime la letra siguiente del abecedario (por ejemplo `A` → `B`).',
        starterCode: `${INCLUDES}int main() {\n  char letra;\n  cin >> letra;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}int main() {\n  char letra;\n  cin >> letra;\n  cout << static_cast<char>(letra + 1) << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: 'A', expectedOutput: 'B', isHidden: false },
          { input: 'M', expectedOutput: 'N', isHidden: false },
          { input: 'Y', expectedOutput: 'Z', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Condicionales',
    xpReward: 10,
    contentMarkdown: md`
# Condicionales

Un condicional decide qué código ejecutar según se cumpla o no una condición.

## if, else if, else

§§§cpp
int nota = 7;

if (nota >= 9) {
cout << "Excelente" << endl;
} else if (nota >= 6) {
cout << "Aprobado" << endl;
} else {
cout << "Por mejorar" << endl;
}
§§§

Se evalúan en orden y se ejecuta **solo el primer bloque** cuya condición sea verdadera. La condición va entre paréntesis y el bloque entre llaves.

## Comparaciones y lógica

| Operador          | Significa               |
| ----------------- | ----------------------- |
| §==§ §!=§         | igual, distinto         |
| §<§ §>§ §<=§ §>=§ | menor, mayor…           |
| §&&§              | y (las dos condiciones) |
| §\|\|§            | o (basta con una)       |
| §!§               | no (invierte)           |

Atención: §=§ **asigna** y §==§ **compara**. Escribir §if (x = 5)§ en vez de §if (x == 5)§ es un error clásico que compila, pero hace otra cosa.

§§§cpp
int edad = 20;
bool tieneCarnet = true;
if (edad >= 18 && tieneCarnet) {
cout << "Puede entrar" << endl;
}
§§§

## Operador ternario

§§§cpp
string estado = (edad >= 18) ? "adulto" : "menor";
§§§

## switch

Cuando comparas una variable entera con varios valores concretos:

§§§cpp
int dia = 3;
switch (dia) {
case 1: cout << "lunes" << endl; break;
case 2: cout << "martes" << endl; break;
case 3: cout << "miercoles" << endl; break;
default: cout << "otro" << endl;
}
§§§

Cada §case§ termina con §break§: sin él, la ejecución **sigue** en el caso siguiente.

## Recuerda

- Usa §==§ para comparar, no §=§.
- Las llaves §{ }§ evitan errores aunque el bloque tenga una sola línea.
- Los años bisiestos, las notas y los rangos son los clásicos para practicar.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'int nota = 7;\nif (nota >= 9) {\n  cout << "A";\n} else if (nota >= 6) {\n  cout << "B";\n} else {\n  cout << "C";\n}',
          options: ['A', 'B', 'C', 'B y C'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'int x = 3;\nif (x = 5) {\n  cout << "cinco";\n} else {\n  cout << "otro";\n}',
          options: [
            'otro',
            'cinco (x = 5 asigna 5 y es verdadero)',
            'Error de compilación',
            'Nada',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'int d = 2;\nswitch (d) {\n  case 1: cout << "a";\n  case 2: cout << "b";\n  case 3: cout << "c"; break;\n  default: cout << "z";\n}',
          options: ['b', 'bc', 'abc', 'c'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa la condición: mayor de edad **y** con permiso.',
        difficulty: 1,
        payload: {
          template: 'if (edad >= 18 {{0}} permiso {{1}} true) {',
          blanks: ['&&', '=='],
        },
      },
      {
        type: 'bug',
        prompt: 'Este código nunca imprime "par". ¿Qué línea tiene el error?',
        difficulty: 2,
        payload: {
          lines: [
            'int n = 4;',
            'if (n % 2 == 1) {',
            '  cout << "par";',
            '} else {',
            '  cout << "impar";',
            '}',
          ],
          buggyLineIndex: 1,
          explanation:
            'Un número par deja resto 0 al dividir entre 2: la condición debe ser n % 2 == 0.',
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un entero e imprime `par` si es par o `impar` si no lo es.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  if (n % 2 == 0) {\n    cout << "par" << endl;\n  } else {\n    cout << "impar" << endl;\n  }\n${FIN}`,
        difficulty: 1,
        testCases: [
          { input: '4', expectedOutput: 'par', isHidden: false },
          { input: '7', expectedOutput: 'impar', isHidden: false },
          { input: '0', expectedOutput: 'par', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una nota. Imprime `Excelente` si es 9 o más, `Aprobado` si es 6 o más, y `Por mejorar` en otro caso.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int nota;\n  cin >> nota;\n  if (nota >= 9) {\n    cout << "Excelente" << endl;\n  } else if (nota >= 6) {\n    cout << "Aprobado" << endl;\n  } else {\n    cout << "Por mejorar" << endl;\n  }\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '10', expectedOutput: 'Excelente', isHidden: false },
          { input: '7', expectedOutput: 'Aprobado', isHidden: false },
          { input: '3', expectedOutput: 'Por mejorar', isHidden: false },
          { input: '6', expectedOutput: 'Aprobado', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un año e imprime `bisiesto` si lo es o `no bisiesto` si no. Un año es bisiesto si es divisible entre 4 y no entre 100, o si es divisible entre 400.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int anio;\n  cin >> anio;\n  bool bisiesto = (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;\n  cout << (bisiesto ? "bisiesto" : "no bisiesto") << endl;\n${FIN}`,
        difficulty: 3,
        testCases: [
          { input: '2024', expectedOutput: 'bisiesto', isHidden: false },
          { input: '1900', expectedOutput: 'no bisiesto', isHidden: false },
          { input: '2000', expectedOutput: 'bisiesto', isHidden: true },
          { input: '2023', expectedOutput: 'no bisiesto', isHidden: true },
        ],
      },
    ],
  },
];
