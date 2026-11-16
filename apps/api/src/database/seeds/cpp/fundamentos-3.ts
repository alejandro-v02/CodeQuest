import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES, PLANTILLA } from './common';

// Fundamentos, lecciones 6-7.
export const fundamentosParte3: SeedLesson[] = [
  {
    title: 'Arrays y vectores',
    xpReward: 10,
    contentMarkdown: md`
# Arrays y vectores

Una colección guarda varios valores del **mismo tipo** bajo un solo nombre. En C++ moderno lo habitual es usar §vector§.

## vector

§§§cpp
#include <vector>

vector<int> notas = {8, 6, 9};
notas.push_back(7); // agrega al final
cout << notas[0] << endl; // 8 (el primer elemento es el índice 0)
cout << notas.size() << endl; // 4
§§§

- §vector<int>§ es una lista de enteros; el tipo va entre §< >§.
- §push_back§ añade un elemento al final.
- §size()§ devuelve cuántos elementos hay.
- Los índices van de §0§ a §size() - 1§.

## Recorrer

§§§cpp
for (int i = 0; i < notas.size(); i++) {
cout << notas[i] << endl;
}

for (int nota : notas) { // for por rangos: cada elemento
cout << nota << endl;
}
§§§

## Fuera de rango

§§§cpp
cout << notas[10]; // compila, pero está FUERA del vector: valor basura o fallo
§§§

C++ **no te avisa**: acceder a un índice que no existe es un error típico. Revisa siempre que el bucle termine en §i < size()§ y no en §i <= size()§.

## Leer N números

§§§cpp
int n;
cin >> n;
vector<int> v(n); // vector con n posiciones
for (int i = 0; i < n; i++) {
cin >> v[i];
}
§§§

## Ordenar

§§§cpp
#include <algorithm>

sort(v.begin(), v.end()); // de menor a mayor
sort(v.begin(), v.end(), greater<int>()); // de mayor a menor
§§§

## Arrays clásicos

§§§cpp
int a[3] = {1, 2, 3}; // tamaño fijo, que no se puede cambiar
§§§

Existen, pero no conocen su propio tamaño ni crecen. Para empezar usa §vector§.

## Recuerda

- §vector§ crece con §push_back§ y sabe su §size()§.
- El primer índice es §0§; el último es §size() - 1§.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'vector<int> v = {5, 7, 9};\nv.push_back(11);\ncout << v.size();',
          options: ['3', '4', '11', '5'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'vector<int> v = {5, 7, 9};\ncout << v[1];',
          options: ['5', '7', '9', '1'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt:
          '¿Cuál es el índice del último elemento de un vector `v` con elementos?',
        difficulty: 2,
        payload: {
          code: 'vector<int> v = {4, 8, 15, 16};',
          options: ['v.size()', 'v.size() - 1', '4', 'v.size() + 1'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara un vector de enteros y agrégale el 8 al final.',
        difficulty: 1,
        payload: {
          template: 'vector<{{0}}> notas;\nnotas.{{1}}(8);',
          blanks: ['int', 'push_back'],
        },
      },
      {
        type: 'bug',
        prompt:
          'Este bucle lee un elemento que no existe. ¿Qué línea tiene el error?',
        difficulty: 2,
        payload: {
          lines: [
            'vector<int> v = {1, 2, 3};',
            'for (int i = 0; i <= v.size(); i++) {',
            '  cout << v[i] << endl;',
            '}',
          ],
          buggyLineIndex: 1,
          explanation:
            'Los índices llegan hasta size() - 1. Con <= se lee v[3], que no existe. Debe ser i < v.size().',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas para sumar los elementos de un vector.',
        difficulty: 2,
        payload: {
          blocks: [
            'vector<int> v = {3, 4, 5};',
            'int suma = 0;',
            'for (int x : v) {',
            '  suma += x;',
            '}',
            'cout << suma << endl;',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N y luego vienen N números enteros. Imprime su suma.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  int suma = 0;\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n    suma += v[i];\n  }\n  cout << suma << endl;\n${FIN}`,
        difficulty: 1,
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '6', isHidden: false },
          { input: '4\n10 -4 7 1', expectedOutput: '14', isHidden: false },
          { input: '1\n5', expectedOutput: '5', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N y luego vienen N números enteros. Imprime el mayor.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  int mayor = v[0];\n  for (int x : v) {\n    if (x > mayor) {\n      mayor = x;\n    }\n  }\n  cout << mayor << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '3\n3 9 2', expectedOutput: '9', isHidden: false },
          { input: '3\n-5 -2 -9', expectedOutput: '-2', isHidden: false },
          { input: '1\n7', expectedOutput: '7', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N y luego vienen N números. Imprime los pares, separados por un espacio, en el mismo orden.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> pares;\n  for (int i = 0; i < n; i++) {\n    int x;\n    cin >> x;\n    if (x % 2 == 0) {\n      pares.push_back(x);\n    }\n  }\n  for (int i = 0; i < pares.size(); i++) {\n    if (i > 0) {\n      cout << " ";\n    }\n    cout << pares[i];\n  }\n  cout << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '6\n1 2 3 4 5 6', expectedOutput: '2 4 6', isHidden: false },
          { input: '3\n10 15 20', expectedOutput: '10 20', isHidden: false },
          { input: '3\n8 8 3', expectedOutput: '8 8', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N y luego vienen N números. Imprímelos ordenados de menor a mayor, separados por un espacio.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  sort(v.begin(), v.end());\n  for (int i = 0; i < n; i++) {\n    if (i > 0) {\n      cout << " ";\n    }\n    cout << v[i];\n  }\n  cout << endl;\n${FIN}`,
        difficulty: 3,
        testCases: [
          { input: '4\n5 3 9 1', expectedOutput: '1 3 5 9', isHidden: false },
          { input: '3\n10 9 1', expectedOutput: '1 9 10', isHidden: false },
          { input: '3\n2 2 1', expectedOutput: '1 2 2', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Structs',
    xpReward: 10,
    contentMarkdown: md`
# Structs

Un **struct** agrupa datos relacionados bajo un solo nombre: es tu propio tipo de dato.

## Definir y usar un struct

§§§cpp
struct Persona {
string nombre;
int edad;
};

int main() {
Persona ana;
ana.nombre = "Ana";
ana.edad = 20;

Persona luis = {"Luis", 31};

cout << ana.nombre << " tiene " << ana.edad << endl;
return 0;
}
§§§

- §struct Persona { ... };§ define la forma. **Termina con §;§.**
- Cada dato del struct se llama **miembro** (§nombre§, §edad§).
- Se accede a un miembro con un punto: §ana.edad§.
- §Persona§ ya es un tipo: puedes crear variables, pasarlas a funciones y guardarlas en vectores.

## Vectores de structs

§§§cpp
vector<Persona> grupo;
grupo.push_back({"Ana", 20});
grupo.push_back({"Luis", 31});

for (Persona p : grupo) {
cout << p.nombre << endl;
}
§§§

## Funciones con structs

§§§cpp
void presentar(Persona p) {
cout << p.nombre << " (" << p.edad << ")" << endl;
}
§§§

## Errores típicos

- Olvidar el §;§ final de la definición: el error del compilador apunta a la línea **siguiente**.
- Escribir un miembro mal (§ana.nmbre§): el compilador dice que no existe.
- Asignar un tipo incorrecto (§ana.edad = "veinte"§): no compila.

## Recuerda

- Un struct describe una "cosa" con varios datos.
- Es el paso previo a las clases, que además le añaden comportamiento.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Cómo se accede a la edad de `ana`?',
        difficulty: 1,
        payload: {
          code: 'struct Persona {\n  string nombre;\n  int edad;\n};\nPersona ana = {"Ana", 20};',
          options: ['ana->edad', 'ana.edad', 'ana[edad]', 'Persona.edad'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'struct Punto {\n  int x;\n  int y;\n};\nPunto p = {3, 4};\ncout << p.x + p.y;',
          options: ['34', '7', '3', 'Error de compilación'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué le pasa a esta definición?',
        difficulty: 2,
        payload: {
          code: 'struct Punto {\n  int x;\n  int y;\n}\n\nint main() {\n  Punto p;\n}',
          options: [
            'Funciona sin problema',
            'Error: falta el ; después de la llave de cierre',
            'Error: x e y deben ser double',
            'Error: main no puede ir después',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa la definición del struct.',
        difficulty: 1,
        payload: {
          template: '{{0}} Punto {\n  int x;\n  int y;\n}{{1}}',
          blanks: ['struct', ';'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'struct Persona { string nombre; int edad; };',
            'Persona p;',
            'p.nombre = "Ana";',
            'p.edad = "veinte";',
          ],
          buggyLineIndex: 3,
          explanation:
            'edad es un int: no se le puede asignar el texto "veinte".',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: define el struct, crea una persona e imprímela.',
        difficulty: 2,
        payload: {
          blocks: [
            'struct Persona {',
            '  string nombre;',
            '};',
            'Persona p = {"Ana"};',
            'cout << p.nombre << endl;',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (una palabra) y una edad. Guárdalos en un struct `Persona` e imprime `nombre (edad)`.',
        starterCode: `${INCLUDES}struct Persona {\n  string nombre;\n  int edad;\n};\n\nint main() {\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}struct Persona {\n  string nombre;\n  int edad;\n};\n\nint main() {\n  Persona p;\n  cin >> p.nombre >> p.edad;\n  cout << p.nombre << " (" << p.edad << ")" << endl;\n  return 0;\n}\n`,
        difficulty: 1,
        testCases: [
          { input: 'Ana\n20', expectedOutput: 'Ana (20)', isHidden: false },
          { input: 'Luis 31', expectedOutput: 'Luis (31)', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee nombre, precio y cantidad (en ese orden). Imprime `Total de <nombre>: <total>` con 2 decimales, donde total = precio × cantidad.',
        starterCode: `${INCLUDES}struct Producto {\n  string nombre;\n  double precio;\n  int cantidad;\n};\n\nint main() {\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}struct Producto {\n  string nombre;\n  double precio;\n  int cantidad;\n};\n\nint main() {\n  Producto p;\n  cin >> p.nombre >> p.precio >> p.cantidad;\n  double total = p.precio * p.cantidad;\n  cout << "Total de " << p.nombre << ": " << fixed << setprecision(2) << total << endl;\n  return 0;\n}\n`,
        difficulty: 2,
        testCases: [
          {
            input: 'Cuaderno\n2500\n3',
            expectedOutput: 'Total de Cuaderno: 7500.00',
            isHidden: false,
          },
          {
            input: 'Lapiz\n0.5\n10',
            expectedOutput: 'Total de Lapiz: 5.00',
            isHidden: false,
          },
          {
            input: 'Regla 1200 1',
            expectedOutput: 'Total de Regla: 1200.00',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N; las N siguientes son `nombre nota`. Imprime el nombre del estudiante con la nota más alta (si hay empate, el primero).',
        starterCode: `${INCLUDES}struct Estudiante {\n  string nombre;\n  double nota;\n};\n\nint main() {\n  int n;\n  cin >> n;\n  vector<Estudiante> estudiantes;\n  // TODO\n  return 0;\n}\n`,
        solution: `${INCLUDES}struct Estudiante {\n  string nombre;\n  double nota;\n};\n\nint main() {\n  int n;\n  cin >> n;\n  vector<Estudiante> estudiantes;\n  for (int i = 0; i < n; i++) {\n    Estudiante e;\n    cin >> e.nombre >> e.nota;\n    estudiantes.push_back(e);\n  }\n  Estudiante mejor = estudiantes[0];\n  for (Estudiante e : estudiantes) {\n    if (e.nota > mejor.nota) {\n      mejor = e;\n    }\n  }\n  cout << mejor.nombre << endl;\n  return 0;\n}\n`,
        difficulty: 3,
        testCases: [
          {
            input: '3\nAna 8\nLuis 9\nMaria 7',
            expectedOutput: 'Luis',
            isHidden: false,
          },
          {
            input: '2\nPedro 5\nSofia 5.5',
            expectedOutput: 'Sofia',
            isHidden: false,
          },
          { input: '2\nA 6\nB 6', expectedOutput: 'A', isHidden: true },
        ],
      },
    ],
  },
];
