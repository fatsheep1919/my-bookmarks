import React, { ReactNode } from 'react';
import { Tree, Avatar, List, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { DownOutlined } from '@ant-design/icons';

interface MyTreeNodeData extends DataNode {
  title: string;
  key: string;
  children?: MyTreeNodeData[];
}

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
          treeData={treeData}
          titleRender={(it: MyTreeNodeData): ReactNode => {
            return (
              <div className='py-1.5 px-3 text-md'>
                {it.title}
              </div>
            )
          }}
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