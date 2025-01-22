
import { Tree } from "../../common/tree/tree.class";
import { FolderItem } from "./folder-item.type";
import path from 'path';

export class FolderTree extends Tree<FolderItem> {
  constructor() {
    super();
    this._toIdConverter = (value: FolderItem) => {
      return path.join(value.parent, value.name);
    };
    this.valueToString = (value: FolderItem) => {
      return `{name: ${value.name}, parent: ${value.parent}}`;
    };
    this.setRoot({name: path.delimiter, parent: path.delimiter});
  }
}