import * as vscode from 'vscode';

export function readTextFile(extensionUri: vscode.Uri, ...path: string[]) {
  const uri = vscode.Uri.joinPath(extensionUri, ...path);
  return new Promise<string>((resolve, reject) => {
    vscode.workspace.fs.readFile(uri)
      .then(
        (result) => {
          try {
            resolve(new TextDecoder().decode(result));
          } catch (error) {
            reject(`Error decoding the file contents: ${error}`);
          }
        },
        (reason) => {
          reject(`Error fetching the requested file: ${reason}`);
        }
      );
  });
}