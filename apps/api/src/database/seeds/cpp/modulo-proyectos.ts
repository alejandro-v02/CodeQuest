import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { INCLUDES } from './common';

export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    {
      title: 'Proyecto: calculadora',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: calculadora

Vas a construir una calculadora que lee operaciones como §6 + 3§ y calcula el resultado, tratando los casos especiales.

## Paso 1: leer la operación

§cin >>§ separa por espacios, así que una línea como §6 + 3§ se lee directamente en tres variables:

§§§cpp
double a, b;
char op;
cin >> a >> op >> b;
§§§

§op§ es un §char§: guarda un solo carácter (§'+'§, §'-'§, §'*'§ o §'/'§).

## Paso 2: la función que calcula

§§§cpp
double calcular(double a, char op, double b) {
switch (op) {
case '+': return a + b;
case '-': return a - b;
case '*': return a * b;
default: return a / b;
}
}
§§§

## Paso 3: casos especiales

La división entre cero no es un error de compilación, así que hay que tratarla tú:

§§§cpp
if (op == '/' && b == 0) {
cout << "error" << endl;
} else {
cout << fixed << setprecision(2) << calcular(a, op, b) << endl;
}
§§§

## Paso 4: varias operaciones

Para procesar todas las líneas de la entrada:

§§§cpp
while (cin >> a >> op >> b) {
// calcular e imprimir cada una
}
§§§

## Qué has practicado

Lectura con §cin§, §char§, §switch§, funciones, formato de decimales y casos límite.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código con la entrada `6 / 4`?',
          difficulty: 1,
          payload: {
            code: "double a, b;\nchar op;\ncin >> a >> op >> b;\nif (op == '/') cout << a / b;",
            options: ['1', '1.5', '2', '6 / 4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué tipo se usa para guardar un solo carácter como `+`?',
          difficulty: 1,
          payload: {
            code: "____ op = '+';",
            options: ['string', 'int', 'char', 'bool'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa el `switch` para que `-` reste.',
          difficulty: 2,
          payload: {
            template:
              "switch (op) {\n  case '+': return a + b;\n  {{0}} '-': return a - b;\n  {{1}}: return a * b;\n}",
            blanks: ['case', 'default'],
          },
        },
        {
          type: 'bug',
          prompt:
            'La calculadora suma cuando debería restar. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'double calcular(double a, char op, double b) {',
              "  if (op == '+') return a + b;",
              "  if (op == '-') return a + b;",
              '  return a * b;',
              '}',
            ],
            buggyLineIndex: 2,
            explanation: "Para '-' debe devolver a - b, no a + b.",
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que leen una operación y la calculan.',
          difficulty: 2,
          payload: {
            blocks: [
              'double a, b;',
              'char op;',
              'cin >> a >> op >> b;',
              'cout << calcular(a, op, b) << endl;',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una operación como `6 + 3` (`+ - * /`) e imprime el resultado con 2 decimales. Si divides entre cero, imprime `error`.',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  cin >> a >> op >> b;\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  cin >> a >> op >> b;\n  if (op == '/' && b == 0) {\n    cout << "error" << endl;\n  } else {\n    cout << fixed << setprecision(2) << calcular(a, op, b) << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '6 + 3', expectedOutput: '9.00', isHidden: false },
            { input: '10 / 4', expectedOutput: '2.50', isHidden: false },
            { input: '5 / 0', expectedOutput: 'error', isHidden: false },
            { input: '7 * 6', expectedOutput: '42.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación (`a op b`). Imprime el resultado de cada una con 2 decimales, en su línea; si divide entre cero, imprime `error`.',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  while (cin >> a >> op >> b) {\n    // TODO\n  }\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  while (cin >> a >> op >> b) {\n    if (op == '/' && b == 0) {\n      cout << "error" << endl;\n    } else {\n      cout << fixed << setprecision(2) << calcular(a, op, b) << endl;\n    }\n  }\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '1 + 2\n8 / 2',
              expectedOutput: '3.00\n4.00',
              isHidden: false,
            },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '20.00\nerror\n-1.00',
              isHidden: false,
            },
            { input: '2 - 2', expectedOutput: '0.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación. Imprime la **suma de todos los resultados** con 2 decimales (ignora las divisiones entre cero).',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  double total = 0;\n  while (cin >> a >> op >> b) {\n    // TODO\n  }\n  cout << fixed << setprecision(2) << total << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  double total = 0;\n  while (cin >> a >> op >> b) {\n    if (op == '/' && b == 0) {\n      continue;\n    }\n    total += calcular(a, op, b);\n  }\n  cout << fixed << setprecision(2) << total << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '1 + 2\n8 / 2', expectedOutput: '7.00', isHidden: false },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '19.00',
              isHidden: false,
            },
            { input: '5 / 0', expectedOutput: '0.00', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Proyecto: inventario',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: inventario

Vas a construir un pequeño inventario de tienda: registrar productos, venderlos y revisar cuánto queda.

## Paso 1: modelar un producto

§§§cpp
struct Producto {
string nombre;
int cantidad;
double precio;
};

vector<Producto> inventario;
§§§

## Paso 2: leer los productos

Cada línea tiene §nombre cantidad precio§. Con §cin§ se lee hasta el final de la entrada:

§§§cpp
Producto p;
while (cin >> p.nombre >> p.cantidad >> p.precio) {
inventario.push_back(p);
}
§§§

## Paso 3: buscar un producto

Devolver un **puntero** permite distinguir "lo encontré" de "no existe":

§§§cpp
Producto* buscar(vector<Producto>& inv, const string& nombre) {
for (Producto& p : inv) {
if (p.nombre == nombre) {
return &p;
}
}
return nullptr;
}
§§§

Quien lo use debe comprobar el resultado antes de usarlo:

§§§cpp
Producto* p = buscar(inventario, "lapiz");
if (p != nullptr) {
p->cantidad -= 1; // con puntero se usa la flecha
}
§§§

## Paso 4: calcular

§§§cpp
double valorTotal(const vector<Producto>& inv) {
double total = 0;
for (const Producto& p : inv) {
total += p.cantidad * p.precio;
}
return total;
}
§§§

## Qué has practicado

Structs, vectores de structs, referencias, punteros que pueden ser §nullptr§, §const§ y acumuladores.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué devuelve `buscar` cuando el producto no existe?',
          difficulty: 1,
          payload: {
            code: 'Producto* buscar(vector<Producto>& inv, const string& nombre) {\n  for (Producto& p : inv) {\n    if (p.nombre == nombre) return &p;\n  }\n  return nullptr;\n}',
            options: [
              'Un producto vacío',
              'nullptr (un puntero que no apunta a nada)',
              'Lanza una excepción',
              '0 siempre',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Cuál es el valor total de este inventario?',
          difficulty: 2,
          payload: {
            code: 'vector<Producto> inv = {\n  {"lapiz", 10, 2.0},\n  {"cuaderno", 3, 5.0},\n};\n// valorTotal suma cantidad * precio de cada producto',
            options: ['15', '35', '65', '20'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Accede a la cantidad de un producto a través de su puntero.',
          difficulty: 2,
          payload: {
            template:
              'Producto* p = buscar(inventario, "lapiz");\nif (p != {{0}}) {\n  p{{1}}cantidad -= 1;\n}',
            blanks: ['nullptr', '->'],
          },
        },
        {
          type: 'bug',
          prompt:
            'Este código falla al ejecutarse si el producto no existe. ¿Qué línea es la que falla?',
          difficulty: 3,
          payload: {
            lines: [
              'void vender(vector<Producto>& inv, const string& nombre) {',
              '  Producto* p = buscar(inv, nombre);',
              '  p->cantidad -= 1;',
              '}',
            ],
            buggyLineIndex: 2,
            explanation:
              'buscar puede devolver nullptr: desreferenciarlo cierra el programa. Hay que comprobar if (p != nullptr) antes.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas de la función que calcula el valor total.',
          difficulty: 2,
          payload: {
            blocks: [
              'double valorTotal(const vector<Producto>& inv) {',
              '  double total = 0;',
              '  for (const Producto& p : inv) {',
              '    total += p.cantidad * p.precio;',
              '  }',
              '  return total;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre cantidad precio`. Imprime el valor total del inventario (suma de cantidad × precio) con 2 decimales.',
          starterCode: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n  double precio;\n};\n\ndouble valorTotal(const vector<Producto>& inv) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  vector<Producto> inventario;\n  Producto p;\n  while (cin >> p.nombre >> p.cantidad >> p.precio) {\n    inventario.push_back(p);\n  }\n  cout << fixed << setprecision(2) << valorTotal(inventario) << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n  double precio;\n};\n\ndouble valorTotal(const vector<Producto>& inv) {\n  double total = 0;\n  for (const Producto& p : inv) {\n    total += p.cantidad * p.precio;\n  }\n  return total;\n}\n\nint main() {\n  vector<Producto> inventario;\n  Producto p;\n  while (cin >> p.nombre >> p.cantidad >> p.precio) {\n    inventario.push_back(p);\n  }\n  cout << fixed << setprecision(2) << valorTotal(inventario) << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'lapiz 10 2\ncuaderno 3 5',
              expectedOutput: '35.00',
              isHidden: false,
            },
            { input: 'regla 4 1.5', expectedOutput: '6.00', isHidden: false },
            {
              input: 'a 1 1\nb 2 2\nc 3 3',
              expectedOutput: '14.00',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre cantidad precio`. Imprime los nombres de los productos con **menos de 5 unidades**, uno por línea y en el mismo orden. Si no hay ninguno, imprime `todo en orden`.',
          starterCode: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n  double precio;\n};\n\nint main() {\n  vector<Producto> inventario;\n  Producto p;\n  while (cin >> p.nombre >> p.cantidad >> p.precio) {\n    inventario.push_back(p);\n  }\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n  double precio;\n};\n\nint main() {\n  vector<Producto> inventario;\n  Producto p;\n  while (cin >> p.nombre >> p.cantidad >> p.precio) {\n    inventario.push_back(p);\n  }\n  bool hayBajos = false;\n  for (const Producto& item : inventario) {\n    if (item.cantidad < 5) {\n      cout << item.nombre << endl;\n      hayBajos = true;\n    }\n  }\n  if (!hayBajos) {\n    cout << "todo en orden" << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'lapiz 10 2\ncuaderno 3 5\nregla 4 1',
              expectedOutput: 'cuaderno\nregla',
              isHidden: false,
            },
            {
              input: 'goma 9 1',
              expectedOutput: 'todo en orden',
              isHidden: false,
            },
            { input: 'a 5 1\nb 4 1', expectedOutput: 'b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Las líneas son comandos: `agregar <nombre> <cantidad>` suma unidades (crea el producto si no existe) y `vender <nombre> <cantidad>` las resta (si no hay suficientes, ignora la venta). Al final imprime `<nombre>: <cantidad>` por producto, en el orden en que aparecieron.',
          starterCode: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n};\n\nProducto* buscar(vector<Producto>& inv, const string& nombre) {\n  // TODO\n  return nullptr;\n}\n\nint main() {\n  vector<Producto> inventario;\n  string comando, nombre;\n  int cantidad;\n  while (cin >> comando >> nombre >> cantidad) {\n    // TODO\n  }\n  for (const Producto& p : inventario) {\n    cout << p.nombre << ": " << p.cantidad << endl;\n  }\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Producto {\n  string nombre;\n  int cantidad;\n};\n\nProducto* buscar(vector<Producto>& inv, const string& nombre) {\n  for (Producto& p : inv) {\n    if (p.nombre == nombre) {\n      return &p;\n    }\n  }\n  return nullptr;\n}\n\nint main() {\n  vector<Producto> inventario;\n  string comando, nombre;\n  int cantidad;\n  while (cin >> comando >> nombre >> cantidad) {\n    Producto* existente = buscar(inventario, nombre);\n    if (comando == "agregar") {\n      if (existente != nullptr) {\n        existente->cantidad += cantidad;\n      } else {\n        inventario.push_back({nombre, cantidad});\n      }\n    } else if (existente != nullptr && existente->cantidad >= cantidad) {\n      existente->cantidad -= cantidad;\n    }\n  }\n  for (const Producto& p : inventario) {\n    cout << p.nombre << ": " << p.cantidad << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'agregar lapiz 10\nvender lapiz 4',
              expectedOutput: 'lapiz: 6',
              isHidden: false,
            },
            {
              input: 'agregar a 5\nagregar b 2\nvender a 9\nagregar a 1',
              expectedOutput: 'a: 6\nb: 2',
              isHidden: false,
            },
            {
              input: 'vender x 1\nagregar x 3',
              expectedOutput: 'x: 3',
              isHidden: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: notas de estudiantes

Vas a procesar las notas de un grupo: calcular promedios, decidir quién aprueba y encontrar al mejor estudiante.

## Paso 1: modelar los datos

§§§cpp
struct Estudiante {
string nombre;
vector<double> notas;
};
§§§

Un estudiante tiene un nombre y **una cantidad variable de notas**, por eso las notas son un §vector§.

## Paso 2: leer una línea con varias notas

Cada línea tiene §nombre nota1 nota2 ...§. Se lee la línea completa y se separa con un §stringstream§:

§§§cpp
string linea;
while (getline(cin, linea)) {
stringstream flujo(linea);
Estudiante e;
flujo >> e.nombre;
double nota;
while (flujo >> nota) {
e.notas.push_back(nota);
}
estudiantes.push_back(e);
}
§§§

## Paso 3: funciones pequeñas

§§§cpp
double promedio(const vector<double>& notas) {
double suma = 0;
for (double n : notas) {
suma += n;
}
return suma / notas.size();
}

string estado(double prom) {
return prom >= 6 ? "aprobado" : "reprobado";
}
§§§

## Paso 4: recorrer el grupo

§§§cpp
for (const Estudiante& e : estudiantes) {
double p = promedio(e.notas);
cout << e.nombre << " " << fixed << setprecision(1) << p << " " << estado(p) << endl;
}
§§§

## Paso 5: buscar al mejor

Se guarda el mejor visto hasta ahora y se compara con cada estudiante; con §>§ (y no §>=§) gana el primero en caso de empate.

## Qué has practicado

Structs con vectores, §getline§ + §stringstream§, funciones con §const&§, recorridos y búsqueda del máximo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Cuál es el promedio de estas notas?',
          difficulty: 1,
          payload: {
            code: 'vector<double> notas = {4, 6, 8};\ndouble suma = 0;\nfor (double n : notas) suma += n;\ncout << suma / notas.size();',
            options: ['4', '6', '8', '18'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué hace este bucle con la línea `Ana 8 6 7`?',
          difficulty: 2,
          payload: {
            code: 'stringstream flujo(linea);\nstring nombre;\nflujo >> nombre;\ndouble nota;\nint cuantas = 0;\nwhile (flujo >> nota) cuantas++;',
            options: [
              'Lee el nombre y cuenta 3 notas',
              'Lee el nombre y cuenta 4 valores',
              'Cuenta 0 notas',
              'No compila',
            ],
            correctIndex: 0,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa la función que decide el estado del estudiante.',
          difficulty: 2,
          payload: {
            template:
              'string estado(double prom) {\n  return prom {{0}} 6 ? "aprobado" : "reprobado";\n}',
            blanks: ['>='],
          },
        },
        {
          type: 'bug',
          prompt: 'El promedio sale mal. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'double promedio(const vector<double>& notas) {',
              '  double suma = 0;',
              '  for (double n : notas) suma += n;',
              '  return suma / 2;',
              '}',
            ],
            buggyLineIndex: 3,
            explanation:
              'Hay que dividir entre la cantidad de notas (notas.size()), no entre 2.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas que separan el nombre y las notas de una línea de texto.',
          difficulty: 3,
          payload: {
            blocks: [
              'stringstream flujo(linea);',
              'Estudiante e;',
              'flujo >> e.nombre;',
              'double nota;',
              'while (flujo >> nota) {',
              '  e.notas.push_back(nota);',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime por estudiante `nombre promedio estado`, con el promedio a 1 decimal. Aprueba con promedio mayor o igual a 6.',
          starterCode: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  // TODO\n  return 0;\n}\n\nstring estado(double prom) {\n  // TODO\n  return "";\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  double suma = 0;\n  for (double n : notas) {\n    suma += n;\n  }\n  return suma / notas.size();\n}\n\nstring estado(double prom) {\n  return prom >= 6 ? "aprobado" : "reprobado";\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  for (const Estudiante& e : estudiantes) {\n    double p = promedio(e.notas);\n    cout << e.nombre << " " << fixed << setprecision(1) << p << " " << estado(p) << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'Ana 8 6 7',
              expectedOutput: 'Ana 7.0 aprobado',
              isHidden: false,
            },
            {
              input: 'Luis 4 5\nEva 9 10',
              expectedOutput: 'Luis 4.5 reprobado\nEva 9.5 aprobado',
              isHidden: false,
            },
            {
              input: 'Zoe 6',
              expectedOutput: 'Zoe 6.0 aprobado',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime el nombre del estudiante con el mejor promedio (si hay empate, el que aparece primero).',
          starterCode: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  double suma = 0;\n  for (double n : notas) {\n    suma += n;\n  }\n  return suma / notas.size();\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  Estudiante mejor = estudiantes[0];\n  for (const Estudiante& e : estudiantes) {\n    if (promedio(e.notas) > promedio(mejor.notas)) {\n      mejor = e;\n    }\n  }\n  cout << mejor.nombre << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'Ana 8 6 7\nLuis 9 9\nEva 5 5',
              expectedOutput: 'Luis',
              isHidden: false,
            },
            {
              input: 'Pedro 7 7\nSofia 7 7',
              expectedOutput: 'Pedro',
              isHidden: false,
            },
            { input: 'Zoe 10', expectedOutput: 'Zoe', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime en una sola línea `aprobados reprobados` (cuántos estudiantes aprueban con promedio ≥ 6 y cuántos no).',
          starterCode: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}struct Estudiante {\n  string nombre;\n  vector<double> notas;\n};\n\ndouble promedio(const vector<double>& notas) {\n  double suma = 0;\n  for (double n : notas) {\n    suma += n;\n  }\n  return suma / notas.size();\n}\n\nint main() {\n  vector<Estudiante> estudiantes;\n  string linea;\n  while (getline(cin, linea)) {\n    stringstream flujo(linea);\n    Estudiante e;\n    flujo >> e.nombre;\n    double nota;\n    while (flujo >> nota) {\n      e.notas.push_back(nota);\n    }\n    estudiantes.push_back(e);\n  }\n  int aprobados = 0, reprobados = 0;\n  for (const Estudiante& e : estudiantes) {\n    if (promedio(e.notas) >= 6) {\n      aprobados++;\n    } else {\n      reprobados++;\n    }\n  }\n  cout << aprobados << " " << reprobados << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'Ana 8 6 7\nLuis 4 5\nEva 9 10',
              expectedOutput: '2 1',
              isHidden: false,
            },
            { input: 'Zoe 3', expectedOutput: '0 1', isHidden: false },
            { input: 'A 6\nB 6\nC 5', expectedOutput: '2 1', isHidden: true },
          ],
        },
      ],
    },
  ],
};
