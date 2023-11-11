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

function getItemHeight(folder: BookMarkTreeNode): number {
  const childrenCount = (folder.children || []).filter(it => it.url).length;
  const minHeight = 2, maxHeight = 4;
  if (childrenCount === 1) {
    return 1;
  } else if (childrenCount <= 3) {
    return minHeight;
  }

  let height = minHeight;
  height += Math.ceil((childrenCount - 3) / 2);
  // if (height > maxHeight) {
  //   height = maxHeight;
  // }
  return height;
}

export default function Grid() {
  const { bookmarks } = useContext(BookMarkContext);
  const layout: CustomLayout[] = useMemo(() => {
    const flatternTreeData: BookMarkTreeNode[] = [];
    formatToFlatternTreeNode(bookmarks?.[0]?.children || [], flatternTreeData);

    const folders = flatternTreeData
      .filter(
        it => it.type === 'folder'
        && (it.children || []).length > 0
        && (it.children || []).filter(ch => ch.url).length > 0
      )
      .sort((a, b) => (b.children || []).length - (a.children || []).length);

    const colSpan = 4;
    let colCount = Math.min(folders.length, Math.ceil(12 / colSpan));

    const colHeightMap: Record<string, number> = {};
    Array.from({length: colCount}, (v, i) => i).forEach(it => {
      colHeightMap[it] = 0;
    });
    const itemsHeightMap: Record<string, number> = {};
    folders.forEach((folder) => {
      itemsHeightMap[folder.id] = getItemHeight(folder);
    });

    let gridItems = folders.map((folder, index) => {
      let minIndex = '0';
      let minColH = colHeightMap[minIndex];
      Object.keys(colHeightMap).forEach(index => {
        if (colHeightMap[index] < minColH) {
          minColH = colHeightMap[index];
          minIndex = index;
        }
      })

      let colH = colHeightMap[minIndex];
      colHeightMap[minIndex] = colH + itemsHeightMap[folder.id];

      return {
        i: folder.id,
        x: parseInt(minIndex) * colSpan,
        y: colH,
        w: colSpan,
        h: folders.length <= colCount ? 4 : itemsHeightMap[folder.id],
        data: findById(bookmarks?.[0], folder.id),
      }
    });

    console.log('gridItems:', gridItems)
    return gridItems;
  }, [bookmarks]);

  return (
    <div className='my-2 bg-slate-100'>
      <ResponsiveGridLayout
        breakpoints={{ md: 960, sm: 720 }}
        cols={{ md: 12, sm: 12 }}
        rowHeight={140}
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