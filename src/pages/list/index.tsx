import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Tree, Avatar, List, Button } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { DownOutlined } from '@ant-design/icons';

import { BookMarkContext } from '../../hooks/useBookMarkContext';
import { BookMarkRaw } from '../../types';

interface MyTreeNodeData extends DataNode {
  title: string;
  key: string;
  children?: MyTreeNodeData[];
}

interface ListData extends BookMarkRaw {}

const treeData: MyTreeNodeData[] = [
  {
    title: 'parent',
    key: 'all',
    children: [
      {
        title: 'child 1',
        key: '0-0',
      },
      {
        title: 'very very long title child',
        key: '0-1',
      },
    ],
  },
];

const data = [
  {
    title: 'Ant Design Title 1',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team'
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

export default function ListPage() {
  const { bookmarks } = useContext(BookMarkContext);
  const [localTreeData, setLocalTreeData] = useState<MyTreeNodeData[]>([]);
  const [localListData, setLocalListData] = useState<ListData[]>([]);

  const formatData = useCallback((rawData: BookMarkRaw): MyTreeNodeData => {
    const newData = {
      ...rawData,
      title: rawData.title || `node-${rawData.id}`,
      key: rawData.id,
      children: rawData.children?.map(formatData),
    };

    return newData;
  }, []);

  const filterLeaf = useCallback((node: MyTreeNodeData): MyTreeNodeData => {
    if (Array.isArray(node.children) && node.children.length >= 0) {
      let newChildren = node.children.filter(chd => Array.isArray(chd.children) && chd.children.length >= 0);
      if (newChildren.length > 0) {
        newChildren = newChildren.map(filterLeaf);
      }
      node.children = newChildren;
    }
    return node;
  }, []);

  useEffect(() => {
    const newTreeData = (bookmarks || []).map(formatData);
    // console.log('newTreeData:', newTreeData);

    const folderTreeData = newTreeData.map(filterLeaf);
    console.log('newTreeData folder only:', folderTreeData);

    setLocalTreeData(folderTreeData);
  }, [bookmarks, formatData, filterLeaf]);

  const findNode = useCallback((node: BookMarkRaw, key: string) => {
    if (node.id === key) {
      return node;
    } else if (node.children && node.children.length > 0) {
      const re: (BookMarkRaw | null)[] = node.children?.map(chd => {
        return findNode(chd, key);
      }).filter(it => it);

      if (re && re.length > 0) {
        return re[0];
      }
    }
    return null;
  }, []);

  const handleFolderSelected: TreeProps['onSelect'] = (selectedKeys: React.Key[]) => {
    console.log('selectedKeys:', selectedKeys)
    const targetKey = selectedKeys[0] as string;
    const re = bookmarks
      .map(it => {
        return findNode(it, targetKey);
      })
      .filter(it => it)

    console.log('find:', re)

  };

  return (
    <div className='h-full flex'>
      <div className='w-1/5 py-4'>
        <div className='flex justify-end mb-4'>
          <Button type='dashed'>New Folder</Button>
        </div>
        <Tree
          defaultExpandAll
          defaultSelectedKeys={['all']}
          blockNode
          switcherIcon={<DownOutlined className='mt-4' />}
          treeData={localTreeData}
          titleRender={(it: MyTreeNodeData): ReactNode => {
            return (
              <div className='py-1.5 px-3 text-md'>
                {it.title}
              </div>
            )
          }}
          onSelect={handleFolderSelected}
        />
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-end gap-2 mb-4'>
          <Button type='default' danger>Delete All</Button>
          <Button type='default' danger>Delete Folder</Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              className='hover:bg-gray-100'
              actions={[
                <a key="list-loadmore-edit">edit</a>,
                <a key="list-loadmore-move">move</a>,
                <a key="list-loadmore-delete">
                  <span className='text-red-500'>delete</span>
                </a>
              ]}
            >
              <List.Item.Meta
                className='px-2'
                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}