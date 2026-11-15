// Starter lines shared by C++ exercises that read stdin: every test case's
// input arrives one value per line, in order, and `lineas` holds them all.
// Exercises that need a single number or word can read it with std::cin
// instead; this header is for the ones that process several lines.
export const ENTRADA =
  '#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n  std::vector<std::string> lineas;\n  std::string linea;\n  while (std::getline(std::cin, linea)) {\n    lineas.push_back(linea);\n  }\n';
