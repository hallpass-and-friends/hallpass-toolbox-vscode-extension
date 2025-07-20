import * as vscode from 'vscode';
import { Nullable } from './../nullable';

/**
 * Retrieves the currently selection in the active text editor.
 * If nothing is selected, returns null.
 * If no active text editor is available, returns undefined.
 *
 * @returns {Nullable<Selection>} The selection or null/undefined.
 */
export function getSelection(): Nullable<vscode.Selection> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        return null;
    }

    return selection;
  }