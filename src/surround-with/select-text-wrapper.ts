import * as vscode from 'vscode';
import { KnownLanguageIds } from '../common/known-language-id.type';
import { wrapperQuickPickItems } from './text-wrappers.items';


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
  quickPick.items = wrapperQuickPickItems[languageId];
  quickPick.title = `Surround with ${languageId} code`;
  quickPick.placeholder = `Select a ${languageId} code snippet to surround the text`;
  quickPick.show();

  return new Promise((resolve) => {
    quickPick.onDidChangeSelection((selection) => {
      resolve(parseWrapper(selection[0]));
      quickPick.hide();
    });
    quickPick.onDidHide(() => {
      resolve(undefined); //in case we did not resolve already
    });
  });
}
