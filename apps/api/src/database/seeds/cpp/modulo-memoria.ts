import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { INCLUDES, PLANTILLA } from './common';

export const moduloMemoria: SeedModule = {
  title: 'Funciones y memoria',
  lessons: [
    {
      title: 'Parámetros y retorno',
      xpReward: 10,
      contentMarkdown: md`
# Parámetros y retorno

Ya sabes escribir funciones. Ahora veremos qué pasa **exactamente** con los valores que les pasas y con los que devuelven.

## Paso por valor

Por defecto, C++ **copia** los argumentos: la función trabaja con su propia copia.

§§§cpp
void incrementar(int n) {
n++; // cambia la copia, no la variable original
}

int main() {
int x = 5;
incrementar(x);
cout << x << endl; // 5 (x no cambió)
return 0;
}
§§§

Para que una función modifique la variable original se necesitan **referencias**, que veremos en la siguiente lección.

## Devolver varios valores

Una función solo devuelve un valor, pero ese valor puede agrupar varios con un §struct§ o un §pair§:

§§§cpp
pair<int, int> minMax(vector<int> v) {
int minimo = v[0], maximo = v[0];
for (int x : v) {
if (x < minimo) minimo = x;
if (x > maximo) maximo = x;
}
return {minimo, maximo};
}

pair<int, int> r = minMax({4, 9, 1});
cout << r.first << " " << r.second << endl; // 1 9
§§§

## Sobrecarga

Puedes tener varias funciones con el **mismo nombre** si sus parámetros son distintos. El compilador elige según los argumentos:

§§§cpp
int doble(int n) { return n * 2; }
double doble(double n) { return n * 2.0; }

cout << doble(3) << endl; // usa la versión int → 6
cout << doble(1.5) << endl; // usa la versión double → 3
§§§

## Recursión

Una función puede llamarse a sí misma. Necesita siempre un **caso base** que detenga la cadena:

§§§cpp
long long factorial(int n) {
if (n <= 1) {
return 1; // caso base
}
return n * factorial(n - 1);
}
§§§

Sin caso base, la función se llama infinitamente hasta agotar la memoria y el programa se cae.

## Recuerda

- Los argumentos se copian: cambiarlos dentro no afecta al original.
- Usa §pair§ o un §struct§ para devolver varios datos.
- Toda recursión necesita un caso base y un paso que se acerque a él.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'void incrementar(int n) {\n  n++;\n}\n\nint main() {\n  int x = 5;\n  incrementar(x);\n  cout << x;\n}',
            options: ['5', '6', '0', 'Error de compilación'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué versión de `doble` se ejecuta con `doble(1.5)`?',
          difficulty: 2,
          payload: {
            code: 'int doble(int n) { return n * 2; }\ndouble doble(double n) { return n * 2.0; }\n\ncout << doble(1.5);',
            options: [
              'La de int (devuelve 2)',
              'La de double (devuelve 3)',
              'Ninguna: error de ambigüedad',
              'Las dos',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué devuelve `factorial(4)`?',
          difficulty: 2,
          payload: {
            code: 'long long factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
            options: ['4', '10', '24', '120'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa el caso base de la recursión.',
          difficulty: 2,
          payload: {
            template:
              'long long factorial(int n) {\n  if (n {{0}} 1) {\n    return {{1}};\n  }\n  return n * factorial(n - 1);\n}',
            blanks: ['<=', '1'],
          },
        },
        {
          type: 'bug',
          prompt:
            'Esta función se llama a sí misma sin parar y el programa se cae. ¿Qué línea falta o falla?',
          difficulty: 3,
          payload: {
            lines: [
              'int cuentaAtras(int n) {',
              '  cout << n << endl;',
              '  return cuentaAtras(n - 1);',
              '}',
            ],
            buggyLineIndex: 2,
            explanation:
              'No hay caso base: falta un if (n == 0) return 0; antes de la llamada recursiva.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas de la función recursiva que suma de 1 a n.',
          difficulty: 3,
          payload: {
            blocks: [
              'int sumaHasta(int n) {',
              '  if (n == 0) {',
              '    return 0;',
              '  }',
              '  return n + sumaHasta(n - 1);',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Escribe `fibonacci(n)` de forma recursiva (fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)). Lee n e imprime fib(n).',
          starterCode: `${INCLUDES}int fibonacci(int n) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << fibonacci(n) << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}int fibonacci(int n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << fibonacci(n) << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '10', expectedOutput: '55', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: true },
            { input: '20', expectedOutput: '6765', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Escribe `sumaDigitos(n)` de forma recursiva: la suma de los dígitos de un entero positivo. Lee n e imprime el resultado.',
          starterCode: `${INCLUDES}int sumaDigitos(int n) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << sumaDigitos(n) << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}int sumaDigitos(int n) {\n  if (n < 10) {\n    return n;\n  }\n  return n % 10 + sumaDigitos(n / 10);\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << sumaDigitos(n) << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '1234', expectedOutput: '10', isHidden: false },
            { input: '7', expectedOutput: '7', isHidden: false },
            { input: '99999', expectedOutput: '45', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N y luego vienen N enteros. Con una función que devuelve un `pair`, imprime el mínimo y el máximo separados por un espacio.',
          starterCode: `${INCLUDES}pair<int, int> minMax(vector<int> v) {\n  // TODO\n  return {0, 0};\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  pair<int, int> r = minMax(v);\n  cout << r.first << " " << r.second << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}pair<int, int> minMax(vector<int> v) {\n  int minimo = v[0], maximo = v[0];\n  for (int x : v) {\n    if (x < minimo) minimo = x;\n    if (x > maximo) maximo = x;\n  }\n  return {minimo, maximo};\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  pair<int, int> r = minMax(v);\n  cout << r.first << " " << r.second << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '3\n4 9 1', expectedOutput: '1 9', isHidden: false },
            { input: '3\n-3 -8 0', expectedOutput: '-8 0', isHidden: false },
            { input: '1\n5', expectedOutput: '5 5', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Referencias',
      xpReward: 10,
      contentMarkdown: md`
# Referencias

Una **referencia** es otro nombre para una variable que ya existe. No crea una copia: trabaja directamente sobre la original.

## Declarar una referencia

§§§cpp
int x = 5;
int& r = x; // r es un alias de x
r = 9;
cout << x << endl; // 9 (cambiar r cambia x)
§§§

El símbolo §&§ después del tipo indica "referencia a un entero".

## Paso por referencia

Si un parámetro es una referencia, la función **modifica la variable original**:

§§§cpp
void incrementar(int& n) {
n++;
}

int main() {
int x = 5;
incrementar(x);
cout << x << endl; // 6
return 0;
}
§§§

Es la forma de resolver el problema de la lección anterior (en la que §incrementar§ no cambiaba nada).

## Intercambiar dos valores

§§§cpp
void intercambiar(int& a, int& b) {
int temporal = a;
a = b;
b = temporal;
}
§§§

C++ trae §swap(a, b)§ que hace exactamente esto.

## Referencias en los recorridos

Con §&§ en un §for§ por rangos modificas los elementos del vector; sin §&§ solo cambias una copia:

§§§cpp
vector<int> v = {1, 2, 3};
for (int& x : v) {
x = x * 2; // v queda {2, 4, 6}
}
§§§

## Referencias constantes

Pasar un vector o un texto grande por valor lo **copia entero**, y es lento. Con §const&§ no se copia y además la función no puede modificarlo:

§§§cpp
int suma(const vector<int>& v) {
int total = 0;
for (int x : v) total += x;
return total;
}
§§§

## Parámetros de salida

Una función puede "devolver" varios valores escribiendo en referencias:

§§§cpp
void estadisticas(const vector<int>& v, int& minimo, int& maximo) {
minimo = v[0];
maximo = v[0];
for (int x : v) {
if (x < minimo) minimo = x;
if (x > maximo) maximo = x;
}
}
§§§

## Recuerda

- §int& r = x;§ → §r§ y §x§ son el mismo dato.
- §void f(int& n)§ → la función puede cambiar el original.
- §const vector<int>& v§ → rápido (sin copia) y seguro (sin cambios).
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'int x = 5;\nint& r = x;\nr = 9;\ncout << x;',
            options: ['5', '9', '14', 'Error de compilación'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'void incrementar(int& n) {\n  n++;\n}\n\nint main() {\n  int x = 5;\n  incrementar(x);\n  cout << x;\n}',
            options: ['5', '6', '0', 'Error de compilación'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Cómo queda el vector después del bucle?',
          difficulty: 2,
          payload: {
            code: 'vector<int> v = {1, 2, 3};\nfor (int x : v) {\n  x = x * 2;\n}',
            options: [
              '{2, 4, 6}',
              '{1, 2, 3} (x es una copia)',
              '{1, 4, 9}',
              'Error de compilación',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Haz que la función modifique la variable original.',
          difficulty: 1,
          payload: {
            template: 'void duplicar(int{{0}} n) {\n  n = n * 2;\n}',
            blanks: ['&'],
          },
        },
        {
          type: 'bug',
          prompt:
            'La función no intercambia los valores. ¿Qué línea tiene el problema?',
          difficulty: 2,
          payload: {
            lines: [
              'void intercambiar(int a, int b) {',
              '  int temporal = a;',
              '  a = b;',
              '  b = temporal;',
              '}',
            ],
            buggyLineIndex: 0,
            explanation:
              'Los parámetros se pasan por valor: se cambian las copias. Deben ser referencias: int& a, int& b.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas de la función que intercambia dos enteros.',
          difficulty: 2,
          payload: {
            blocks: [
              'void intercambiar(int& a, int& b) {',
              '  int temporal = a;',
              '  a = b;',
              '  b = temporal;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros `a` y `b`. Con una función `intercambiar(int& a, int& b)`, imprime primero `b` y luego `a`, separados por un espacio.',
          starterCode: `${INCLUDES}void intercambiar(int& a, int& b) {\n  // TODO\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  intercambiar(a, b);\n  cout << a << " " << b << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}void intercambiar(int& a, int& b) {\n  int temporal = a;\n  a = b;\n  b = temporal;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  intercambiar(a, b);\n  cout << a << " " << b << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '3\n8', expectedOutput: '8 3', isHidden: false },
            { input: '10 -2', expectedOutput: '-2 10', isHidden: false },
            { input: '5 5', expectedOutput: '5 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N y luego vienen N enteros. Duplica cada elemento recorriendo el vector con referencias e imprímelos separados por un espacio.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  for (int& x : v) {\n    x = x * 2;\n  }\n  for (int i = 0; i < n; i++) {\n    if (i > 0) {\n      cout << " ";\n    }\n    cout << v[i];\n  }\n  cout << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '3\n1 2 3', expectedOutput: '2 4 6', isHidden: false },
            { input: '2\n-5 10', expectedOutput: '-10 20', isHidden: false },
            { input: '1\n0', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N y luego N enteros. Escribe `estadisticas(v, minimo, maximo)` con parámetros de salida e imprime el mínimo y el máximo separados por un espacio.',
          starterCode: `${INCLUDES}void estadisticas(const vector<int>& v, int& minimo, int& maximo) {\n  // TODO\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  int minimo, maximo;\n  estadisticas(v, minimo, maximo);\n  cout << minimo << " " << maximo << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}void estadisticas(const vector<int>& v, int& minimo, int& maximo) {\n  minimo = v[0];\n  maximo = v[0];\n  for (int x : v) {\n    if (x < minimo) minimo = x;\n    if (x > maximo) maximo = x;\n  }\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  int minimo, maximo;\n  estadisticas(v, minimo, maximo);\n  cout << minimo << " " << maximo << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '4\n4 9 1 7', expectedOutput: '1 9', isHidden: false },
            { input: '2\n-3 -8', expectedOutput: '-8 -3', isHidden: false },
            { input: '1\n6', expectedOutput: '6 6', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Punteros',
      xpReward: 10,
      contentMarkdown: md`
# Punteros

Todas las variables viven en algún lugar de la memoria, y cada lugar tiene una **dirección**. Un **puntero** es una variable que guarda la dirección de otra.

## Dirección y puntero

§§§cpp
int x = 5;
int* p = &x; // p guarda la dirección de x

cout << p << endl; // una dirección (un número largo en hexadecimal)
cout << *p << endl; // 5 (el valor que hay en esa dirección)
*p = 8;
cout << x << endl; // 8 (cambiar *p cambia x)
§§§

- §&x§ → "la dirección de §x§".
- §int*§ → "puntero a un entero".
- §*p§ → "lo que hay en la dirección a la que apunta §p§" (se llama **desreferenciar**).

## nullptr: el puntero que no apunta a nada

§§§cpp
int* p = nullptr; // vale "nada"
if (p != nullptr) {
cout << *p << endl; // solo se usa si apunta a algo
}
§§§

Desreferenciar un puntero nulo (§*p§ con §p == nullptr§) **cierra el programa de golpe**. Es uno de los errores más comunes en C++.

## Punteros como parámetros

Antes de las referencias, así se modificaban variables ajenas:

§§§cpp
void intercambiar(int* a, int* b) {
int temporal = *a;
*a = *b;
*b = temporal;
}

int x = 1, y = 2;
intercambiar(&x, &y);
§§§

Hoy se prefiere la referencia, pero verás punteros en muchísimo código.

## Memoria dinámica: new y delete

Con §new§ pides memoria durante la ejecución; con §delete§ la devuelves:

§§§cpp
int n = 3;
int* datos = new int[n]; // un arreglo de n enteros en memoria dinámica
for (int i = 0; i < n; i++) {
datos[i] = i * 10;
}
delete[] datos; // ¡siempre liberar lo que se pidió con new!
§§§

Si olvidas §delete§, la memoria queda ocupada hasta que el programa termina (una **fuga de memoria**). Si usas el puntero **después** de liberarlo, el comportamiento es indefinido.

En la práctica diaria §vector§ hace todo esto por ti, y por eso es la opción recomendada.

## Recuerda

- §&§ obtiene una dirección y §*§ accede al valor apuntado.
- Comprueba que un puntero no sea §nullptr§ antes de usarlo.
- Todo §new§ necesita su §delete§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'int x = 5;\nint* p = &x;\n*p = 8;\ncout << x;',
            options: ['5', '8', 'Una dirección', 'Error de compilación'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué significa `*p` en esta línea?',
          difficulty: 1,
          payload: {
            code: 'int x = 5;\nint* p = &x;\ncout << *p;',
            options: [
              'La dirección de p',
              'El valor al que apunta p',
              'Un puntero a p',
              'Multiplicar p por algo',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué pasa al ejecutar este código?',
          difficulty: 2,
          payload: {
            code: 'int* p = nullptr;\ncout << *p;',
            options: [
              'Imprime 0',
              'El programa se cierra con un error (desreferencia de un puntero nulo)',
              'Imprime nullptr',
              'Error de compilación',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Haz que `p` apunte a `x`.',
          difficulty: 1,
          payload: {
            template: 'int x = 5;\nint{{0}} p = {{1}}x;',
            blanks: ['*', '&'],
          },
        },
        {
          type: 'bug',
          prompt:
            'El programa se cierra al ejecutarse. ¿Qué línea causa el problema?',
          difficulty: 2,
          payload: {
            lines: ['int* p = nullptr;', '*p = 5;', 'cout << *p << endl;'],
            buggyLineIndex: 1,
            explanation:
              'p no apunta a ninguna variable: escribir en *p con p nulo cierra el programa. Primero debe apuntar a algo (int x; p = &x;).',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas de la función que intercambia dos enteros con punteros.',
          difficulty: 3,
          payload: {
            blocks: [
              'void intercambiar(int* a, int* b) {',
              '  int temporal = *a;',
              '  *a = *b;',
              '  *b = temporal;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros. Con una función `intercambiar(int* a, int* b)` que usa punteros, imprime primero el segundo y luego el primero.',
          starterCode: `${INCLUDES}void intercambiar(int* a, int* b) {\n  // TODO\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  intercambiar(&a, &b);\n  cout << a << " " << b << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}void intercambiar(int* a, int* b) {\n  int temporal = *a;\n  *a = *b;\n  *b = temporal;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  intercambiar(&a, &b);\n  cout << a << " " << b << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '3\n8', expectedOutput: '8 3', isHidden: false },
            { input: '10 -2', expectedOutput: '-2 10', isHidden: false },
            { input: '5 5', expectedOutput: '5 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un entero `x`. Crea un puntero a `x`, súmale 10 **a través del puntero** e imprime `x`.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  int x;\n  cin >> x;\n  int* p = &x;\n  *p = *p + 10;\n  cout << x << endl;\n  return 0;\n}\n`,
          difficulty: 1,
          testCases: [
            { input: '5', expectedOutput: '15', isHidden: false },
            { input: '-10', expectedOutput: '0', isHidden: false },
            { input: '100', expectedOutput: '110', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N y luego N enteros. Guárdalos en un arreglo dinámico (`new int[n]`), imprime su suma y libera la memoria con `delete[]`.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  int* datos = new int[n];\n  int suma = 0;\n  for (int i = 0; i < n; i++) {\n    cin >> datos[i];\n    suma += datos[i];\n  }\n  cout << suma << endl;\n  delete[] datos;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '3\n1 2 3', expectedOutput: '6', isHidden: false },
            { input: '4\n10 -4 7 1', expectedOutput: '14', isHidden: false },
            { input: '1\n5', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La primera línea es N y luego N enteros. Escribe `int* mayor(vector<int>& v)`, que devuelve un puntero al elemento mayor, e imprime ese valor y su posición (índice), separados por un espacio.',
          starterCode: `${INCLUDES}int* mayor(vector<int>& v) {\n  // TODO\n  return &v[0];\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  int* p = mayor(v);\n  cout << *p << " " << (p - &v[0]) << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}int* mayor(vector<int>& v) {\n  int* mejor = &v[0];\n  for (int i = 1; i < v.size(); i++) {\n    if (v[i] > *mejor) {\n      mejor = &v[i];\n    }\n  }\n  return mejor;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v(n);\n  for (int i = 0; i < n; i++) {\n    cin >> v[i];\n  }\n  int* p = mayor(v);\n  cout << *p << " " << (p - &v[0]) << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '4\n3 9 2 9', expectedOutput: '9 1', isHidden: false },
            { input: '3\n-5 -2 -9', expectedOutput: '-2 1', isHidden: false },
            { input: '1\n7', expectedOutput: '7 0', isHidden: true },
          ],
        },
      ],
    },
    { title: 'const y buenas prácticas', xpReward: 10, contentMarkdown: null },
  ],
};
