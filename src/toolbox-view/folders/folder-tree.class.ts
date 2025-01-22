
import { Tree } from "../../common/tree/tree.class";
import { Logger } from "../../logger";
import { FolderItem } from "./folder-item.type";
import path from 'path';

export class FolderTree extends Tree<FolderItem> {
  protected readonly ID_DELIM = '|';
  constructor() {
    super();
    this._toIdConverter = (value: FolderItem) => {
      return [
        ...value.parent,
        value.name
      ].join(this.ID_DELIM);
    };
    this.valueToString = (value: FolderItem) => {
      return `{name: ${value.name}, parent: ${value.parent.join(this.ID_DELIM)}}`;
    };
    new Logger().log("Setting root", path.delimiter);
    this.setRoot(FolderTree.createFolderItem('',''));
  }

  static parse

  static createFolderItem(name: string, parent: string): FolderItem {
    parent = parent.replaceAll('\\','/');
    return {
      name,
      parent: parent.split('/').map(p => p.trim()).filter(Boolean)
    };
  }
}