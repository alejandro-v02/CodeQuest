// Lesson text is full of backticks (inline code and fenced blocks), which
// would all need escaping inside a template literal. Content is written with
// § standing in for a backtick. String.raw keeps backslashes like \n literal
// (so Python/JS escapes show up as written); the only escapes undone here are
// \${ and \` , needed to show JavaScript template literals inside a lesson.
export function md(strings: TemplateStringsArray): string {
  return strings.raw[0]
    .replace(/§/g, '`')
    .replace(/\\\$/g, '$')
    .replace(/\\`/g, '`')
    .trim();
}
