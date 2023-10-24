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
  const { bookmarks, updateCurFolder } = useContext(BookMarkContext);

  const [menuTreeData, setMenuTreeData] = useState<BookMarkTreeNode[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>();
  const [listData, setListData] = useState<BookMarkRaw[]>([]);

  const handleMenuTreeSelected = useCallback((selectedKey: string) => {
    const re = findById(bookmarks?.[0], selectedKey);
    if (re) {
      updateCurFolder(re);
      setListData(re.children || []);
    }
  }, [bookmarks, updateCurFolder]);

  useEffect(() => {
    const folderTreeData = (bookmarks || [])
      .map(formatToTreeNode)
      .map(filterFolderChildrenOnly);
    console.log('menuTreeData:', folderTreeData);

    const menuTreeData = folderTreeData?.[0]?.children || [];
    setMenuTreeData(menuTreeData);

    const firstFolderKey = menuTreeData?.[0]?.id;
    if (firstFolderKey) {
      setSelectedKey(firstFolderKey);
      handleMenuTreeSelected(firstFolderKey)
    }
  }, [bookmarks, handleMenuTreeSelected]);

  return (
    <div className='h-full flex'>
      <div className='w-1/5 py-4'>
        <MenuTree
          treeData={menuTreeData}
          defaultSelectedKey={selectedKey ? [selectedKey] : []}
          onSelect={handleMenuTreeSelected}
        />
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-end gap-2 mb-4'>
          <Button type='primary' ghost>Edit Folder</Button>
          <Button type='primary' danger ghost>Delete Folder</Button>
        </div>
        <ContentList listData={listData} />
      </div>
    </div>
  )
}