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

function getColCount() {
  const width = Math.floor(window.innerWidth * 0.83);
  if (width <= 720) {
    return 1;
  } else if (width <= 960) {
    return 2;
  }
  return 3;
}

export default function Grid() {
  // const layout: Layout[] = [
  //   { i: "a", x: 0, y: 0, w: 2, h: 2, isDraggable: false, isResizable: false, },
  //   { i: "b", x: 2, y: 0, w: 2, h: 2 },
  //   { i: "c", x: 4, y: 0, w: 2, h: 2 },
  //   { i: "d", x: 0, y: 3, w: 2, h: 2 },
  //   { i: "e", x: 2, y: 3, w: 2, h: 2 },
  //   { i: "f", x: 4, y: 3, w: 2, h: 2 }
  // ];

  const { bookmarks } = useContext(BookMarkContext);
  const layout: CustomLayout[] = useMemo(() => {
    const flatternTreeData: BookMarkTreeNode[] = [];
    formatToFlatternTreeNode(bookmarks?.[0]?.children || [], flatternTreeData);

    const folders = flatternTreeData.filter(it => it.type === 'folder')
      .sort((a, b) => (b.children || []).length - (a.children || []).length);
    console.log('folders:', folders)
    const colCount = getColCount();
    const rowCount = Math.ceil(folders.length / colCount);

    return folders.map((folder, index) => ({
      i: `${folder.id}`,
      x: index % colCount,
      y: Math.floor(index / colCount),
      w: 1,
      h: rowCount < 2 ? 4 : 2,
      data: findById(bookmarks?.[0], folder.id),
    }));
  }, [bookmarks]);

  return (
    <div className='my-2 bg-slate-100'>
      <ResponsiveGridLayout
        breakpoints={{ md: 960, sm: 720 }}
        cols={{ md: 3, sm: 2 }}
        rowHeight={130}
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