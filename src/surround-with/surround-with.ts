import * as vscode from 'vscode';
import { editor } from "../common/editor";
import { KnownLanguageIds, knownLanguageIds, selectTextWrapper, wrapperPlaceholder } from "./select-text-wrapper";
import { parseError } from '../common/parse-error';

export async function surroundWith(): Promise<string | undefined> {
  try {
    
    const selectedText = editor.getSelectedText();
    if (!selectedText) {
      return Promise.reject('No text selected to surround with HTML tag.');
    }
    const languageId: KnownLanguageIds = knownLanguageIds.find(id => id === editor.getActiveDocumentLanguageId()) ?? 'plaintext';

    const wrapper = await selectTextWrapper(languageId);
    if (!wrapper) {
      return Promise.reject('No HTML tag selected.');
    }

    if (wrapper.includes(wrapperPlaceholder)) {
      return wrapper.replace(wrapperPlaceholder, selectedText);
    }

    // else assume it's a tag
    return `<${wrapper}>${selectedText}</${wrapper}>`;

  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${parseError(error)}`);
  }
}