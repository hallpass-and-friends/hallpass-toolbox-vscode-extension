// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Logger } from './logger';
import { TemplatingPanel } from './templating/templating-panel.class';
import { FoldersProvider } from './toolbox-view/folders-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	const logger = new Logger();
	// This line of code will only be executed once when your extension is activated
	logger.log('Hallpass Toolbox extension is now active!');

	
	context.subscriptions.push(
		vscode.commands.registerCommand('toolbox.templating', () => {				
			TemplatingPanel.activate(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('toolbox.folders', () => {				
			vscode.window.showWarningMessage("todo: need to implement this command");
		})
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider("hallpass-folders", new FoldersProvider(context))
	);

}



// This method is called when your extension is deactivated
export function deactivate() {}
