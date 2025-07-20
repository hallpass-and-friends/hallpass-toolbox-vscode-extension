import * as vscode from 'vscode';

import { editor } from "../common/editor";
import { selectTextWrapper } from "./select-text-wrapper";
import { parseError } from '../common/parse-error';
import { knownLanguageIds, KnownLanguageIds } from '../common/known-language-id.type';
import { textWrapperFns } from './text-wrappers.fns';

export async function surroundWith(): Promise<boolean> {
  try {

    const selectedText = editor.getSelectedText();
    if (!selectedText) {
      return Promise.reject('No text selected.  Please select some text.');
    }
    const languageId: KnownLanguageIds = knownLanguageIds.find(id => id === editor.getActiveDocumentLanguageId()) ?? 'plaintext';

    const wrapper = await selectTextWrapper(languageId);
    if (!wrapper) {
      return Promise.reject('No wrapper selected.');
    }

    const wrapperFn = textWrapperFns[languageId];
    const newText = wrapperFn(wrapper, selectedText);
    if (editor.replaceSelectedText(newText)) {
      vscode.window.showInformationMessage(`Text surrounded with ${wrapper} successfully.`);
      return true;
    } else {
      return Promise.reject(`Text surrounded with ${wrapper} failed.`);
    }

  } catch (error) {
    return Promise.reject(`Error: ${parseError(error)}`);
  }
}