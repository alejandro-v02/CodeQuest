import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES, PLANTILLA } from './common';

export const moduloClases: SeedModule = {
  title: 'Clases',
  lessons: [
    {
      title: 'Clases y objetos',
      xpReward: 10,
      contentMarkdown: md`
# Clases y objetos

Un §struct§ agrupa datos. Una **clase** agrupa datos **y las funciones que trabajan con ellos**. Es la base de la programación orientada a objetos.

## Una clase sencilla

§§§cpp
class Rectangulo {
public:
double ancho;
double alto;

double area() {
return ancho * alto;
}

double perimetro() {
return 2 * (ancho + alto);
}
};

int main() {
Rectangulo r;
r.ancho = 3;
r.alto = 4;
cout << r.area() << endl; // 12
return 0;
}
§§§

- §class Rectangulo { ... };§ define la clase (¡no olvides el §;§ final!).
- §ancho§ y §alto§ son **atributos** (los datos).
- §area()§ y §perimetro()§ son **métodos** (las funciones de la clase).
- §r§ es un **objeto**: una instancia concreta de la clase.
- Se llama a un método con un punto: §r.area()§.

## public

Los miembros de una clase son **privados por defecto**: nadie fuera de la clase puede usarlos. La etiqueta §public:§ los hace accesibles. (En un §struct§ es al revés: todo es público por defecto.)

§§§cpp
class Contador {
int valor = 0; // privado: no se puede usar desde main
};

Contador c;
cout << c.valor; // ERROR de compilación: 'valor' es privado
§§§

En la siguiente lección verás por qué conviene **esconder** los datos.

## Varios objetos

Cada objeto tiene sus propios datos:

§§§cpp
Rectangulo a, b;
a.ancho = 2; a.alto = 5;
b.ancho = 10; b.alto = 1;
cout << a.area() << " " << b.area() << endl; // 10 10
§§§

## Vectores de objetos

§§§cpp
vector<Rectangulo> figuras;
Rectangulo r;
r.ancho = 3; r.alto = 4;
figuras.push_back(r);
§§§

## this

Dentro de un método, §this§ es un puntero al objeto actual. Normalmente no hace falta escribirlo: §ancho§ equivale a §this->ancho§.

## Recuerda

- Clase = molde; objeto = ejemplar concreto.
- Los métodos usan directamente los atributos del objeto.
- Termina siempre la definición de la clase con §;§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'class Rectangulo {\n public:\n  double ancho, alto;\n  double area() { return ancho * alto; }\n};\n\nint main() {\n  Rectangulo r;\n  r.ancho = 3;\n  r.alto = 4;\n  cout << r.area();\n}',
            options: ['7', '12', '34', 'Error de compilación'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué ocurre al compilar este código?',
          difficulty: 2,
          payload: {
            code: 'class Contador {\n  int valor = 0;\n};\n\nint main() {\n  Contador c;\n  cout << c.valor;\n}',
            options: [
              'Imprime 0',
              "Error: 'valor' es privado (los miembros de una clase son privados por defecto)",
              'Imprime basura',
              'Error: falta un constructor',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Cuál es la diferencia de acceso por defecto entre `struct` y `class`?',
          difficulty: 2,
          payload: {
            code: 'struct A { int x; };\nclass B { int y; };',
            options: [
              'Ninguna',
              'En struct los miembros son públicos; en class, privados',
              'En struct son privados; en class, públicos',
              'struct no puede tener métodos',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Haz que los atributos sean accesibles desde fuera de la clase.',
          difficulty: 1,
          payload: {
            template: 'class Punto {\n {{0}}:\n  int x;\n  int y;\n}{{1}}',
            blanks: ['public', ';'],
          },
        },
        {
          type: 'bug',
          prompt:
            'El compilador marca un error de acceso. ¿Qué línea lo causa?',
          difficulty: 2,
          payload: {
            lines: [
              'class Contador {',
              '  int valor = 0;',
              '};',
              'int main() {',
              '  Contador c;',
              '  cout << c.valor;',
              '}',
            ],
            buggyLineIndex: 5,
            explanation:
              'valor es privado (no hay public:): main no puede leerlo directamente.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas: clase con un método, objeto y llamada.',
          difficulty: 2,
          payload: {
            blocks: [
              'class Saludo {',
              ' public:',
              '  void decir() { cout << "hola" << endl; }',
              '};',
              'Saludo s;',
              's.decir();',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee el ancho y el alto de un rectángulo. Completa la clase e imprime su área y su perímetro separados por un espacio.',
          starterCode: `${INCLUDES}class Rectangulo {\n public:\n  double ancho;\n  double alto;\n\n  double area() {\n    // TODO\n    return 0;\n  }\n\n  double perimetro() {\n    // TODO\n    return 0;\n  }\n};\n\nint main() {\n  Rectangulo r;\n  cin >> r.ancho >> r.alto;\n  cout << r.area() << " " << r.perimetro() << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Rectangulo {\n public:\n  double ancho;\n  double alto;\n\n  double area() {\n    return ancho * alto;\n  }\n\n  double perimetro() {\n    return 2 * (ancho + alto);\n  }\n};\n\nint main() {\n  Rectangulo r;\n  cin >> r.ancho >> r.alto;\n  cout << r.area() << " " << r.perimetro() << endl;\n  return 0;\n}\n`,
          difficulty: 1,
          testCases: [
            { input: '3\n4', expectedOutput: '12 14', isHidden: false },
            { input: '5 5', expectedOutput: '25 20', isHidden: false },
            { input: '1\n10', expectedOutput: '10 22', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Crea una clase `Contador` con un atributo `valor` (empieza en 0) y los métodos `incrementar()` y `obtener()`. Lee N, incrementa el contador N veces e imprime `obtener()`.',
          starterCode: `${INCLUDES}class Contador {\n public:\n  int valor = 0;\n\n  void incrementar() {\n    // TODO\n  }\n\n  int obtener() {\n    // TODO\n    return 0;\n  }\n};\n\nint main() {\n  int n;\n  cin >> n;\n  Contador c;\n  for (int i = 0; i < n; i++) {\n    c.incrementar();\n  }\n  cout << c.obtener() << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Contador {\n public:\n  int valor = 0;\n\n  void incrementar() {\n    valor++;\n  }\n\n  int obtener() {\n    return valor;\n  }\n};\n\nint main() {\n  int n;\n  cin >> n;\n  Contador c;\n  for (int i = 0; i < n; i++) {\n    c.incrementar();\n  }\n  cout << c.obtener() << endl;\n  return 0;\n}\n`,
          difficulty: 1,
          testCases: [
            { input: '5', expectedOutput: '5', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: false },
            { input: '12', expectedOutput: '12', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación `depositar <monto>` o `retirar <monto>`. Procésalas con la clase `Cuenta` (si el retiro es mayor que el saldo, ignóralo) e imprime el saldo final.',
          starterCode: `${INCLUDES}class Cuenta {\n public:\n  int saldo = 0;\n\n  void depositar(int monto) {\n    // TODO\n  }\n\n  void retirar(int monto) {\n    // TODO\n  }\n};\n\nint main() {\n  Cuenta c;\n  string operacion;\n  int monto;\n  while (cin >> operacion >> monto) {\n    if (operacion == "depositar") {\n      c.depositar(monto);\n    } else {\n      c.retirar(monto);\n    }\n  }\n  cout << c.saldo << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Cuenta {\n public:\n  int saldo = 0;\n\n  void depositar(int monto) {\n    saldo += monto;\n  }\n\n  void retirar(int monto) {\n    if (monto <= saldo) {\n      saldo -= monto;\n    }\n  }\n};\n\nint main() {\n  Cuenta c;\n  string operacion;\n  int monto;\n  while (cin >> operacion >> monto) {\n    if (operacion == "depositar") {\n      c.depositar(monto);\n    } else {\n      c.retirar(monto);\n    }\n  }\n  cout << c.saldo << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'depositar 100\nretirar 30',
              expectedOutput: '70',
              isHidden: false,
            },
            {
              input: 'depositar 50\nretirar 80\ndepositar 10',
              expectedOutput: '60',
              isHidden: false,
            },
            { input: 'retirar 5', expectedOutput: '0', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Constructores y encapsulación',
      xpReward: 10,
      contentMarkdown: md`
# Constructores y encapsulación

Hasta ahora creabas un objeto y le ponías los datos uno por uno. Un **constructor** los deja listos en el momento de crearlo, y la **encapsulación** protege esos datos para que no se puedan romper desde fuera.

## Constructor

Es un método especial con el **mismo nombre que la clase** y sin tipo de retorno:

§§§cpp
class Persona {
public:
string nombre;
int edad;

Persona(string n, int e) {
nombre = n;
edad = e;
}
};

Persona ana("Ana", 20); // se ejecuta el constructor
cout << ana.nombre << endl; // Ana
§§§

## Lista de inicialización

Una forma más idiomática (y a veces necesaria) de inicializar los atributos:

§§§cpp
Persona(string n, int e) : nombre(n), edad(e) {}
§§§

## Encapsulación: atributos privados

Deja los datos **privados** y ofrece métodos públicos para usarlos. Así la clase decide qué cambios son válidos:

§§§cpp
class Cuenta {
private:
double saldo;

public:
Cuenta(double inicial) : saldo(inicial) {}

void depositar(double monto) {
if (monto > 0) {
saldo += monto;
}
}

double consultar() const {
return saldo;
}
};

Cuenta c(100);
c.depositar(50);
c.saldo = -999; // ERROR: saldo es privado
§§§

Nadie puede dejar el saldo en un valor imposible: todos los cambios pasan por §depositar§, que valida.

## Getters y setters

§§§cpp
int obtenerEdad() const { return edad; } // getter
void fijarEdad(int e) { if (e >= 0) edad = e; } // setter con validación
§§§

## Métodos const

Un método marcado §const§ promete **no modificar** el objeto. Los getters siempre deberían serlo.

## Constructor por defecto

Si no escribes ningún constructor, C++ crea uno vacío. Pero en cuanto escribes uno con parámetros, ya no puedes crear el objeto sin argumentos (a menos que definas otro constructor).

## Recuerda

- El constructor se llama como la clase y no devuelve nada.
- §private§ protege los datos; los métodos §public§ son la puerta de entrada.
- Un getter debe ser §const§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Cuándo se ejecuta el constructor?',
          difficulty: 1,
          payload: {
            code: 'Persona ana("Ana", 20);',
            options: [
              'Cuando llamas a ana.constructor()',
              'Automáticamente al crear el objeto',
              'Al terminar el programa',
              'Solo si lo llamas dos veces',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'class Cuenta {\n  double saldo;\n public:\n  Cuenta(double s) : saldo(s) {}\n  void depositar(double m) { if (m > 0) saldo += m; }\n  double consultar() const { return saldo; }\n};\n\nCuenta c(100);\nc.depositar(-5);\nc.depositar(50);\ncout << c.consultar();',
            options: ['145', '150', '100', '50'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Por qué los atributos suelen ser privados?',
          difficulty: 2,
          payload: {
            code: 'class Cuenta {\n private:\n  double saldo;\n};',
            options: [
              'Para ahorrar memoria',
              'Para que solo la propia clase decida cómo y cuándo cambian',
              'Porque public no existe en C++',
              'Para que el código compile más rápido',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa el constructor con lista de inicialización.',
          difficulty: 2,
          payload: {
            template:
              'Persona(string n, int e) {{0}} nombre(n), edad({{1}}) {}',
            blanks: [':', 'e'],
          },
        },
        {
          type: 'bug',
          prompt:
            'El compilador rechaza esta clase. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'class Punto {',
              ' public:',
              '  int x, y;',
              '  void Punto(int a, int b) {',
              '    x = a;',
              '    y = b;',
              '  }',
              '};',
            ],
            buggyLineIndex: 3,
            explanation:
              'Un constructor no tiene tipo de retorno: debe ser Punto(int a, int b), sin void.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas de la clase con constructor y getter.',
          difficulty: 2,
          payload: {
            blocks: [
              'class Persona {',
              '  int edad;',
              ' public:',
              '  Persona(int e) : edad(e) {}',
              '  int obtenerEdad() const { return edad; }',
              '};',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un nombre (una palabra) y una edad. Crea una `Persona` con constructor y getters, e imprime `nombre (edad)`.',
          starterCode: `${INCLUDES}class Persona {\n private:\n  string nombre;\n  int edad;\n\n public:\n  Persona(string n, int e) {\n    // TODO\n  }\n\n  string obtenerNombre() const {\n    // TODO\n    return "";\n  }\n\n  int obtenerEdad() const {\n    // TODO\n    return 0;\n  }\n};\n\nint main() {\n  string nombre;\n  int edad;\n  cin >> nombre >> edad;\n  Persona p(nombre, edad);\n  cout << p.obtenerNombre() << " (" << p.obtenerEdad() << ")" << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Persona {\n private:\n  string nombre;\n  int edad;\n\n public:\n  Persona(string n, int e) : nombre(n), edad(e) {}\n\n  string obtenerNombre() const {\n    return nombre;\n  }\n\n  int obtenerEdad() const {\n    return edad;\n  }\n};\n\nint main() {\n  string nombre;\n  int edad;\n  cin >> nombre >> edad;\n  Persona p(nombre, edad);\n  cout << p.obtenerNombre() << " (" << p.obtenerEdad() << ")" << endl;\n  return 0;\n}\n`,
          difficulty: 1,
          testCases: [
            { input: 'Ana\n20', expectedOutput: 'Ana (20)', isHidden: false },
            { input: 'Luis 31', expectedOutput: 'Luis (31)', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'La clase `Persona` valida la edad: si se intenta guardar una edad negativa, queda en 0. Lee un nombre y una edad, créala e imprime la edad guardada.',
          starterCode: `${INCLUDES}class Persona {\n private:\n  string nombre;\n  int edad;\n\n public:\n  Persona(string n, int e) {\n    nombre = n;\n    // TODO: si e es negativa, guarda 0\n    edad = e;\n  }\n\n  int obtenerEdad() const {\n    return edad;\n  }\n};\n\nint main() {\n  string nombre;\n  int edad;\n  cin >> nombre >> edad;\n  Persona p(nombre, edad);\n  cout << p.obtenerEdad() << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Persona {\n private:\n  string nombre;\n  int edad;\n\n public:\n  Persona(string n, int e) {\n    nombre = n;\n    edad = (e < 0) ? 0 : e;\n  }\n\n  int obtenerEdad() const {\n    return edad;\n  }\n};\n\nint main() {\n  string nombre;\n  int edad;\n  cin >> nombre >> edad;\n  Persona p(nombre, edad);\n  cout << p.obtenerEdad() << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: 'Ana\n20', expectedOutput: '20', isHidden: false },
            { input: 'Luis\n-5', expectedOutput: '0', isHidden: false },
            { input: 'Eva 0', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Crea una clase `Termometro` con la temperatura en Celsius guardada de forma privada. Lee los grados y, usando el método `enFahrenheit()`, imprime la temperatura en Fahrenheit con 1 decimal (F = C × 9 / 5 + 32).',
          starterCode: `${INCLUDES}class Termometro {\n private:\n  double celsius;\n\n public:\n  Termometro(double c) : celsius(c) {}\n\n  double enFahrenheit() const {\n    // TODO\n    return 0;\n  }\n};\n\nint main() {\n  double c;\n  cin >> c;\n  Termometro t(c);\n  cout << fixed << setprecision(1) << t.enFahrenheit() << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}class Termometro {\n private:\n  double celsius;\n\n public:\n  Termometro(double c) : celsius(c) {}\n\n  double enFahrenheit() const {\n    return celsius * 9 / 5 + 32;\n  }\n};\n\nint main() {\n  double c;\n  cin >> c;\n  Termometro t(c);\n  cout << fixed << setprecision(1) << t.enFahrenheit() << endl;\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '100', expectedOutput: '212.0', isHidden: false },
            { input: '0', expectedOutput: '32.0', isHidden: false },
            { input: '36.6', expectedOutput: '97.9', isHidden: true },
          ],
        },
      ],
    },
    { title: 'Herencia y polimorfismo', xpReward: 10, contentMarkdown: null },
  ],
};
