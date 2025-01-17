// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Logger } from './logger';
import { TemplatingPanel } from './templating/templating-panel.class';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	const logger = new Logger();
	// This line of code will only be executed once when your extension is activated
	logger.log('Hallpass Toolbox extension is now active!');


	//setup the configuration
	//const config = new Configuration();
	
	context.subscriptions.push(
		vscode.commands.registerCommand('toolbox.helloWorld', () => {				
			TemplatingPanel.activate(context.extensionUri);
		})
	);

	// if (typeof vscode.window.registerWebviewPanelSerializer === 'function') {
	// 	vscode.window.registerWebviewPanelSerializer(TemplatingPanel.viewType, {
	// 		async deserializeWebviewPanel(panel: vscode.WebviewPanel, state: unknown) {
	// 			logger.log('WebviewPanel State', state);
	// 			panel.webview.options = getWebviewOptions(context.extensionUri);
	// 			TemplatingPanel.refresh(panel, context.extensionUri);
	// 		}
	// 	});
	// }
}



// This method is called when your extension is deactivated
export function deactivate() {}
