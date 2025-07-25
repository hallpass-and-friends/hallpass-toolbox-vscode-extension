// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Logger } from './logger';
import { TemplatingPanel } from './templating/templating-panel.class';
import { FoldersProvider } from './toolbox-view/folders-provider';
import { editor } from './common/editor';
import { isNullish, isUndefined } from './common/nullable';
import { surroundWith } from './surround-with/surround-with';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	const logger = new Logger();
	// This line of code will only be executed once when your extension is activated
	logger.log('Hallpass Toolbox extension is now active!');

	const foldersProvider = new FoldersProvider(context);
	
	//todo: this is an experiment
	// inspiration was need to wrap HTML (e.g. cool => <strong>cool</strong>)
	// but the Emmet: Wrap With Abbreviation ... command works
	// and we can create shortcuts !  https://stackoverflow.com/a/46854557
	context.subscriptions.push(
		vscode.commands.registerCommand('hallpassToolbox.surround-with', async () => {
			await surroundWith();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('hallpassToolbox.templating', () => {				
			TemplatingPanel.activate(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('hallpassFolders.refresh-folders', () => {
			foldersProvider.refresh();							
			vscode.window.showInformationMessage(`Folders refreshed.  Total of ${foldersProvider.size} folders, with a depth of ${foldersProvider.depth} levels.`);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('hallpassFolders.copy-path', (target: any) => {
			foldersProvider.copyPath(target)
				.then(
					(result) => {
						if (result) {
							vscode.window.showInformationMessage(`Path Copied to Clipboard: ${result}`);
						}
						else {
							vscode.window.showWarningMessage(`Unable to copy path to clipboard.`);
						}
					}
				)
				.catch(
					(reason) => {
						vscode.window.showErrorMessage(`Error copying path to clipboard`);
					}
				);
		})
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider("hallpassFolders", foldersProvider)
	);

}



// This method is called when your extension is deactivated
export function deactivate() {}
