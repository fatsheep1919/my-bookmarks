import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Typography } from 'antd';

import { BookMarkRaw } from '../../types';
import { BookMarkContext } from '../../hooks/useBookMarkContext';
import {
  formatToTreeNode,
  filterFolderChildrenOnly,
  findById,
} from '../../utils/data';
import MenuTree from './MenuTree';
import ContentList from './ContentList';

export default function ListPage() {
  const { bookmarks, curFolder, updateCurFolder } = useContext(BookMarkContext);
  const [listData, setListData] = useState<BookMarkRaw[]>([]);

  const menuTreeData = useMemo(() => {
    const folderTreeData = (bookmarks || [])
      .map(formatToTreeNode)
      .map(filterFolderChildrenOnly);

    return folderTreeData?.[0]?.children || [];
  }, [bookmarks]);

  const handleMenuTreeSelected = useCallback((selectedKey: string) => {
    if (selectedKey) {
      const re = findById(bookmarks?.[0], selectedKey);
      if (re) {
        updateCurFolder(re);
        setListData(re.children || []);
      }
    }
  }, [bookmarks, updateCurFolder]);

  useEffect(() => {
    if (curFolder) {
      handleMenuTreeSelected(curFolder.id)
    } else {
      const firstFolder = menuTreeData?.[0];
      if (firstFolder) {
        handleMenuTreeSelected(firstFolder.id)
      }
    }
  }, [curFolder, menuTreeData, handleMenuTreeSelected]);

  return (
    <div className='h-full flex'>
      <div className='w-1/5 py-4'>
        <MenuTree treeData={menuTreeData} onSelect={handleMenuTreeSelected} />
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-between'>
          <div>
            <Typography.Title level={3}>
              {curFolder?.title}
            </Typography.Title>
          </div>
          <div className='flex gap-2 mb-4'>
            {
              curFolder?.parentId !== '0' ? (
                <Button
                  ghost
                  type='primary'
                  onClick={() => handleMenuTreeSelected(curFolder?.parentId || '')}
                >
                  Parent Folder
                </Button>
              ) : null
            }
          </div>
        </div>
        <ContentList listData={listData} onFolderClick={handleMenuTreeSelected} />
      </div>
    </div>
  )
}