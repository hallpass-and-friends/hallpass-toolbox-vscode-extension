import { Nullable } from "../nullable";

export class TreeNode<T> {
  id: string;
  value!: T;
  parent: Nullable<TreeNode<T>>;
  readonly children: TreeNode<T>[] = [];
  get isLeaf() { return this.children.length === 0; }

  constructor(id: string, value: T) {
    this.id = id;
    this.value = value;
  }

  has(id: string): boolean {
    return this.id === id 
      || this.children.some(t => t.has(id));
  }

}