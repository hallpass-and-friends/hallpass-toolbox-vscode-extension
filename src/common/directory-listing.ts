import * as vscode from 'vscode';

export type DirectoryListingItem = {
  name: string;
  type: vscode.FileType;
}

export function directoryListing(extensionUri: vscode.Uri, ...path: string[]) {
  const uri = vscode.Uri.joinPath(extensionUri, ...path);
  return new Promise<DirectoryListingItem[]>((resolve, reject) => {
    vscode.workspace.fs.readDirectory(uri)
      .then(
        (results) => {
          resolve(results.map(([name, type]) => ({ name, type })));
        },
        (reason) => {
          reject(`Error reading a directory: ${reason}`);
        }
      );
  });
}