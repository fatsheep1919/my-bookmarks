export interface BookMark {
  id: number;
  pId: number;
  type: 'url' | 'folder';
  name?: string;
  value?: string; // type === url
  layout?: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }; // type === folder
  pageTitle?: string;
  favicon?: string;
}

export interface BookMarkTreeNode extends BookMark {
  children?: BookMark[];
}

export interface BookMarkInput {
  url: string;
  name?: string;
  folder?: string;
}

//

export interface BookMarkRaw {
  id: string;
  title?: string;
  parentId?: string;
  index?: number;
  dateAdded?: number;
  children?: BookMarkRaw[];
}