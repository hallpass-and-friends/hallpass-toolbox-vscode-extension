import { Logger } from "../../logger";
import { Nullable } from "../nullable";
import { TreeNode } from "./tree-node.class";

export type ValueToId<T> = (value: T) => string;

export class Tree<T> {
  #logger = new Logger();
  #root!: TreeNode<T>;
  setRoot(value: T) {
    this.#root = new TreeNode<T>(this._toIdConverter(value), value);
  }

  protected _toIdConverter: ValueToId<T> = (value: T) => `${value}`;  

  constructor(root?: T) {
    if (root) {
      this.setRoot(root);
    }
  }

  find(parent: string | T): Nullable<TreeNode<T>> {
    const parentId: string = typeof(parent) !== 'string'
                ? this._toIdConverter(parent)
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
    };

    return _find(parentId, this.#root);
  }

  addChild(parentId: string, value: T) {
    const id = this._toIdConverter(value);
    if (this.#root.has(id)) {
      throw new Error(`Unable to add child to Tree - found duplicate id (${id}) [${this.valueToString(value)}]`);
    }
    const parent = this.find(parentId);
    if (!parent) {
      throw new Error(`Unable to add child to Tree - could not locate the parent (${parentId}) [${this.valueToString(value)}]`);
    }
    parent.children.push(new TreeNode(this._toIdConverter(value), value));
  }

  display() {
    const _display = (node: TreeNode<T>) => {
      this.#logger.log(`id: ${node.id}, value: ${this.valueToString(node.value)}`);
      if (!node.isLeaf) {
        node.children.forEach(_display);
      }
    };

    _display(this.#root);
  }

  protected valueToString(value: T) {
    `${value}`;
  }

}