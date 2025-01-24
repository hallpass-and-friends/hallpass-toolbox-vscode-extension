import fs from 'fs';
import path from 'path';
import { isNullish, Nullable } from "../../common/nullable";
import { FolderItem } from "./folder-item.type";
import { Logger } from '../../logger';
import { FolderTree } from './folder-tree.class';
import { TreeNode } from '../../common/tree/tree-node.class';

export type FolderTreeItem = TreeNode<FolderItem>;

export class FolderDataSource {
  #source: Nullable<string>;
  #tree: FolderTree = new FolderTree();
  #logger = new Logger();

  ignore: string[] = ['.git', '.vscode', 'node_modules'];

  get tree(): FolderTree {
    return this.#tree; //todo: clone?
  }

  constructor(source?: string, ignore?: string[]) {
    if (source) { this.load(source, ignore); }
  }

  clear() {
    this.#tree.getRoot().children.length = 0;
  }

  fullPath(folder: FolderItem) {
    return isNullish(this.#source) 
      ? this.relativePath(folder)
      : path.join(this.#source, folder.parent, folder.name);
  }
  relativePath(folder: FolderItem) {
    return path.join(folder.parent, folder.name);
  }

  //#region >>> Build the Folder Tree <<<

  load(source: string, ignore?: string[]) {
    this.#source = source;
    if (Array.isArray(ignore)) { this.ignore = ignore; }

    this.#logger.log(`loading folders from: ${source} ... ignoring [${this.ignore.join(',')}]`);
    this.clear();

    const findFolders = (source: string, folder?: string): FolderItem[] => {
      const lookup = folder ? path.join(source, folder) : source;
      const current: FolderItem[] = fs.readdirSync(lookup, { recursive: false, withFileTypes: true })
        .filter(ent => ent.isDirectory() && !this.ignore.includes(ent.name))
        .map(ent => {
          let parent = ent.parentPath.replace(source, '');
          if (parent.startsWith('\\') || parent.startsWith('/')) { parent = parent.substring(1); }
          return FolderTree.createFolderItem(ent.name, parent);
        });
      return [
        ...current,
        ...current.flatMap(item => findFolders(source, path.join(item.parent, item.name)))
      ];
    };

    const folders = findFolders(source);

    folders.forEach(f => {
      this.#tree.addChild(f.parent, f);
    });

    this.#logger.log(`Total of ${this.#tree.size} folders, with a depth of ${this.#tree.depth} levels.`);
    return true;
  }

  //#endregion

  
}