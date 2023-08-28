import _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { BookMarkRaw, BookMarkTreeNode } from '../../types';
import {
  formatToFlatternTreeNode,
  findById,
} from '../../utils/data';
import { BookMarkContext } from '../../hooks/useBookMarkContext';
import GridItemContent from "./GridItemContent";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CustomLayout extends Layout {
  data?: BookMarkRaw | null;
}

export default function Grid() {
  const { bookmarks } = useContext(BookMarkContext);
  const layout: CustomLayout[] = useMemo(() => {
    const flatternTreeData: BookMarkTreeNode[] = [];
    formatToFlatternTreeNode(bookmarks?.[0]?.children || [], flatternTreeData);

    const folders = flatternTreeData
      .filter(it => it.type === 'folder' && (it.children || []).length > 0)
      .sort((a, b) => (b.children || []).length - (a.children || []).length);
    console.log('folders:', folders)
    const colSpan = folders.length <= 4 ? (12 / folders.length) : 3;
    const colCount = 12 / colSpan;
    const rowCount = Math.ceil(folders.length / colCount);

    return folders.map((folder, index) => ({
      i: `${folder.id}`,
      x: (index % colCount) * colSpan,
      y: Math.floor(index / colCount),
      w: colSpan,
      h: rowCount < 2 ? 4 : 2,
      data: findById(bookmarks?.[0], folder.id),
    }));
  }, [bookmarks]);

  return (
    <div className='my-2 bg-slate-100'>
      <ResponsiveGridLayout
        breakpoints={{ md: 960, sm: 720 }}
        cols={{ md: 12, sm: 12 }}
        rowHeight={135}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            data-grid={item}
            className='border border-solid bg-white rounded-lg shadow-md'
          >
            <GridItemContent data={item.data} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}