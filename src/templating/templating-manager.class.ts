import * as vscode from 'vscode';

import { Configuration, TemplatingConfig } from '../configuration';
import { isNullish, Nullable } from '../common/nullable';
import { TemplateItem } from "./template-item.type";
import { readTextFile, readTextFileFS } from '../common/read-text-file';
import { Logger } from '../logger';
import { directoryListingDeep, DirectoryListingItem } from '../common/directory-listing';
import { makeDirectory } from '../common/make-directory';
import { copyFileWithBackup } from '../common/copy-and-rename-file';
import { writeTextFileFS } from '../common/write-text-file';

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

  processTemplate(template: TemplateItem, fields: any, target: string) {
    this.#logger.log("[Templating] Processing Template...");
    this.#logger.log(`  - template: (${template.id}) ${template.label}`);
    this.#logger.log(`  - target: ${target} (${vscode.Uri.joinPath(this.#workspaceUri, target).fsPath})`);
    if (typeof(fields) === 'object') {
      Object.keys(fields).forEach(id => {
        const {field, value} = fields[id];
        this.#logger.log(`  - {${id}} ${field.label} = '${value}'`);
      });
    }

    this.getFilesToCopy(template)
      .then(
        (files) => {
          this.copyFiles(template, target, fields, files);
        }
      )
      .catch(
        (reason) => {
          this.#logger.error("[Templating] error getting the files to copy", reason);
        }
      );
  }

  protected getFilesToCopy(template: TemplateItem): Promise<DirectoryListingItem[]> {
    return directoryListingDeep(this.#workspaceUri, this.#config.basePath, template.path);
  }

  protected parseTarget(sourceBase: string, sourceFull: string, target: string, fields: any) {
    const EXT = '.tmpl';
    let source = sourceFull.replace(sourceBase, '');
    if (sourceFull.endsWith(EXT)) {
      source = source.substring(0, source.length - EXT.length);
    }

    //substitute fields values for placeholders
    const substitute = (filename: string, id: string, value: string) => {
      const replacements = [
        { search: `{${id}}`, replace: value }, //normal
        { search: `{${id.toLocaleLowerCase()}}`, replace: value.toLocaleLowerCase() }, //lowercase
        { search: `{${id.toLocaleUpperCase()}}`, replace: value.toLocaleUpperCase() }, //uppercase
      ];
      replacements.forEach(m => {
        if (filename.includes(m.search)) {
          filename = filename.replaceAll(m.search, m.replace);
        }
      });
      return filename;
    };
    
    Object.keys(fields).forEach((id) => {
      const {field, value} = fields[id];
      if (field.id === id) {
        source = substitute(source, id, value);
      }
    });

    return vscode.Uri.joinPath(this.#workspaceUri, target, source).fsPath;
  }

  protected copyFiles(template: TemplateItem, target: string, fields: any, files: DirectoryListingItem[]) {
    this.#logger.log(`[Templating] Copying ...`);
    
    //be sure the target exists
    const fullTargetPath = vscode.Uri.joinPath(this.#workspaceUri, target).fsPath;
    if (makeDirectory(fullTargetPath)) {
      this.#logger.log(`  - DIR (${fullTargetPath})`);
    }

    //baseName is used to convert _source filename to _target filename.
    const baseName = vscode.Uri.joinPath(this.#workspaceUri, this.#config.basePath, template.path).fsPath;
    files.forEach(f => {
      const _source = f.name;
      const _target = this.parseTarget(baseName, _source, target, fields);
      switch(f.type) {
        case vscode.FileType.Directory: {
          const result = makeDirectory(_target);
          if (result) {
            this.#logger.log(`  - DIR (${_target})`);
          }
          break;
        }
        case vscode.FileType.File: {
          const result = copyFileWithBackup(_source, _target);
          this.#logger.log(`  - FILE ${result ? 'OK' : 'IGNORED'} (${_target})`);
          this.customizeFile(_target, fields);
          break;
        }
        default:
          this.#logger.log(`  - ignoring (${f.name})`);
      }
    });
  }

  protected customizeFile(filePath: string, fields: any) {
    try {
      //read file
      const original = readTextFileFS(filePath);
      let content = original;

      //substitute fields values for placeholders
      const substitute = (content: string, id: string, value: string) => {
        const replacements = [
          { search: `{${id}}`, replace: value }, //normal
          { search: `{${id.toLocaleLowerCase()}}`, replace: value.toLocaleLowerCase() }, //lowercase
          { search: `{${id.toLocaleUpperCase()}}`, replace: value.toLocaleUpperCase() }, //uppercase
        ];
        replacements.forEach(m => {
          if (content.includes(m.search)) {
            content = content.replaceAll(m.search, m.replace);
          }
        });
        return content;
      };
      
      Object.keys(fields).forEach((id) => {
        const {field, value} = fields[id];
        if (field.id === id) {
          content = substitute(content, id, value);
        }
      });

      if (content !== original) {
        //changes were made, so save file
        writeTextFileFS(content, filePath);
      }

    } catch (error) {
      const message = ('message' in (error as any))
        ? (error as any).message 
        : `${error}`;
      this.#logger.error(`[TemplatingManager] customizeFile() - error - ${message}`);
    }
  }
}