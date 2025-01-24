import * as vscode from "vscode";
import { isNullish, Nullable } from "../common/nullable";
import { Logger } from "../logger";
import { FolderDataSource, FolderTreeItem } from "./folders/folder-data-source";
import { getWorkspaceUri } from "../common/workspace-uri";

export class FoldersProvider implements vscode.TreeDataProvider<FolderTreeItem> {
  #logger = new Logger();
  #context: vscode.ExtensionContext;
  #data: FolderDataSource;
  private _onDidChangeTreeData = new vscode.EventEmitter<Nullable<FolderTreeItem>>();  
  readonly onDidChangeTreeData: vscode.Event<Nullable<FolderTreeItem>> = this._onDidChangeTreeData.event;

  get size() { return this.#data.tree.size; }
  get depth() { return this.#data.tree.depth; }

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
    this.#data = new FolderDataSource();
    this.refresh();
  }

  refresh() {
    const uri = getWorkspaceUri();
    if (uri) {
      this.#data.load(uri.fsPath);  
      this._onDidChangeTreeData.fire(undefined);
    }
    else {
      this.#logger.log("Could not find workspace uri");
    }
  }

  copyPath(element?: Nullable<FolderTreeItem>) {
    return new Promise<string | false>((resolve, reject) => {
      try {
        if (isNullish(element)) {
          resolve(false); // nothing to copy
        } 
        else {
          const target = this.#data.relativePath(element.value);
          vscode.env.clipboard.writeText(target)
            .then(
              () => {
                this.#logger.log("[FoldersProvider] Copied to clipboard:", target);
                resolve(target);
              },
              (reason) => {
                reject(reason);
              }
            );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getTreeItem(element: FolderTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    this.#logger.log("[FolderProvider] getTreeItem", this._format(element));    
    if (element) {
      return Promise.resolve(this._toTreeItem(element));
    }
    else {
      return Promise.resolve(this._toTreeItem(this.#data.tree.getRoot()));
    }
  }
  getChildren(element?: FolderTreeItem | undefined): vscode.ProviderResult<FolderTreeItem[]> {
    this.#logger.log("[FolderProvider] getChildren", isNullish(element) ? '-root-' : this._format(element));
    return (element ?? this.#data.tree.getRoot()).children;    
  }

  getParent?(element: FolderTreeItem): vscode.ProviderResult<FolderTreeItem> {
    this.#logger.log("[FolderProvider] getParent", this._format(element));
    return element.parent;
  }
  resolveTreeItem?(item: vscode.TreeItem, element: FolderTreeItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    this.#logger.log("[FolderProvider] resolveTreeItem", this._format(element));
    return this._toTreeItem(element);
  }

  private _format(element: FolderTreeItem): string {
    return `${element.value.parent}[${element.value.name}]`;
  }

  private _toTreeItem(node: FolderTreeItem): vscode.TreeItem {
    const ret = new vscode.TreeItem(node.value.name, node.isLeaf ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed);
    ret.id = node.id;
    ret.tooltip = this.#data.fullPath(node.value);
    return ret;
  }

}