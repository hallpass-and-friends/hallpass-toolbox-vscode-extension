import * as vscode from 'vscode';
import { Nullable } from './../nullable';

/**
 * Retrieves the currently selected text in the active text editor.
 * If no text is selected, returns null.
 * If no active text editor is available, returns undefined.
 *
 * @returns {Nullable<string>} The selected text or null/undefined.
 */
export function getSelectedText(): Nullable<string> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        return null;
    }

    const selectedText = editor.document.getText(selection);
    return selectedText;
  }