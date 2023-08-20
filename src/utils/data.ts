import type { BookMarkRaw, BookMarkTreeNode } from '../types';

export function formatToTreeNode(rawData: BookMarkRaw): BookMarkTreeNode {
  const treeNode = {
    ...rawData,
    title: rawData.title || `folder-${rawData.id}`,
    key: rawData.id,
    children: rawData.children?.map(formatToTreeNode),
  };

  return treeNode;
}

export function filterFolderChildrenOnly(treeNode: BookMarkTreeNode): BookMarkTreeNode {
  if (Array.isArray(treeNode.children) && treeNode.children.length >= 0) {
    let folderChildren = treeNode.children.filter(chd => Array.isArray(chd.children) && chd.children.length >= 0);
    if (folderChildren.length > 0) {
      folderChildren = folderChildren.map(filterFolderChildrenOnly);
    }
    treeNode.children = folderChildren;
  }
  return treeNode;
}

export function findById(bookmark: BookMarkRaw, id: string): BookMarkRaw | null {
  if (bookmark.id === id) {
    return bookmark;
  } else if (bookmark.children && bookmark.children.length > 0) {
    const re: (BookMarkRaw | null)[] = bookmark.children
      .map(chd => findById(chd, id))
      .filter(it => it);

    if (re && re.length > 0) {
      return re[0];
    }
  }
  return null;
}