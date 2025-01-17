import fs from 'fs';
import { Nullable } from "../../common/nullable";
import { FolderItem } from "./folder-item.type";
import { Logger } from '../../logger';
import { FolderTree } from './folder-tree.class';
import { TreeNode } from '../../common/tree/tree-node.class';

export class FolderDataSource {
  #path: Nullable<string>;
  #tree: FolderTree = new FolderTree();
  #logger = new Logger();

  constructor(path?: string) {
    if (path) { this.load(path); }
  }


  //#region >>> Build the Folder Tree <<<

  load(path: string) {
    const folders: FolderItem[] = fs.readdirSync(path, { recursive: true, withFileTypes: true })
      .filter(ent => ent.isDirectory())
      .map(ent => {
        const parent = ent.parentPath.replace(path, '');
        return {
          name: ent.name,
          parent
        }
      });
    folders.forEach(f => this.#tree.addChild(f.parent, f));

    this.#logger.log("FolderDataSource", path);
    const display = (node: TreeNode<FolderItem>) => {
      this.#logger.log(`[${node.value.name}]`, node.id);
    }

    return true;
  }

  //#endregion
}