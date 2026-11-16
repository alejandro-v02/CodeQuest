import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { INCLUDES } from './common';

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
    { title: 'Referencias', xpReward: 10, contentMarkdown: null },
    { title: 'Punteros', xpReward: 10, contentMarkdown: null },
    { title: 'const y buenas prácticas', xpReward: 10, contentMarkdown: null },
  ],
};
