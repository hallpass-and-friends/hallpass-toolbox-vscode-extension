import * as vscode from 'vscode';

export const workspaceFS = {
  primaryWorkspace,
  getDirectory,
} as const;


function primaryWorkspace() {
  const ws = vscode.workspace.workspaceFolders;
  if (ws) {
    return ws.at(0);
  }
  //else
  return null;
}

function getDirectory(...segments: string[]) {
  const ws = primaryWorkspace();
  if (!ws) {
    return Promise.reject("Could not find primary workspace");
  }
  //else  
  return vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(ws.uri, ...segments));
}