import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Objetos y clases", lecciones 1-2.
export const objetosParte1: SeedLesson[] = [
  {
    title: 'Propiedades opcionales y readonly',
    xpReward: 10,
    contentMarkdown: md`
# Propiedades opcionales y readonly

Las interfaces pueden describir con más precisión cómo se usa un objeto.

## Propiedades opcionales

Con §?§, la propiedad puede no estar:

§§§typescript
interface Usuario {
nombre: string;
correo?: string;
}

const a: Usuario = { nombre: "Ana" }; // válido
const b: Usuario = { nombre: "Luis", correo: "l@mail.com" }; // válido
§§§

Cuando la lees, su valor puede ser §undefined§, así que conviene comprobarlo.

## Encadenamiento opcional (?.) y valor por defecto (??)

§§§typescript
const largo = a.correo?.length; // undefined si no hay correo
const texto: string = a.correo ?? "sin correo";
§§§

- §?.§ se detiene y devuelve §undefined§ si lo de la izquierda es §undefined§ o §null§, en vez de fallar.
- §??§ usa el valor de la derecha **solo** si el de la izquierda es §undefined§ o §null§ (a diferencia de §||§, que también trata como "vacío" a §0§ y §""§).

## readonly

Una propiedad §readonly§ se puede dar al crear el objeto, pero no cambiar después:

§§§typescript
interface Producto {
readonly id: number;
nombre: string;
}

const p: Producto = { id: 1, nombre: "Cuaderno" };
p.nombre = "Libreta"; // válido
p.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.
§§§

Es ideal para identificadores y datos que no deben cambiar.

## Tipos de utilidad

TypeScript trae tipos listos para transformar otros:

§§§typescript
type Cambios = Partial<Usuario>; // todas las propiedades pasan a opcionales
type Fijo = Readonly<Usuario>; // todas pasan a readonly
§§§

§Partial§ es muy útil para funciones que actualizan solo algunos campos.

## Copiar y combinar objetos

El operador de propagación §...§ copia las propiedades de un objeto a otro:

§§§typescript
const actualizado: Usuario = { ...a, correo: "ana@mail.com" };
§§§

Las propiedades de la derecha pisan a las de la izquierda.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con la última línea?',
        difficulty: 1,
        payload: {
          code: 'interface Producto {\n  readonly id: number;\n  nombre: string;\n}\nconst p: Producto = { id: 1, nombre: "Cuaderno" };\np.id = 2;',
          options: [
            'Cambia id a 2',
            'Marca un error: id es de solo lectura',
            'Ignora la línea',
            'Cambia nombre',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Cuál de estos objetos es válido?',
        difficulty: 1,
        payload: {
          code: 'interface Usuario {\n  nombre: string;\n  correo?: string;\n}',
          options: [
            'const u: Usuario = { correo: "a@m.com" };',
            'const u: Usuario = { nombre: "Ana" };',
            'const u: Usuario = {};',
            'const u: Usuario = { nombre: 5 };',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'const apodo: string | undefined = undefined;\nconsole.log(apodo ?? "anonimo");',
          options: ['undefined', 'anonimo', '""', 'Error'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt:
          'Haz que `id` no se pueda modificar después de crear el objeto.',
        difficulty: 1,
        payload: {
          template:
            'interface Producto {\n  {{0}} id: number;\n  nombre: string;\n}',
          blanks: ['readonly'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'interface Cuenta {',
            '  readonly numero: string;',
            '  saldo: number;',
            '}',
            'const c: Cuenta = { numero: "001", saldo: 100 };',
            'c.saldo = 150;',
            'c.numero = "002";',
          ],
          buggyLineIndex: 6,
          explanation:
            'numero es readonly: se puede dar al crear el objeto pero no reasignar.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: interfaz con propiedad opcional, objeto y uso con ??.',
        difficulty: 2,
        payload: {
          blocks: [
            'interface Usuario {',
            '  nombre: string;',
            '  correo?: string;',
            '}',
            'const u: Usuario = { nombre: "Ana" };',
            'console.log(u.correo ?? "sin correo");',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (línea 1) y, si existe, un correo (línea 2). Imprime `<nombre>: <correo>` o `<nombre>: sin correo`.',
        starterCode: `${ENTRADA}interface Usuario {\n  nombre: string;\n  correo?: string;\n}\n\nconst u: Usuario = { nombre: lineas[0], correo: lineas[1] };\n`,
        solution: `${ENTRADA}interface Usuario {\n  nombre: string;\n  correo?: string;\n}\n\nconst u: Usuario = { nombre: lineas[0], correo: lineas[1] };\nconsole.log(\`\${u.nombre}: \${u.correo ?? 'sin correo'}\`);\n`,
        difficulty: 2,
        testCases: [
          { input: 'Ana', expectedOutput: 'Ana: sin correo', isHidden: false },
          {
            input: 'Luis\nl@mail.com',
            expectedOutput: 'Luis: l@mail.com',
            isHidden: false,
          },
          {
            input: 'Eva\ne@mail.com',
            expectedOutput: 'Eva: e@mail.com',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre y una edad (líneas 1 y 2). La línea 3 es una nueva edad. Usa `Partial` y el operador `...` para actualizar solo la edad e imprime `<nombre> <edad>`.',
        starterCode: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nfunction actualizar(p: Persona, cambios: Partial<Persona>): Persona {\n  // TODO\n}\n\nconst base: Persona = { nombre: lineas[0], edad: Number(lineas[1]) };\nconst nuevo: Persona = actualizar(base, { edad: Number(lineas[2]) });\nconsole.log(\`\${nuevo.nombre} \${nuevo.edad}\`);\n`,
        solution: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nfunction actualizar(p: Persona, cambios: Partial<Persona>): Persona {\n  return { ...p, ...cambios };\n}\n\nconst base: Persona = { nombre: lineas[0], edad: Number(lineas[1]) };\nconst nuevo: Persona = actualizar(base, { edad: Number(lineas[2]) });\nconsole.log(\`\${nuevo.nombre} \${nuevo.edad}\`);\n`,
        difficulty: 3,
        testCases: [
          { input: 'Ana\n20\n21', expectedOutput: 'Ana 21', isHidden: false },
          { input: 'Luis\n30\n45', expectedOutput: 'Luis 45', isHidden: false },
          { input: 'Eva\n18\n18', expectedOutput: 'Eva 18', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Clases',
    xpReward: 10,
    contentMarkdown: md`
# Clases

Una **clase** es un molde para crear objetos que comparten propiedades y comportamientos.

## Una clase sencilla

§§§typescript
class Rectangulo {
ancho: number;
alto: number;

constructor(ancho: number, alto: number) {
this.ancho = ancho;
this.alto = alto;
}

area(): number {
return this.ancho * this.alto;
}
}

const r = new Rectangulo(3, 4);
console.log(r.area()); // 12
§§§

- Las **propiedades** se declaran con su tipo.
- El **constructor** se ejecuta con §new§ y deja el objeto listo.
- §this§ se refiere al objeto actual.
- Los **métodos** son funciones de la clase.

## Modificadores de acceso

| Modificador | Quién puede usarlo                   |
| ----------- | ------------------------------------ |
| §public§    | cualquiera (es el valor por defecto) |
| §private§   | solo el código dentro de la clase    |
| §readonly§  | se asigna al crear y ya no cambia    |

§§§typescript
class Cuenta {
private saldo: number = 0;

depositar(monto: number): void {
this.saldo += monto;
}

consultar(): number {
return this.saldo;
}
}

const c = new Cuenta();
c.depositar(100);
c.saldo = 999; // Error: 'saldo' is private
§§§

Ocultar el estado interno obliga a usar los métodos, que pueden validar los datos.

## Atajo en el constructor

Poner un modificador en un parámetro del constructor declara y asigna la propiedad a la vez:

§§§typescript
class Persona {
constructor(public nombre: string, private edad: number) {}
}
§§§

## Getters

Un §get§ expone un valor calculado como si fuera una propiedad:

§§§typescript
class Circulo {
constructor(private radio: number) {}
get area(): number {
return Math.PI * this.radio * this.radio;
}
}
// new Circulo(2).area → sin paréntesis
§§§
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con la última línea?',
        difficulty: 1,
        payload: {
          code: 'class Cuenta {\n  private saldo: number = 0;\n}\nconst c = new Cuenta();\nc.saldo = 999;',
          options: [
            'Cambia el saldo',
            'Marca un error: saldo es private',
            'Crea una nueva propiedad',
            'Lanza un error al ejecutar',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'class Rectangulo {\n  constructor(public ancho: number, public alto: number) {}\n  area(): number {\n    return this.ancho * this.alto;\n  }\n}\nconsole.log(new Rectangulo(3, 4).area());',
          options: ['7', '12', '34', 'undefined'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué palabra crea un objeto a partir de una clase?',
        difficulty: 1,
        payload: {
          code: 'const r = ____ Rectangulo(3, 4);',
          options: ['create', 'new', 'make', 'class'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa la clase: constructor y uso de `this`.',
        difficulty: 2,
        payload: {
          template:
            'class Punto {\n  x: number;\n  {{0}}(x: number) {\n    {{1}}.x = x;\n  }\n}',
          blanks: ['constructor', 'this'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'class Contador {',
            '  private valor: number = 0;',
            '  incrementar(): void { this.valor++; }',
            '}',
            'const c = new Contador();',
            'c.incrementar();',
            'console.log(c.valor);',
          ],
          buggyLineIndex: 6,
          explanation:
            'valor es private: fuera de la clase no se puede leer directamente.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: clase con un método, creación del objeto y uso.',
        difficulty: 2,
        payload: {
          blocks: [
            'class Saludo {',
            '  decir(): string {',
            '    return "hola";',
            '  }',
            '}',
            'console.log(new Saludo().decir());',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee el ancho y el alto de un rectángulo (líneas 1 y 2). Completa la clase e imprime su área y su perímetro, separados por un espacio.',
        starterCode: `${ENTRADA}class Rectangulo {\n  constructor(private ancho: number, private alto: number) {}\n\n  area(): number {\n    // TODO\n  }\n\n  perimetro(): number {\n    // TODO\n  }\n}\n\nconst r = new Rectangulo(Number(lineas[0]), Number(lineas[1]));\nconsole.log(\`\${r.area()} \${r.perimetro()}\`);\n`,
        solution: `${ENTRADA}class Rectangulo {\n  constructor(private ancho: number, private alto: number) {}\n\n  area(): number {\n    return this.ancho * this.alto;\n  }\n\n  perimetro(): number {\n    return 2 * (this.ancho + this.alto);\n  }\n}\n\nconst r = new Rectangulo(Number(lineas[0]), Number(lineas[1]));\nconsole.log(\`\${r.area()} \${r.perimetro()}\`);\n`,
        difficulty: 2,
        testCases: [
          { input: '3\n4', expectedOutput: '12 14', isHidden: false },
          { input: '5\n5', expectedOutput: '25 20', isHidden: false },
          { input: '1\n10', expectedOutput: '10 22', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Cada línea es una operación: `depositar <monto>` o `retirar <monto>`. Procésalas con la clase `Cuenta` (no se puede retirar más del saldo: en ese caso ignora la operación) e imprime el saldo final.',
        starterCode: `${ENTRADA}class Cuenta {\n  private saldo: number = 0;\n\n  depositar(monto: number): void {\n    // TODO\n  }\n\n  retirar(monto: number): void {\n    // TODO\n  }\n\n  consultar(): number {\n    return this.saldo;\n  }\n}\n\nconst cuenta = new Cuenta();\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const monto: number = Number(partes[1]);\n  if (partes[0] === 'depositar') {\n    cuenta.depositar(monto);\n  } else {\n    cuenta.retirar(monto);\n  }\n}\nconsole.log(cuenta.consultar());\n`,
        solution: `${ENTRADA}class Cuenta {\n  private saldo: number = 0;\n\n  depositar(monto: number): void {\n    this.saldo += monto;\n  }\n\n  retirar(monto: number): void {\n    if (monto <= this.saldo) {\n      this.saldo -= monto;\n    }\n  }\n\n  consultar(): number {\n    return this.saldo;\n  }\n}\n\nconst cuenta = new Cuenta();\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const monto: number = Number(partes[1]);\n  if (partes[0] === 'depositar') {\n    cuenta.depositar(monto);\n  } else {\n    cuenta.retirar(monto);\n  }\n}\nconsole.log(cuenta.consultar());\n`,
        difficulty: 3,
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
];
