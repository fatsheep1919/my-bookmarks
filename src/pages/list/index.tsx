import { useCallback } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Avatar, List, Button } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    label: <div className='w-full text-right'>all</div>,
    key: 'all',
  },
  {
    label: <div className='w-full text-right'>u</div>,
    key: 'u',
  }
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

  const handleClick = useCallback(() => {

  }, []);

  return (
    <div className='h-full flex'>
      <div className='w-1/6 py-4'>
        <Menu
          mode="vertical"
          items={menuItems}
          defaultSelectedKeys={['all']}
          onClick={handleClick}
        />
        <div className='flex justify-center mt-4'>
          <Button type='dashed'>New Folder</Button>
        </div>
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-end gap-2'>
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