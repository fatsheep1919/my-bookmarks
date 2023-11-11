import React, { useState, useContext } from 'react';
import { Tree, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { BookMarkTreeNode } from '../../types';
import { BookMarkContext } from '../../hooks/useBookMarkContext';
import AddFolderModal from './AddFolderModal';

interface IProps {
  treeData: BookMarkTreeNode[];
  defaultSelectedKey: string[];
  onSelect: (selectedKey: string) => void;
}

export default function MenuTree(props: IProps) {
  const { treeData, defaultSelectedKey, onSelect } = props;
  const { refresh } = useContext(BookMarkContext);

  const [open, setOpen] = useState(false);

  const handleFolderSelected = (selectedKeys: React.Key[]) => {
    const targetKey = selectedKeys[0] as string;
    onSelect(targetKey);
  };

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button type='dashed' onClick={() => setOpen(true)}>New Folder</Button>
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
          defaultSelectedKeys={defaultSelectedKey}
          onSelect={handleFolderSelected}
        />
      ) : null}

      <AddFolderModal
        visible={open}
        folderOptions={treeData.reduce((arr, node) => {
          arr.push({
            id: node.id,
            title: node.title || ''
          });
          node.children?.forEach(it => arr.push({
            id: it.id,
            title: it.title || ''
          }))
          return arr;
        }, [] as {id: string; title: string}[])}
        onClose={() => {
          setOpen(false)
          refresh()
        }}
      />
    </>
  )
}