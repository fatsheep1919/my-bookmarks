export interface BookMarkRaw {
  id: string;
  title?: string;
  parentId?: string;
  index?: number;
  url?: string;
  dateAdded?: number;
  children?: BookMarkRaw[];
}

export interface BookMarkInput {
  url: string;
  name?: string;
  folder?: string;
}

export interface BookMarkTreeNode extends BookMarkRaw {
  key: string;
  children?: BookMarkTreeNode[];
}

export interface BookMarkGridItem extends BookMarkRaw {
  layout?: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}