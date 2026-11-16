import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES, PLANTILLA } from './common';

export const moduloCadenas: SeedModule = {
  title: 'Cadenas y entrada',
  lessons: [
    {
      title: 'Entrada y salida',
      xpReward: 10,
      contentMarkdown: md`
# Entrada y salida

Casi todos los programas leen datos y muestran resultados. En C++ lo haces con §cin§ (entrada) y §cout§ (salida).

## Salida con cout

§§§cpp
cout << "Total: " << 42 << endl;
cout << "A" << " " << "B" << '\n';
§§§

- §<<§ encadena varios valores en una sola instrucción.
- §endl§ termina la línea (y vacía el búfer). Un §'\n'§ también cambia de línea y es un poco más rápido.

## Entrada con cin

§cin >>§ lee **una palabra o un número** y se salta los espacios y saltos de línea:

§§§cpp
int a;
double b;
string palabra;
cin >> a >> b >> palabra;
§§§

Con la entrada §5 2.5 hola§ (o cada valor en su línea) las tres variables quedan listas.

## Leer una línea completa: getline

Si el texto tiene espacios, §cin >>§ solo toma hasta el primer espacio. Para la línea entera:

§§§cpp
string frase;
getline(cin, frase); // lee "hola mundo" completo
§§§

## La trampa de mezclar cin y getline

§§§cpp
int n;
cin >> n; // lee 3, pero deja el salto de línea sin consumir
string linea;
getline(cin, linea); // ¡lee una línea VACÍA!
§§§

Después de §cin >>§ queda el salto de línea pendiente. Antes de §getline§ hay que descartarlo:

§§§cpp
cin >> n;
cin.ignore(); // descarta el salto de línea
getline(cin, linea); // ahora sí lee el texto
§§§

## Leer hasta el final

§§§cpp
string linea;
while (getline(cin, linea)) {
cout << linea << endl;
}
§§§

§getline§ devuelve falso cuando ya no hay más líneas.

## Alinear la salida

§§§cpp
#include <iomanip>
cout << setw(5) << 42 << endl; // " 42" (ancho 5, alineado a la derecha)
§§§

## Recuerda

- §cin >>§ para palabras y números; §getline§ para líneas con espacios.
- Tras un §cin >>§ y antes de un §getline§, usa §cin.ignore()§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué guarda `frase` con la entrada `hola mundo`?',
          difficulty: 1,
          payload: {
            code: 'string frase;\ncin >> frase;',
            options: ['hola mundo', 'hola', 'mundo', 'Nada'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            'La entrada es `3` y en la línea siguiente `hola`. ¿Qué guarda `linea`?',
          difficulty: 2,
          payload: {
            code: 'int n;\ncin >> n;\nstring linea;\ngetline(cin, linea);',
            options: [
              'hola',
              'Una cadena vacía (queda el salto de línea pendiente)',
              '3',
              'Error de compilación',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código con `setw`?',
          difficulty: 2,
          payload: {
            code: 'cout << setw(4) << 7 << endl;',
            options: ['7', '   7 (el 7 a la derecha, ancho 4)', '7   ', '0007'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Lee una línea completa (con espacios) en `frase`.',
          difficulty: 1,
          payload: {
            template: 'string frase;\n{{0}}(cin, frase);',
            blanks: ['getline'],
          },
        },
        {
          type: 'bug',
          prompt:
            'El programa se salta la lectura del texto. ¿Qué línea falta o falla?',
          difficulty: 3,
          payload: {
            lines: [
              'int n;',
              'cin >> n;',
              'string texto;',
              'getline(cin, texto);',
              'cout << texto << endl;',
            ],
            buggyLineIndex: 3,
            explanation:
              'Tras cin >> n queda el salto de línea sin consumir y getline lee una línea vacía. Hay que poner cin.ignore(); antes.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas que leen un número, descartan el salto y leen una línea.',
          difficulty: 2,
          payload: {
            blocks: [
              'int n;',
              'cin >> n;',
              'cin.ignore();',
              'string linea;',
              'getline(cin, linea);',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'La línea 1 es un entero N y la línea 2 un texto (con espacios). Imprime el texto N veces, una por línea.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  cin.ignore();\n  string texto;\n  getline(cin, texto);\n  for (int i = 0; i < n; i++) {\n    cout << texto << endl;\n  }\n${FIN}`,
          difficulty: 2,
          testCases: [
            {
              input: '2\nhola mundo',
              expectedOutput: 'hola mundo\nhola mundo',
              isHidden: false,
            },
            { input: '3\nsi', expectedOutput: 'si\nsi\nsi', isHidden: false },
            {
              input: '1\nuna frase larga',
              expectedOutput: 'una frase larga',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt: 'Lee todas las líneas de la entrada e imprime cuántas hay.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string linea;\n  int total = 0;\n  while (getline(cin, linea)) {\n    total++;\n  }\n  cout << total << endl;\n${FIN}`,
          difficulty: 1,
          testCases: [
            { input: 'a\nb\nc', expectedOutput: '3', isHidden: false },
            { input: 'solo una', expectedOutput: '1', isHidden: false },
            { input: 'x\ny\nz\nw\nv', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un número N e imprime los números del 1 al N, cada uno en su línea, alineado a la derecha con ancho 4 (`setw(4)`).',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  for (int i = 1; i <= n; i++) {\n    cout << setw(4) << i << endl;\n  }\n${FIN}`,
          difficulty: 2,
          testCases: [
            { input: '3', expectedOutput: '   1\n   2\n   3', isHidden: false },
            { input: '1', expectedOutput: '   1', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Cadenas (string)',
      xpReward: 10,
      contentMarkdown: md`
# Cadenas (string)

Una **cadena** (§string§) guarda texto. A diferencia de los números, tiene longitud y se puede recorrer carácter por carácter.

## Lo básico

§§§cpp
string nombre = "Ana";
cout << nombre.length() << endl; // 3 (también: nombre.size())
cout << nombre[0] << endl; // A (el primer carácter es el índice 0)
cout << nombre.back() << endl; // a (el último)
§§§

## Unir cadenas

§§§cpp
string a = "Hola";
string b = "mundo";
string frase = a + ", " + b; // "Hola, mundo"
frase += "!"; // añade al final
§§§

Con §+§ puedes unir cadenas entre sí, pero **no** una cadena con un número directamente: usa §to_string§.

§§§cpp
int edad = 20;
string texto = "Edad: " + to_string(edad); // "Edad: 20"
§§§

## Comparar

§§§cpp
string x = "casa";
cout << (x == "casa") << endl; // 1 (iguales)
cout << (x < "perro") << endl; // 1 (orden alfabético)
§§§

## Recorrer los caracteres

§§§cpp
string palabra = "hola";
for (char c : palabra) {
cout << c << endl;
}
§§§

## Modificar caracteres

§§§cpp
string s = "hola";
s[0] = 'H'; // "Hola"
for (int i = 0; i < s.length(); i++) {
s[i] = toupper(s[i]); // pasa cada carácter a mayúscula
}
§§§

§toupper§ y §tolower§ trabajan con **un carácter** (necesitas §<cctype>§, que ya viene incluido en el programa).

## Comillas

- Comillas **dobles** §"..."§ → una cadena (§string§).
- Comillas **simples** §'a'§ → un solo carácter (§char§).

## Recuerda

- El primer índice es §0§ y el último §length() - 1§.
- §s[i]§ es un §char§; §s§ es una §string§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'string s = "hola";\ncout << s.length() << s[0];',
            options: ['4h', '3h', '4o', 'hola'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'string a = "Hola";\nstring b = "mundo";\ncout << a + ", " + b;',
            options: [
              'Hola mundo',
              'Hola, mundo',
              'Hola,mundo',
              'Error de compilación',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué ocurre con esta línea?',
          difficulty: 2,
          payload: {
            code: 'int edad = 20;\nstring t = "Edad: " + edad;',
            options: [
              't vale "Edad: 20"',
              'Error de compilación: no se puede sumar una cadena y un int; hay que usar to_string',
              't vale "Edad: "',
              'Imprime 20',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Convierte el número `edad` en texto antes de unirlo.',
          difficulty: 1,
          payload: {
            template: 'string t = "Edad: " + {{0}}(edad);',
            blanks: ['to_string'],
          },
        },
        {
          type: 'bug',
          prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
          difficulty: 2,
          payload: {
            lines: [
              'string s = "hola";',
              "char primera = 'h';",
              'char segunda = "o";',
              'cout << primera << segunda;',
            ],
            buggyLineIndex: 2,
            explanation:
              'Un char se escribe con comillas simples (\'o\'); "o" con comillas dobles es una cadena.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas que recorren una cadena e imprimen cada carácter.',
          difficulty: 2,
          payload: {
            blocks: [
              'string palabra = "hola";',
              'for (char c : palabra) {',
              '  cout << c << endl;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime su longitud, su primera letra y su última letra, separadas por un espacio.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string palabra;\n  cin >> palabra;\n  cout << palabra.length() << " " << palabra[0] << " " << palabra.back() << endl;\n${FIN}`,
          difficulty: 1,
          testCases: [
            { input: 'hola', expectedOutput: '4 h a', isHidden: false },
            { input: 'programar', expectedOutput: '9 p r', isHidden: false },
            { input: 'x', expectedOutput: '1 x x', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un texto (una línea) e imprímelo todo en mayúsculas. Usa `toupper`.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string texto;\n  getline(cin, texto);\n  for (int i = 0; i < texto.length(); i++) {\n    texto[i] = toupper(texto[i]);\n  }\n  cout << texto << endl;\n${FIN}`,
          difficulty: 2,
          testCases: [
            {
              input: 'hola mundo',
              expectedOutput: 'HOLA MUNDO',
              isHidden: false,
            },
            {
              input: 'C++ es genial',
              expectedOutput: 'C++ ES GENIAL',
              isHidden: false,
            },
            { input: 'ya MAYUS', expectedOutput: 'YA MAYUS', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime cuántas veces aparece la letra `a` (en minúscula).',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string palabra;\n  cin >> palabra;\n  int veces = 0;\n  for (char c : palabra) {\n    if (c == 'a') {\n      veces++;\n    }\n  }\n  cout << veces << endl;\n${FIN}`,
          difficulty: 2,
          testCases: [
            { input: 'banana', expectedOutput: '3', isHidden: false },
            { input: 'cielo', expectedOutput: '0', isHidden: false },
            { input: 'aaa', expectedOutput: '3', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprímela al revés, sin usar funciones que la inviertan: construye el resultado recorriéndola de atrás hacia adelante.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string palabra;\n  cin >> palabra;\n  string alReves = "";\n  for (int i = palabra.length() - 1; i >= 0; i--) {\n    alReves += palabra[i];\n  }\n  cout << alReves << endl;\n${FIN}`,
          difficulty: 3,
          testCases: [
            { input: 'hola', expectedOutput: 'aloh', isHidden: false },
            { input: 'abc', expectedOutput: 'cba', isHidden: false },
            { input: 'a', expectedOutput: 'a', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Operaciones con cadenas',
      xpReward: 10,
      contentMarkdown: md`
# Operaciones con cadenas

La clase §string§ trae métodos para buscar, cortar y transformar texto sin que tengas que recorrerlo a mano.

## Buscar con find

§§§cpp
string s = "programar en C++";
cout << s.find("gra") << endl; // 3 (posición donde empieza)
cout << (s.find("xyz") == string::npos); // 1 (no se encontró)
§§§

§find§ devuelve la **posición** de la primera coincidencia, o §string::npos§ si no existe.

## Cortar con substr

§§§cpp
string s = "programar";
cout << s.substr(0, 3) << endl; // "pro" (desde 0, 3 caracteres)
cout << s.substr(4) << endl; // "ramar" (desde la posición 4 hasta el final)
§§§

## Reemplazar, insertar y borrar

§§§cpp
string s = "hola mundo";
s.replace(0, 4, "adios"); // "adios mundo" (desde 0, quita 4 y pone "adios")
s.insert(0, ">> "); // ">> adios mundo"
s.erase(0, 3); // "adios mundo"
§§§

## Ordenar los caracteres

§§§cpp
string palabra = "casa";
sort(palabra.begin(), palabra.end()); // "aacs"
§§§

Dos palabras son **anagramas** si, al ordenar sus letras, quedan iguales.

## Separar palabras con stringstream

§§§cpp
string frase = "uno dos tres";
stringstream flujo(frase);
string palabra;
while (flujo >> palabra) {
cout << palabra << endl;
}
§§§

Un §stringstream§ se lee igual que §cin§: ideal para partir una línea en palabras.

## Texto ↔ número

§§§cpp
int n = stoi("42"); // 42
double d = stod("3.5"); // 3.5
string t = to_string(42); // "42"
§§§

## Clasificar caracteres

§isalpha(c)§ (¿es letra?), §isdigit(c)§ (¿es dígito?), §isupper§, §islower§, §isspace§.

## Recuerda

- §find§ devuelve la posición o §string::npos§.
- §substr(inicio, cantidad)§ **no** modifica la cadena: devuelve una nueva.
- §replace§, §insert§ y §erase§ **sí** modifican la cadena original.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'string s = "hola";\ncout << s.find("la");',
            options: ['1', '2', '3', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'string s = "programar";\ncout << s.substr(1, 3);',
            options: ['pro', 'rog', 'rogr', 'ogr'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué devuelve `find` cuando no encuentra el texto?',
          difficulty: 2,
          payload: {
            code: 'string s = "hola";\nauto pos = s.find("xyz");',
            options: ['0', '-1 siempre', 'string::npos', 'Lanza una excepción'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Obtén las 3 primeras letras de `s`.',
          difficulty: 1,
          payload: {
            template: 'string inicio = s.{{0}}(0, {{1}});',
            blanks: ['substr', '3'],
          },
        },
        {
          type: 'bug',
          prompt:
            'El programa dice que "hola" es palíndromo. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'string s = "hola";',
              'string alReves = s;',
              'reverse(alReves.begin(), alReves.end());',
              'bool esPalindromo = (s.length() == alReves.length());',
              'cout << (esPalindromo ? "si" : "no");',
            ],
            buggyLineIndex: 3,
            explanation:
              'Comparar solo las longitudes no basta: hay que comparar las cadenas, s == alReves.',
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas que separan una frase en palabras y las imprimen.',
          difficulty: 3,
          payload: {
            blocks: [
              'stringstream flujo(frase);',
              'string palabra;',
              'while (flujo >> palabra) {',
              '  cout << palabra << endl;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime `si` si es un palíndromo (se lee igual al revés) o `no` si no lo es.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string palabra;\n  cin >> palabra;\n  string alReves = palabra;\n  reverse(alReves.begin(), alReves.end());\n  cout << (palabra == alReves ? "si" : "no") << endl;\n${FIN}`,
          difficulty: 2,
          testCases: [
            { input: 'oso', expectedOutput: 'si', isHidden: false },
            { input: 'hola', expectedOutput: 'no', isHidden: false },
            { input: 'anilina', expectedOutput: 'si', isHidden: true },
            { input: 'ab', expectedOutput: 'no', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase (una línea) e imprime cuántas palabras tiene. Usa `stringstream`.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string frase;\n  getline(cin, frase);\n  stringstream flujo(frase);\n  string palabra;\n  int total = 0;\n  while (flujo >> palabra) {\n    total++;\n  }\n  cout << total << endl;\n${FIN}`,
          difficulty: 2,
          testCases: [
            { input: 'hola mundo cruel', expectedOutput: '3', isHidden: false },
            { input: 'una', expectedOutput: '1', isHidden: false },
            { input: 'a b c d e', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos palabras (una por línea). Imprime `anagramas` si tienen las mismas letras (en cualquier orden) o `no` si no.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string a, b;\n  cin >> a >> b;\n  sort(a.begin(), a.end());\n  sort(b.begin(), b.end());\n  cout << (a == b ? "anagramas" : "no") << endl;\n${FIN}`,
          difficulty: 3,
          testCases: [
            {
              input: 'roma\namor',
              expectedOutput: 'anagramas',
              isHidden: false,
            },
            { input: 'casa\ncosa', expectedOutput: 'no', isHidden: false },
            {
              input: 'listen\nsilent',
              expectedOutput: 'anagramas',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase (línea 1), una palabra a buscar (línea 2) y su reemplazo (línea 3). Imprime la frase con **todas** las apariciones reemplazadas.',
          starterCode: PLANTILLA,
          solution: `${INCLUDES}int main() {\n  string frase, buscar, nuevo;\n  getline(cin, frase);\n  getline(cin, buscar);\n  getline(cin, nuevo);\n  size_t pos = frase.find(buscar);\n  while (pos != string::npos) {\n    frase.replace(pos, buscar.length(), nuevo);\n    pos = frase.find(buscar, pos + nuevo.length());\n  }\n  cout << frase << endl;\n${FIN}`,
          difficulty: 3,
          testCases: [
            {
              input: 'el gato y el perro\nel\nun',
              expectedOutput: 'un gato y un perro',
              isHidden: false,
            },
            {
              input: 'banana\nna\nNA',
              expectedOutput: 'baNANA',
              isHidden: false,
            },
            { input: 'hola\nxyz\nabc', expectedOutput: 'hola', isHidden: true },
          ],
        },
      ],
    },
  ],
};
