import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';

import { BookMarkRaw, BookMarkTreeNode } from '../../types';
import { BookMarkContext } from '../../hooks/useBookMarkContext';
import {
  formatToTreeNode,
  filterFolderChildrenOnly,
  findById,
} from '../../utils/data';
import MenuTree from './MenuTree';
import ContentList from './ContentList';

export default function ListPage() {
  const { bookmarks } = useContext(BookMarkContext);
  const [menuTreeData, setMenuTreeData] = useState<BookMarkTreeNode[]>([]);
  const [listData, setListData] = useState<BookMarkRaw[]>([]);

  const handleMenuTreeSelected = useCallback((selectedKey: string) => {
    console.log('menuTree selectedKey:', selectedKey)
    const re = findById(bookmarks?.[0], selectedKey);
    setListData(re?.children || []);
  }, [bookmarks]);

  useEffect(() => {
    const newTreeData = (bookmarks || []).map(formatToTreeNode);
    console.log('bookmarks:', newTreeData);
    const folderTreeData = newTreeData.map(filterFolderChildrenOnly);
    console.log('menuTreeData:', folderTreeData);
    setMenuTreeData(folderTreeData?.[0]?.children || []);
  }, [bookmarks]);

  return (
    <div className='h-full flex'>
      <div className='w-1/5 py-4'>
        <MenuTree treeData={menuTreeData} onSelect={handleMenuTreeSelected} />
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-end gap-2 mb-4'>
          <Button type='default' danger>Delete All</Button>
        </div>
        <ContentList listData={listData} />
      </div>
    </div>
  )
}