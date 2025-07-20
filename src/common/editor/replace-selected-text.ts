import * as vscode from 'vscode';
import { getSelection } from './get-selection';
import { getActiveEditor } from './get-active-editor';

/**
 * Replaces the selection (in the active text editor) with the specified text.
 * If nothing is selected or no active editor, returns false.
 * Otherwise, returns true.
 *
 * @returns {boolean} The replace was successful.
 */
export function replaceSelectedText(text: string): boolean {
  const editor = getActiveEditor();
  const selection = getSelection();
  if (!selection || !editor) {
    return false;
  }
  editor.edit(editBuilder => {
    editBuilder.replace(selection, text);
  });
  return true;
}