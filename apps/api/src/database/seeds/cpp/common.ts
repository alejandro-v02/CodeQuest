// Shared pieces of the C++ starter programs. Every test case feeds its input
// through the standard input, and the output is compared without trailing
// spaces. `using namespace std;` keeps the code short for beginners (the
// first lesson explains it).
export const INCLUDES =
  '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <cmath>\n#include <map>\n#include <sstream>\n#include <iomanip>\n\nusing namespace std;\n\n';

// A complete, empty program: what most starters build on.
export const PLANTILLA = `${INCLUDES}int main() {\n  // TODO\n  return 0;\n}\n`;

// Opening of a main() that already collected every input line in `lineas`
// (left open on purpose: the exercise body and FIN close it).
export const ENTRADA = `${INCLUDES}int main() {\n  vector<string> lineas;\n  string linea;\n  while (getline(cin, linea)) {\n    lineas.push_back(linea);\n  }\n`;

export const FIN = '  return 0;\n}\n';
