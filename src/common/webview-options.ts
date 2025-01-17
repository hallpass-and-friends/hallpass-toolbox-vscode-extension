import * as vscode from 'vscode';

export function getWebviewOptions(extensionsUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,

    localResourceRoots: [vscode.Uri.joinPath(extensionsUri, 'media')],
  };
}