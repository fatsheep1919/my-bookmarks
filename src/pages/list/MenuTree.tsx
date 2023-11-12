import React, { useState, useContext } from 'react';
import { Tree, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { BookMarkTreeNode } from '../../types';
import { BookMarkContext } from '../../hooks/useBookMarkContext';

interface IProps {
  treeData: BookMarkTreeNode[];
  onSelect: (selectedKey: string) => void;
}

export default function MenuTree(props: IProps) {
  const { treeData, onSelect } = props;
  const { curFolder, openFolderModal } = useContext(BookMarkContext);

  const handleFolderSelected = (selectedKeys: React.Key[]) => {
    const targetKey = selectedKeys[0] as string;
    onSelect(targetKey);
  };

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button type='dashed' onClick={() => openFolderModal(null)}>New Folder</Button>
      </div>
      {(treeData || []).length > 0 ? (
        <Tree
          defaultExpandAll
          blockNode
          switcherIcon={<DownOutlined className='mt-4' />}
          treeData={treeData}
          titleRender={(it: BookMarkTreeNode): React.ReactNode => {
            return (
              <div className='py-1.5 px-3 mt-0.5 text-md'>
                {it.title}
              </div>
            )
          }}
          selectedKeys={curFolder ? [curFolder.id] : []}
          onSelect={handleFolderSelected}
        />
      ) : null}
    </>
  )
}