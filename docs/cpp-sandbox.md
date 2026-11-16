# C++ en el sandbox (Piston)

Notas para quien escriba ejercicios de C++ o toque su ejecución.

## Cómo se ejecuta

Piston compila `main.cpp` con **g++ 10.2** y ejecuta el binario. Un error de compilación impide la ejecución: el mensaje de g++ llega como salida, por ejemplo `main.cpp.cpp:2:22: error: invalid conversion from 'const char*' to 'int'`.

## Qué se comprobó

- Compila `vector`, `auto`, `for` por rangos, `map` y C++17 (por ejemplo, enlaces estructurados).
- Lee la entrada con `std::cin` y `std::getline`; las clases y los punteros funcionan.
- Cada ejecución tarda entre 2 y 7 s (compilación incluida), más que Python o JavaScript. Por eso el verificador usa pocos trabajos en paralelo para C++.

## Convención de entrada y salida

Cada caso de prueba entrega la entrada **un valor por línea** por la entrada estándar y se compara la salida estándar sin espacios finales. Los ejercicios que leen texto usan `std::getline`; los que leen números, `std::cin >>`.

## Ruta de C++ (planificada)

| Módulo                      | Lecciones                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Fundamentos                 | Variables y tipos, Tipos de datos básicos, Condicionales, Bucles, Funciones, Arrays y vectores, Structs |
| Cadenas y entrada           | Entrada y salida, Cadenas (string), Operaciones con cadenas                          |
| Funciones y memoria         | Parámetros y retorno, Referencias, Punteros, const y buenas prácticas                |
| Clases                      | Clases y objetos, Constructores y encapsulación, Herencia y polimorfismo             |
| Errores y depuración        | Leer errores del compilador, Excepciones                                             |
| Mini proyectos              | Calculadora, Inventario, Notas de estudiantes                                        |

El contenido de las lecciones se escribe por módulos; mientras tanto C++ sigue como "Próximamente" en la app.

## Progreso

Escritas y verificadas en Piston: Fundamentos (7), Cadenas y entrada (3) y Funciones y memoria (4). Pendientes: Clases (3), Errores y depuración (2) y Mini proyectos (3). C++ se activa en la app cuando estén todas.
