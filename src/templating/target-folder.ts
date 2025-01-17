import * as vscode from 'vscode';

export function getTargetFolder() {
  const items: vscode.QuickPickItem[] = [
    {
      label: 'src',
      description: 'The source folder',
      detail: '{workspace}/src/',      
      iconPath: vscode.ThemeIcon.Folder,
    },
    {
      label: 'testing',
      description: 'The testing folder',
      detail: '{workspace}/src/testing/',      
      iconPath: vscode.ThemeIcon.Folder,
    },
    {
      label: 'view',
      description: 'The view folder',
      detail: '{workspace}/src/views/',      
      iconPath: vscode.ThemeIcon.Folder,
    },
  ];

  return new Promise<vscode.QuickPickItem>((resolve, reject) => {
    vscode.window.showInformationMessage(`Quick Pick... target`);
    vscode.window.showQuickPick(items, { title: 'Templating Target', placeHolder: 'Select Target...'})
      .then(
        (result) => {
          if (result) {
            resolve(result);            
          }
          else {
            reject('Nothing Selected!');
          }
        },
        (reason) => {
          reject(reason);
        }
      );
  });
}