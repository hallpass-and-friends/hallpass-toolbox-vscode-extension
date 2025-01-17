import * as vscode from 'vscode';
import { Nullable } from './nullable';

export function getWorkspaceUri(): Nullable<vscode.Uri> {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders.at(0)?.uri;
  }
  //else
  return null;
}