export interface ITreeNode<T> {
  id: number
  name: string
  path?: string
  children: T[]
  depth?: number
}

export class Tree<T extends ITreeNode<T>> {
  hasChildren(node: T) {
    return typeof node === 'object' && typeof node.children !== 'undefined' && node.children.length > 0
  }

  flatten(root: T[], nodes: T[] = [], depth = 0, path: boolean, parentName?: string) {
    for (const node of root) {
      const n = {
        ...node,
        name: path ? (parentName ? `${parentName} > ${node.name}` : node.name) : node.name,
        depth
      }
      nodes.push(n)

      if (this.hasChildren(node)) {
        this.flatten(node.children, nodes, depth++, path, n.name)
      }
    }
    return nodes
  }

  findPath(root: T[], predicate: (node: T) => boolean, path: T[] = []) {
    for (const node of root) {
      if (predicate(node)) {
        return [node].concat(path)
      }

      if (this.hasChildren(node)) {
        const match = this.findPath(node.children, predicate, path)

        if (match && match.length > 0) {
          return [node].concat(match)
        }
      }
    }
    return []
  }

  filter(source: T[], predicate: (node: T) => boolean): T[] {
    const result = source.filter(predicate)
    for (const node of result) {
      if (this.hasChildren(node)) {
        node.children = this.filter(node.children, predicate)
      }
    }
    return result
  }

  findNode(root: T[], predicate: (node: T) => boolean) {
    for (const node of root) {
      if (predicate(node)) {
        return node
      }

      if (this.hasChildren(node)) {
        const match = this.findNode(node.children, predicate)

        if (match) {
          return match
        }
      }
    }
    return null
  }

  map(root: T[], predicate: (node: T) => boolean, map: (node: T) => unknown) {
    const results = this.findPath(root, predicate)
    return results.map(map)
  }

  apply(root: T[], fn: (node: T) => void) {
    for (const node of root) {
      fn(node)

      if (this.hasChildren(node)) {
        this.apply(node.children, fn)
      }
    }
  }

  setPath(root: T[], parentName?: string) {
    for (const node of root) {
      node.path = parentName ? `${parentName} > ${node.name}` : node.name

      if (this.hasChildren(node)) {
        this.setPath(node.children, node.path)
      }
    }

    return root
  }
}
