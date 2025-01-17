
import { Tree } from "../../common/tree/tree.class";
import { FolderItem } from "./folder-item.type";

export class FolderTree extends Tree<FolderItem> {
  constructor() {
    super();
    this.toIdConverter = (value: FolderItem) => {
      const parent = value.parent.endsWith('/')
          ? value.parent
          : (value.parent + '/');
      return parent + value.name;
    };
    this.setRoot({name: '/', parent: '/'});
  }
}