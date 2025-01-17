import * as vscode from "vscode";
import { Nullable } from "../common/nullable";
import { Logger } from "../logger";

const demo = {
  root: {
    bob: {
      win: { tyler: null, jackie: { latte: null }},
      rob: { ruby: { chester: null }, chapin: null }
    },
    liz: {
      chuck: { preston: null },
      henry: { cory: null, chen: null },
      bill: null,
      katie: null,
    },
    bill: {
      shelly: { kat: { katBoy: null, katGirl: null }, will: null },
      john: { alex: null, max: null },
      joe: { melissa: { melBoy1: null, melGirl1: null, melGirl2: null }},
      ned: null,
      ellen: { aaron: null }
    }
  }
};

type KeyObject = [string, any];

function getRoot(): KeyObject {
  return ["root", demo.root];
}
function findNode(key: string): Nullable<KeyObject> {
  
  function _find(obj: any): Nullable<KeyObject> {
    if (!obj) {
      return null;
    }

    const keys = Object.keys(obj);
    if (keys.includes(key)) {
      return [key, obj[key]];
    }
    //else
    return keys.reduce((ret: Nullable<KeyObject>, curr) => {
      if (obj[curr]) {
        return ret ?? _find(obj[curr]);
      }
      else {
        return ret;
      }
    }, null);
  }
  
  return _find(demo);
}

function findParentNode(key: string): Nullable<KeyObject> {
  
  function _find([parent, obj]: KeyObject): Nullable<KeyObject> {
    if (!obj) {
      return null;
    }

    const keys = Object.keys(obj);
    if (keys.includes(key)) {
      return [parent, obj];
    }
    //else
    return keys.reduce((ret: Nullable<KeyObject>, curr) => {
      if (obj[curr]) {
        return _find([curr, obj[curr]]);
      }
      else {
        return ret;
      }
    }, null);
  }
  
  return _find(['', demo]);
}

export class FoldersProvider implements vscode.TreeDataProvider<string> {
  #logger = new Logger();
  #context: vscode.ExtensionContext;
  private _onDidChangeTreeData = new vscode.EventEmitter<Nullable<string>>();  
  readonly onDidChangeTreeData: vscode.Event<Nullable<string>> = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
  }
  getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
    this.#logger.log("[FolderProvider] getTreeItem", element);
    if (element) {
      return Promise.resolve(this._toTreeItem(element));
    }
    else {
      return Promise.resolve(this._toTreeItem(Object.keys(demo).at(0) ?? "unknown"));
    }
  }
  getChildren(element?: string | undefined): vscode.ProviderResult<string[]> {
    this.#logger.log("[FolderProvider] getChildren", element);
    const ret = findNode(element ?? "root");
    return Promise.resolve(ret ? Object.keys(ret.at(1)) : null);
  }

  getParent?(element: string): vscode.ProviderResult<string> {
    this.#logger.log("[FolderProvider] getParent", element);
    const ret = findParentNode(element);
    return Promise.resolve(ret ? ret.at(0) : 'unknown');
  }
  resolveTreeItem?(item: vscode.TreeItem, element: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    this.#logger.log("[FolderProvider] resolveTreeItem", element);
    return Promise.resolve(this._toTreeItem(element));
  }

  private _toTreeItem(key: string): vscode.TreeItem {
    const ret = new vscode.TreeItem(key, vscode.TreeItemCollapsibleState.Collapsed);
    ret.description = "this is the description";
    ret.tooltip = "this is the tooltip";
    return ret;
  }

}