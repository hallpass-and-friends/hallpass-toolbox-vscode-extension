import * as vscode from 'vscode';

export class Logger {
  #channel!: vscode.OutputChannel;

  constructor() {
    this.#channel = Logger.getOutputChannel();  
  }

  log(...args: unknown[]) {
    this.#channel.appendLine(args.map(m => `${m}`).join(', '));
  }
  error(...args: unknown[]) {
    this.#channel.appendLine('ERR: ' + args.map(m => `${m}`).join(', '));
  }

  protected static outputChannel: vscode.OutputChannel | null = null;
  protected static getOutputChannel() {
    if (!this.outputChannel) {
      this.outputChannel = vscode.window.createOutputChannel('Hallpass');
      this.outputChannel.show(false);  
      this.outputChannel.appendLine("Hallpass Output Channel is Active");  
    }
    return this.outputChannel;
  }
}