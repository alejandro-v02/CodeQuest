// Lesson text is full of backticks (inline code and fenced blocks), which
// would all need escaping inside a template literal. Content is written with
// § standing in for a backtick, and no ${} interpolation (String.raw keeps
// backslashes like \n literal, so Python escapes show up as written).
export function md(strings: TemplateStringsArray): string {
  return strings.raw[0].replace(/§/g, '`').trim();
}
