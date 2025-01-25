import * as vscode from 'vscode';
import fs from 'fs';

export function writeTextFile(content: string, extensionUri: vscode.Uri, ...path: string[]) {
  const uri = vscode.Uri.joinPath(extensionUri, ...path);
  const encoded = new TextEncoder().encode(content);
  return new Promise<boolean>((resolve, reject) => {
    vscode.workspace.fs.writeFile(uri, encoded)
      .then(
        () => {
          resolve(true);
        },
        (reason) => {
          reject(`Error writing to the requested file: ${reason}`);
        }
      );
  });
}

export function writeTextFileFS(content: string, path: string) {
  fs.writeFileSync(path, content, { });
  return true;
}