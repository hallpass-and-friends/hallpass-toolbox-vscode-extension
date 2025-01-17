import { Nullable } from "../nullable";
import { TreeNode } from "./tree-node.class";

export type ValueToId<T> = (value: T) => string;

export class Tree<T> {
  #root!: TreeNode<T>;
  setRoot(value: T) {
    this.#root = new TreeNode<T>(this.#toIdConverter(value), value);
  }

  #toIdConverter: ValueToId<T> = (value: T) => `${value}`;  
  set toIdConverter(fn: ValueToId<T>) {
    this.#toIdConverter = fn;
  }

  constructor(root?: T) {
    if (root) {
      this.#root = new TreeNode(this.toIdConverter(root), root);
    }
  }

  find(parent: string | T): Nullable<TreeNode<T>> {
    const parentId: string = typeof(parent) !== 'string'
                ? this.#toIdConverter(parent)
                : parent;
    
    const _find = (id: string, root: TreeNode<T>) => {
      if (id === root.id) { return root; }
      else if (root.isLeaf) { return null; }

      //else, search children
      let found: Nullable<TreeNode<T>>;
      for (let i = 0; i < root.children.length && !found; i++) {
        found = _find(id, root.children[i]);
      }
      return found;
    }

    return _find(parentId, this.#root);
  }

  addChild(parentId: string, value: T) {
    const id = this.toIdConverter(value);
    if (this.#root.has(id)) {
      throw new Error(`Unable to add child to Tree - found duplicate id (${id})`);
    }
    const parent = this.find(parentId);
    if (!parent) {
      throw new Error(`Unable to add child to Tree - could not locate the parent (${parentId})`);
    }
    parent.children.push(new TreeNode(this.toIdConverter(value), value));
  }


}