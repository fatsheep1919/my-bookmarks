import _ from 'lodash';
import type { BookMark, BookMarkTreeNode } from '../types';

export function toTree(rawData: BookMark[]): BookMarkTreeNode[] {
  const groupedNodes = _.groupBy(rawData, 'pId');
  const addChildren = (it: BookMark): BookMarkTreeNode => {
    const children = groupedNodes[it.id];
    if (children) {
      return {
        ...it,
        children: children.map(addChildren),
      };
    }
    return it;
  };
  return groupedNodes[0].map(addChildren);
}

export function findUrlData() {

}

export function findFolderData() {

}
