import * as vscode from 'vscode';
import { getActiveEditor } from './get-active-editor';

export function getActiveDocument(): vscode.TextDocument | undefined {
    const editor = getActiveEditor();
    return editor 
      ? editor.document 
      : undefined;
}