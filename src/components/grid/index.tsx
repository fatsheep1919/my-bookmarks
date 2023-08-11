import _ from 'lodash';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import GridItemContent from "./GridItemContent";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useMemo } from 'react';
import { BookMarkTreeNode } from '../../types';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CustomLayout extends Layout {
  data?: BookMarkTreeNode;
}

export default function Grid() {
  // const layout: Layout[] = [
  //   { i: "a", x: 0, y: 0, w: 2, h: 2, isDraggable: false, isResizable: false, },
  //   { i: "b", x: 2, y: 0, w: 2, h: 2 },
  //   { i: "c", x: 4, y: 0, w: 2, h: 2 }
  // ];

  const [bookmarks, saveBookMarks] = useLocalStorage();
  const layout: CustomLayout[] = useMemo(() => {
    const topFolders = bookmarks.filter(it => it.pId === 0 && it.type === 'folder');
    if (!topFolders[0]) {
      const topUrls = bookmarks.filter(it => it.type === 'url' && it.pId === 0);
      return [{ i: 'default', x: 0, y: 0, w: 6, h: 3, data: {
        id: 0,
        pId: -1,
        type: 'folder',
        name: 'default',
        children: topUrls,
      } }];
    }
    const targetData = bookmarks.find(it => it.id === topFolders[0].id);
    return topFolders.map((folder, index) => folder.layout || { i: `${folder.id}`, x: 0, y: 2 * (index - 1), w: 6, h: 2, data: targetData });
  }, [bookmarks]);

  return (
    <div className='my-2 bg-slate-100'>
      <ResponsiveGridLayout
        cols={{
          lg: 6,
          md: 6,
        }}
        layouts={{
          lg: layout
        }}
      >
        {layout.map((item) => (
          <div key={item.i} className='border border-solid bg-white rounded-lg shadow-md'>
            <GridItemContent data={item.data} />
          </div>
          
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}