import * as vscode from 'vscode';

export function getActiveEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
} 

