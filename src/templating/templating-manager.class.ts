import * as vscode from 'vscode';
import { Configuration, TemplatingConfig } from '../configuration';
import { isNullish, Nullable } from '../common/nullable';
import { TemplateItem } from "./template-item.type";
import { readTextFile } from '../common/read-text-file';
import { directoryListing } from '../common/directory-listing';
import { Logger } from '../logger';

export type TemplatingData = {  
  templates: TemplateItem[];
}

export class TemplatingManager {
  #workspaceUri!: vscode.Uri;
  #logger!: Logger;
  #config!: TemplatingConfig;
  #data: Nullable<TemplatingData>;

  #currentTemplate: Nullable<TemplateItem>;
  get currentTemplate(): Nullable<TemplateItem> {
    return isNullish(this.#currentTemplate)
      ? null
      : {...this.#currentTemplate};
  }
  set currentTemplate(value: Nullable<TemplateItem>) {
    this.#currentTemplate = value;
    vscode.window.showInformationMessage(`Current Template: ${value?.label ?? 'none'}`);
  }

  constructor(workspaceUri: Nullable<vscode.Uri>) {    
    if (!workspaceUri) { throw new Error("Unable to create TemplatingManager - missing workspaceUri"); }
    this.refresh(workspaceUri);
  }

  refresh(workspaceUri?: vscode.Uri) {
    this.#workspaceUri = workspaceUri ?? this.#workspaceUri;
    this.#logger = new Logger();
    this.#config = new Configuration().templating;
    this.#data = null; //clear

    readTextFile(this.#workspaceUri, this.#config.basePath, this.#config.config)
      .then(
        (result) => {
          this.#data = JSON.parse(result);
          vscode.window.showInformationMessage(`Loaded Templating Data (from ${this.#config.config})`);
        },
        (reason) => {
          vscode.window.showErrorMessage(`Unable to load Templating Data: ${reason}`);
        }
      );
  }

  getTemplates() {
    if (this.#data) {
      return this.#data.templates;
    }
    //else
    vscode.window.showWarningMessage(`Unable to retrieve templates - data has not been loaded!`);
    return null;
  }
}