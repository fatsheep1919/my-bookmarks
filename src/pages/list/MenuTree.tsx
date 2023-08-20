import React from 'react';
import { Tree, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { BookMarkTreeNode } from '../../types';

interface IProps {
  treeData: BookMarkTreeNode[];
  onSelect: (selectedKey: string) => void;
}

export default function MenuTree(props: IProps) {
  const { treeData, onSelect } = props;

  const handleFolderSelected = (selectedKeys: React.Key[]) => {
    const targetKey = selectedKeys[0] as string;
    onSelect(targetKey);
  };

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button type='dashed'>New Folder</Button>
      </div>
      <Tree
        defaultExpandAll
        defaultSelectedKeys={['all']}
        blockNode
        switcherIcon={<DownOutlined className='mt-4' />}
        treeData={treeData}
        titleRender={(it: BookMarkTreeNode): React.ReactNode => {
          return (
            <div className='py-1.5 px-3 text-md'>
              {it.title}
            </div>
          )
        }}
        onSelect={handleFolderSelected}
      />
    </>
  )
}