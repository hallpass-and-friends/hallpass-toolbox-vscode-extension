import * as vscode from 'vscode';
import { isNullish, Nullable } from './../common/nullable';
import { getWebviewOptions } from '../common/webview-options';
import { getNonce } from '../common/nonce';
import { TemplateItem } from './template-item.type';
import { TemplatingManager } from './templating-manager.class';
import { getWorkspaceUri } from '../common/workspace-uri';

export class TemplatingPanel {

  //#region STATIC Properties and Methods
  public static instance: Nullable<TemplatingPanel>;
  public static readonly viewType = 'hallpass-templating';

  public static activate(extensionUri: vscode.Uri) {
    if (!isNullish(this.instance)) {
      this.instance._panel.reveal();
      return; 
    }

    //else, create the instance
    const panel = vscode.window.createWebviewPanel(
      this.viewType,
      "Hallpass Templating",
      vscode.ViewColumn.One,
      getWebviewOptions(extensionUri)
    );

    this.instance = new TemplatingPanel(panel, extensionUri);
  }

  public static refresh(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.instance = new TemplatingPanel(panel, extensionUri);
  }

  private static mediaUri(webview: vscode.Webview, extensionUri: vscode.Uri, ...path: string[]) {
    const uri = vscode.Uri.joinPath(extensionUri, 'media', ...path);
    return webview.asWebviewUri(uri);
  }

  //#region Instance Properties and Methods
  private readonly _panel!: vscode.WebviewPanel;
  private readonly _extensionUri!: vscode.Uri;
  private readonly _manager!: TemplatingManager;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._manager = new TemplatingManager(getWorkspaceUri());

    this._buildPanelContent();  //create the html for the panel

    //setup event handles
    this._panel.onDidDispose(() => this.dispose()); 
    this._panel.webview.onDidReceiveMessage(message => this._handleMessageFromPanel(message));
  }



  private _buildPanelContent() {
    const view = this._panel.webview;
    const uri = this._extensionUri;

    //css
    const commonCss = TemplatingPanel.mediaUri(view, uri, 'common.css');
    const templatingCss = TemplatingPanel.mediaUri(view, uri, 'templating', 'main.css');
    //scripts
    const commonJs = TemplatingPanel.mediaUri(view, uri, 'common.js');
    const templatingJs = TemplatingPanel.mediaUri(view, uri, 'templating', 'main.js');
    //logo
    const logo = TemplatingPanel.mediaUri(view, uri, 'templating-logo.png');

    const nonce = getNonce();  //for security policy

    view.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hallpass Templating</title>

				<!--content security policy ... images from https or extension directory,
					and scripts with our nonce.
				-->
				<meta 
          http-equiv="Content-Security-Policy" 
          content="default-src 'none'; style-src ${view.cspSource}; img-src ${view.cspSource} https:; script-src 'nonce-${nonce}';" />


				<link href="${commonCss}" rel="stylesheet">
				<link href="${templatingCss}" rel="stylesheet">

			</head>
			<body>

        <h1 class="grid">
          <img src="${logo}" width="40" />
          <span>Hallpass Templating</span>
        </h1>

        <h3>Select Template</h3>
        <div class="select-list" id="templates"></div>
        
        <div class="my-4">
          <button type="button">Done</button>
        </div>

				<script nonce="${nonce}" src="${commonJs}"></script>
				<script nonce="${nonce}" src="${templatingJs}"></script>
			</body>
			</html>`;
  }

  private _handleMessageFromPanel(message: any) {
    switch (message.command) {
      case 'message':
      case 'info':
        vscode.window.showInformationMessage(message.text ?? `Unknown message sent to ${TemplatingPanel.viewType}`);
        break;
      case 'alert':
      case 'warning':
        vscode.window.showWarningMessage(message.text ?? `Unknown warning message sent to ${TemplatingPanel.viewType}`);
        break;
      case 'error':
      case 'critical':
        vscode.window.showErrorMessage(message.text ?? `Unknown error message sent to ${TemplatingPanel.viewType}`);
        break;

      case 'get-templates':
        const templates = this._manager.getTemplates();
        if (templates) {
          this._panel.webview.postMessage({ command: "templates", data: templates });
        }        
        break;
      case 'set-template':
        const template = message.data;
        if (template) {
          this._manager.currentTemplate = template;
        }        
        break;
      
      //todo: handle other messages

      default:
        vscode.window.showInformationMessage(`Unhandled message ... command = '${message.command}'`);
        break;

    }
  }

  public dispose() {
    TemplatingPanel.instance = null;  //remove instance
    this._panel.dispose(); //clean up panel;
    this._disposables.forEach(d => d.dispose());  //dispose others
  }

}