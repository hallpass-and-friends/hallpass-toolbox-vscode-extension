import * as vscode from 'vscode';
import fs from 'fs';
import * as fsPath from 'path';

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

export function directoryListingDeep(extensionUri: vscode.Uri, ...path: string[]) {
  const uri = vscode.Uri.joinPath(extensionUri, ...path);
  return new Promise<DirectoryListingItem[]>((resolve, reject) => {
    const files: DirectoryListingItem[] = fs.readdirSync(uri.fsPath, { recursive: true, withFileTypes: true })
      .map(ent => {
        const name = fsPath.join(ent.parentPath, ent.name);
        return { 
          name, 
          type: ent.isFile()
            ? vscode.FileType.File 
            : ent.isDirectory()
              ? vscode.FileType.Directory
              : vscode.FileType.Unknown
        };
      });
    resolve(files);
  });
}