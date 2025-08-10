// utils/markdownProcessor.ts
export const processMarkdown = (markdown: string): string => {
  let html = markdown;

  // Procesar títulos
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-bold mb-4 text-blue-600">$1</h1>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-semibold mb-3 text-gray-800 mt-6">$1</h2>'
  );
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-semibold mb-2 text-gray-700 mt-4">$1</h3>'
  );

  // Procesar texto en negrita
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-800">$1</strong>'
  );

  // Procesar líneas horizontales
  html = html.replace(/^---$/gim, '<hr class="my-6 border-gray-300" />');

  // Procesar listas
  html = html.replace(/^- (.*$)/gim, '<li class="text-gray-600 ml-2">$1</li>');
  html = html.replace(
    /(<li.*<\/li>)/gims,
    '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>'
  );

  // Procesar párrafos (líneas que no son títulos ni listas)
  html = html.replace(
    /^(?!<[h|u|l|hr])([^\n\r]+)$/gim,
    '<p class="mb-3 text-gray-600 leading-relaxed">$1</p>'
  );

  // Procesar checkboxes
  html = html.replace(/☑️/g, '<span class="text-green-500 mr-2">✓</span>');

  // Procesar emojis comunes
  html = html.replace(/🔒/g, '<span class="mr-2">🔒</span>');
  html = html.replace(/📜/g, '<span class="mr-2">📜</span>');
  html = html.replace(/🕐/g, '<span class="mr-2">🕐</span>');
  html = html.replace(/💰/g, '<span class="mr-2">💰</span>');
  html = html.replace(/📦/g, '<span class="mr-2">📦</span>');
  html = html.replace(/👥/g, '<span class="mr-2">👥</span>');

  return html;
};
