export function parseTemplateSyntax(text: string, values: Record<string, string | number>) {
  let templateParsed = text;

  for (const key in values) {
    const DataBindingSyntax = new RegExp(`\\\${{(${key}|[\\s])+}}`, 'g');
    templateParsed = templateParsed.replace(DataBindingSyntax, String(values[key]));
  }

  return templateParsed;
}
