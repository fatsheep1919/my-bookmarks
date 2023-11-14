import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
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
  const minHeight = 2;
  if (childrenCount === 1) {
    return 1;
  } else if (childrenCount <= 3) {
    return minHeight;
  }

  let height = 1;
  height += Math.ceil((childrenCount - 1) / 3);
  return height;
}

const storageKey = 'MY_BOOKMARK_DASHBOARD_LAYOUT';

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



    let customLayout;
    const str = window.localStorage.getItem(storageKey);
    if (str) {
      try {
        customLayout = JSON.parse(str);
        console.log('read layout:', customLayout)
      } catch (err) {
        console.log('Error parsing customed layout:', err);
      }
    }
    if (customLayout) {
      const folderIds = folders.map(it => it.id);
      const existingItems = customLayout.filter((it: Layout) => folderIds.includes(it.i)).map((it: Layout) => {
        return {
          ...it,
          data: findById(bookmarks?.[0], it.i),
        }
      });
      const existingItemIds = existingItems.map((it: Layout) => it.i);
      let gridItems = folders.filter(it => !existingItemIds.includes(it.id)).map((folder, index) => {
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

      return existingItems.length > 0 ? [...existingItems, ...gridItems] : gridItems;
    }



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

  const handleLayoutChange = useCallback((currentLayout: Layout[], _allLayouts?: Layouts) => {
    console.log('save layout onLayoutChange:', currentLayout)
    window.localStorage.setItem(storageKey, JSON.stringify(currentLayout));
  }, []);

  useEffect(() => {
    if (layout?.length > 0) {
      console.log('save layout on useEffect')
      handleLayoutChange(layout.map(it => ({
        i: it.i,
        x: it.x,
        y: it.y,
        w: it.w,
        h: it.h
      })));
    }
  }, [layout, handleLayoutChange]);

  return (
    <div className='relative my-2 bg-slate-100'>
      <div className='absolute top-0 left-full' title='reset'>
        <Button type='link' icon={<ReloadOutlined />} />
      </div>
      <ResponsiveGridLayout
        breakpoints={{ md: 960, sm: 720 }}
        cols={{ md: 12, sm: 12 }}
        rowHeight={140}
        layouts={{
          md: layout,
          sm: layout,
        }}
        draggableHandle='.cursor-move'
        onLayoutChange={handleLayoutChange}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            // data-grid={item}
            className='border border-solid bg-white rounded-lg shadow-md'
          >
            <GridItemContent data={item.data} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}