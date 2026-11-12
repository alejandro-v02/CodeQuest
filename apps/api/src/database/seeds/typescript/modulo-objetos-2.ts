import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Objetos y clases", lección 3.
export const objetosParte2: SeedLesson[] = [
  {
    title: 'Herencia e interfaces',
    xpReward: 10,
    contentMarkdown: md`
# Herencia e interfaces

Las clases pueden reutilizarse y combinarse de dos formas: **heredando** de otra clase o **cumpliendo** una interfaz.

## Herencia con extends

Una clase hija toma las propiedades y métodos de la clase padre y puede añadir o cambiar los suyos.

§§§typescript
class Animal {
constructor(protected nombre: string) {}

hablar(): string {
return \`\${this.nombre} hace un sonido\`;
}
}

class Perro extends Animal {
hablar(): string {
return \`\${this.nombre} dice guau\`;
}
}

const p = new Perro("Rex");
p.hablar(); // "Rex dice guau"
§§§

- §extends§ declara quién es el padre.
- Si la hija define su propio constructor, debe llamar a §super(...)§ antes de usar §this§.
- §protected§ permite el acceso desde la clase y sus hijas, pero no desde fuera.

## Polimorfismo

Una variable del tipo padre puede contener objetos de cualquier clase hija:

§§§typescript
const animales: Animal[] = [new Animal("Pez"), new Perro("Rex")];
for (const a of animales) {
console.log(a.hablar()); // cada uno responde a su manera
}
§§§

## Interfaces con implements

Una interfaz describe **qué** debe poder hacer una clase, sin decir cómo. La clase la cumple con §implements§:

§§§typescript
interface Pagable {
calcularPago(): number;
}

class Empleado implements Pagable {
constructor(private salario: number) {}
calcularPago(): number {
return this.salario;
}
}
§§§

Si falta un método de la interfaz, el compilador marca un error:

§§§typescript
class Mal implements Pagable {}
// Error: Class 'Mal' incorrectly implements interface 'Pagable'.
§§§

## Herencia o interfaz

- **Herencia**: cuando una clase "es un tipo de" otra y comparten código.
- **Interfaz**: cuando clases distintas deben ofrecer las mismas operaciones.
- Una clase puede extender **una** clase, pero implementar **varias** interfaces.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué palabra clave declara que una clase hereda de otra?',
        difficulty: 1,
        payload: {
          code: 'class Perro ____ Animal {}',
          options: ['implements', 'extends', 'inherits', 'super'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'class Animal {\n  hablar(): string {\n    return "...";\n  }\n}\nclass Perro extends Animal {\n  hablar(): string {\n    return "guau";\n  }\n}\nconst lista: Animal[] = [new Animal(), new Perro()];\nconsole.log(lista.map((a: Animal) => a.hablar()).join(","));',
          options: ['...,...', 'guau,guau', '...,guau', 'guau,...'],
          correctIndex: 2,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con esta clase?',
        difficulty: 2,
        payload: {
          code: 'interface Pagable {\n  calcularPago(): number;\n}\nclass Mal implements Pagable {}',
          options: [
            'Funciona sin problema',
            'Marca un error: falta implementar calcularPago',
            'Crea calcularPago automáticamente',
            'Marca un error en la interfaz',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt:
          'Haz que `Perro` herede de `Animal` y que `Pato` cumpla la interfaz `Volador`.',
        difficulty: 2,
        payload: {
          template:
            'class Perro {{0}} Animal {}\nclass Pato {{1}} Volador {\n  volar(): string { return "vuela"; }\n}',
          blanks: ['extends', 'implements'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 3,
        payload: {
          lines: [
            'interface Volador {',
            '  volar(): string;',
            '}',
            'class Pato implements Volador {',
            '  nadar(): string { return "nada"; }',
            '}',
          ],
          buggyLineIndex: 3,
          explanation:
            'Pato declara que implementa Volador pero no define el método volar().',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas: clase padre, clase hija e impresión.',
        difficulty: 2,
        payload: {
          blocks: [
            'class Vehiculo {',
            '  ruedas(): number { return 4; }',
            '}',
            'class Moto extends Vehiculo {',
            '  ruedas(): number { return 2; }',
            '}',
            'console.log(new Moto().ruedas());',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Cada línea es una figura: `circulo <radio>` o `cuadrado <lado>`. Completa las clases hijas e imprime la suma de las áreas con 2 decimales.',
        starterCode: `${ENTRADA}class Figura {\n  area(): number {\n    return 0;\n  }\n}\n\nclass Circulo extends Figura {\n  constructor(private radio: number) {\n    super();\n  }\n  area(): number {\n    // TODO\n  }\n}\n\nclass Cuadrado extends Figura {\n  constructor(private lado: number) {\n    super();\n  }\n  area(): number {\n    // TODO\n  }\n}\n\nconst figuras: Figura[] = [];\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const medida: number = Number(partes[1]);\n  figuras.push(partes[0] === 'circulo' ? new Circulo(medida) : new Cuadrado(medida));\n}\nlet total: number = 0;\nfor (const f of figuras) {\n  total += f.area();\n}\nconsole.log(total.toFixed(2));\n`,
        solution: `${ENTRADA}class Figura {\n  area(): number {\n    return 0;\n  }\n}\n\nclass Circulo extends Figura {\n  constructor(private radio: number) {\n    super();\n  }\n  area(): number {\n    return Math.PI * this.radio * this.radio;\n  }\n}\n\nclass Cuadrado extends Figura {\n  constructor(private lado: number) {\n    super();\n  }\n  area(): number {\n    return this.lado * this.lado;\n  }\n}\n\nconst figuras: Figura[] = [];\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const medida: number = Number(partes[1]);\n  figuras.push(partes[0] === 'circulo' ? new Circulo(medida) : new Cuadrado(medida));\n}\nlet total: number = 0;\nfor (const f of figuras) {\n  total += f.area();\n}\nconsole.log(total.toFixed(2));\n`,
        difficulty: 3,
        testCases: [
          {
            input: 'cuadrado 2\ncuadrado 3',
            expectedOutput: '13.00',
            isHidden: false,
          },
          { input: 'circulo 1', expectedOutput: '3.14', isHidden: false },
          {
            input: 'circulo 2\ncuadrado 1',
            expectedOutput: '13.57',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'Cada línea es `empleado <salario>` o `freelancer <horas> <tarifa>`. Ambas clases cumplen la interfaz `Pagable`. Imprime el pago total.',
        starterCode: `${ENTRADA}interface Pagable {\n  calcularPago(): number;\n}\n\nclass Empleado implements Pagable {\n  constructor(private salario: number) {}\n  calcularPago(): number {\n    // TODO\n  }\n}\n\nclass Freelancer implements Pagable {\n  constructor(private horas: number, private tarifa: number) {}\n  calcularPago(): number {\n    // TODO\n  }\n}\n\nconst pagos: Pagable[] = [];\nfor (const linea of lineas) {\n  const p: string[] = linea.split(' ');\n  pagos.push(p[0] === 'empleado' ? new Empleado(Number(p[1])) : new Freelancer(Number(p[1]), Number(p[2])));\n}\nlet total: number = 0;\nfor (const p of pagos) {\n  total += p.calcularPago();\n}\nconsole.log(total);\n`,
        solution: `${ENTRADA}interface Pagable {\n  calcularPago(): number;\n}\n\nclass Empleado implements Pagable {\n  constructor(private salario: number) {}\n  calcularPago(): number {\n    return this.salario;\n  }\n}\n\nclass Freelancer implements Pagable {\n  constructor(private horas: number, private tarifa: number) {}\n  calcularPago(): number {\n    return this.horas * this.tarifa;\n  }\n}\n\nconst pagos: Pagable[] = [];\nfor (const linea of lineas) {\n  const p: string[] = linea.split(' ');\n  pagos.push(p[0] === 'empleado' ? new Empleado(Number(p[1])) : new Freelancer(Number(p[1]), Number(p[2])));\n}\nlet total: number = 0;\nfor (const p of pagos) {\n  total += p.calcularPago();\n}\nconsole.log(total);\n`,
        difficulty: 3,
        testCases: [
          {
            input: 'empleado 1000\nfreelancer 10 25',
            expectedOutput: '1250',
            isHidden: false,
          },
          { input: 'freelancer 4 50', expectedOutput: '200', isHidden: false },
          {
            input: 'empleado 500\nempleado 700',
            expectedOutput: '1200',
            isHidden: true,
          },
        ],
      },
    ],
  },
];
