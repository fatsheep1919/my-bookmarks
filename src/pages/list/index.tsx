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
  const [defaultSelectedKey, setDetaultSelectedKey] = useState<string>();
  const [listData, setListData] = useState<BookMarkRaw[]>([]);

  const handleMenuTreeSelected = useCallback((selectedKey: string) => {
    const re = findById(bookmarks?.[0], selectedKey);
    setListData(re?.children || []);
  }, [bookmarks]);

  useEffect(() => {
    const folderTreeData = (bookmarks || [])
      .map(formatToTreeNode)
      .map(filterFolderChildrenOnly);
    console.log('menuTreeData:', folderTreeData);

    const menuTreeData = folderTreeData?.[0]?.children || [];
    setMenuTreeData(menuTreeData);

    const firstFolderKey = menuTreeData?.[0]?.id;
    if (firstFolderKey) {
      setDetaultSelectedKey(firstFolderKey);
      handleMenuTreeSelected(firstFolderKey)
    }
  }, [bookmarks, handleMenuTreeSelected]);

  return (
    <div className='h-full flex'>
      <div className='w-1/5 py-4'>
        <MenuTree
          treeData={menuTreeData}
          defaultSelectedKey={defaultSelectedKey ? [defaultSelectedKey] : []}
          onSelect={handleMenuTreeSelected}
        />
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