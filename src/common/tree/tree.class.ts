import { Logger } from "../../logger";
import { Nullable } from "../nullable";
import { TreeNode } from "./tree-node.class";

export type ValueToId<T> = (value: T) => string;

export class Tree<T> {
  protected _logger = new Logger();
  protected _root!: TreeNode<T>;
  setRoot(value: T) {
    this._root = new TreeNode<T>(this._toIdConverter(value), value);
  }
  getRoot() {
    return this._root;  //todo: clone
  }

  get size() { return this._size(); }
  get depth() { return this._depth(); }


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

    return _find(parentId, this._root);
  }

  addChild(parentId: string, value: T) {        
    const id = this._toIdConverter(value);
    if (this._root.has(id)) {
      throw new Error(`Unable to add child to Tree - found duplicate id (${id}) [${this.valueToString(value)}]`);
    }
    const parent = this.find(parentId || this._root.id);
    if (!parent) {
      throw new Error(`Unable to add child to Tree - could not locate the parent (${parentId}) [${this.valueToString(value)}]`);
    }
    const node = new TreeNode(this._toIdConverter(value), value);
    node.parent = parent;
    parent.children.push(node);
  }

  display() {
    const _display = (node: TreeNode<T>) => {
      this._logger.log(`id: ${node.id}, value: ${this.valueToString(node.value)}`);
      if (!node.isLeaf) {
        node.children.forEach(_display);
      }
    };

    _display(this._root);
  }

  protected valueToString(value: T) {
    `${value}`;
  }

  protected _size() {
    const calcSize = (root: TreeNode<T>): number => {
      return root.isLeaf
        ? 1
        : 1 + root.children.reduce((sum, child) => sum + calcSize(child), 0);
    };
    return calcSize(this._root);
  }

  protected _depth() {
    const calcDepth = (root: TreeNode<T>): number => {
      return root.isLeaf
        ? 1
        : 1 + root.children.reduce((depth, child) => Math.max(depth, calcDepth(child)), 0);
    };
    return calcDepth(this._root);
  }

}