import * as vscode from 'vscode';

export const knownLanguageIds = [
  'html',
  'xml',
  'javascript',
  'typescript',
  'css',
  'json',
  'markdown',
  'plaintext',
];
export type KnownLanguageIds = (typeof knownLanguageIds)[number];

export const wrapperPlaceholder = '■'; // Placeholder for the selected text in the wrapper description

const htmlWrappers: vscode.QuickPickItem[] = [
  { label: 'div', description: `HTML div tag :: <div>${wrapperPlaceholder}</div>` },
  { label: 'span', description: `HTML span tag :: <span>${wrapperPlaceholder}</span>` },
  { label: 'p', description: `HTML paragraph tag :: <p>${wrapperPlaceholder}</p>` },
  { label: 'strong', description: `HTML strong tag :: <strong>${wrapperPlaceholder}</strong>` },
  { label: 'em', description: `HTML emphasis tag :: <em>${wrapperPlaceholder}</em>` },
];
const xmlWrappers: vscode.QuickPickItem[] = [];
const javascriptWrappers: vscode.QuickPickItem[] = [
  { label: 'double-quote', description: `JavaScript double quote string :: " ${wrapperPlaceholder} "` },
  { label: 'single-quote', description: `JavaScript single quote string :: ' ${wrapperPlaceholder} '` },
  { label: 'template-literal', description: `JavaScript template literal string :: \`${wrapperPlaceholder}\`` },
  { label: 'function', description: `JavaScript function declaration :: function name() { ${wrapperPlaceholder} }` },
  { label: 'arrow-function', description: `JavaScript arrow function :: (params) => { ${wrapperPlaceholder} }` },
  { label: 'object-spread', description: `JavaScript object spread syntax :: { ...${wrapperPlaceholder} }` },
  { label: 'array-spread', description: `JavaScript array spread syntax :: [ ...${wrapperPlaceholder} ]` },
];    //also used for typescript
const cssWrappers: vscode.QuickPickItem[] = [];
const jsonWrappers: vscode.QuickPickItem[] = [];
const markdownWrappers: vscode.QuickPickItem[] = [];

const items: {[key in KnownLanguageIds]: vscode.QuickPickItem[]} = {
  html: htmlWrappers,
  xml: xmlWrappers,
  javascript: javascriptWrappers,
  typescript: javascriptWrappers,
  css: cssWrappers,
  json: jsonWrappers,
  markdown: markdownWrappers,
};

function parseWrapper(item: vscode.QuickPickItem): string {
  const parts = (item.description ?? '').split('::');
  if (parts.length < 2) {
    return item.label; // Fallback to label if description is not in expected format
  }
  return parts[1].trim(); // Return the parsed wrapper
}

/**
 * Prompts the user to select a text wrapper from a predefined list.
 * Returns the selected wrapper or undefined if no selection is made.
 *
 * @returns {Promise<string | undefined>} The selected text wrapper or undefined.
 */
export async function selectTextWrapper(languageId: KnownLanguageIds): Promise<string | undefined> {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = items[languageId];
  quickPick.title = `Surround with ${languageId} code`;
  quickPick.placeholder = `Select a ${languageId} code snippet to surround the text`;
  quickPick.show();

  return new Promise((resolve) => {
    quickPick.onDidChangeSelection((selection) => {
      resolve(parseWrapper(selection[0]));
      quickPick.hide();
    });
    quickPick.onDidHide(() => {
      resolve(undefined);
    });
  });
}
