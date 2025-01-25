import * as vscode from 'vscode';
import { Logger } from './logger';

export type TemplatingConfig = {
  basePath: string;
  config: string;  
}

export class Configuration {
  #logger!: Logger;

  #templating!: TemplatingConfig;
  get templating() {
    return {...this.#templating}; //shallow clone
  }

  constructor() {
    this.#logger = new Logger();
    this.refresh();
  }

  refresh() {
    this.#logger.log("Loading the Hallpass Toolbox Configuration");
    const config = vscode.workspace.getConfiguration("hallpassToolbox");
    this.#templating = {
      basePath: config.get('templating.basePath') ?? '.vscode/hallpass/templating',
      config: config.get('templating.config') ?? 'config.json',
    };

    this.#logger.log(`[Templating] basePath - ${this.templating.basePath}, config - ${this.templating.config}`);
  }
}