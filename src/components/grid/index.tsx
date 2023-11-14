import _ from 'lodash';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

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
  const [customLayoutStr, setCustomLayoutStr] = useState(() => {
    return window.localStorage.getItem(storageKey) || '';
  });

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



    let customLayout: Array<Layout> = [];
    if (customLayoutStr) {
      try {
        customLayout = JSON.parse(customLayoutStr);
      } catch (err) {
        console.log('Error parsing customed layout:', err);
      }
    }

    if (customLayout?.length > 0) {
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

      return [...existingItems, ...gridItems].filter(it => it)
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

    return gridItems;
  }, [bookmarks, customLayoutStr]);

  const handleDragAndResize = useCallback((
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    const newLayoutStr = JSON.stringify(layout);
    window.localStorage.setItem(storageKey, newLayoutStr);
    setCustomLayoutStr(newLayoutStr);
  }, [])

  const handleReset = useCallback(() => {
    window.localStorage.setItem(storageKey, '');
    setCustomLayoutStr('');
  }, []);

  return (
    <div className='relative my-2 bg-slate-100'>
      <div className='absolute top-0 left-full' title='reset'>
        { customLayoutStr && <Button type='link' icon={<ReloadOutlined />} onClick={handleReset} /> }
      </div>
      {
        layout?.length > 0 && (
          <ResponsiveGridLayout
            breakpoints={{ md: 960, sm: 720 }}
            cols={{ md: 12, sm: 12 }}
            rowHeight={140}
            layouts={{
              md: layout,
              sm: layout,
            }}
            draggableHandle='.cursor-move'
            onDragStop={handleDragAndResize}
            onResizeStop={handleDragAndResize}
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
        )
      }
    </div>
  )
}