import React, { useCallback, useContext } from 'react';
import { Avatar, List } from 'antd';
import { FolderOutlined } from '@ant-design/icons';


import { BookMarkRaw } from "../../types";
import { faviconURL } from "../../utils/favicon";
import { BookMarkContext } from '../../hooks/useBookMarkContext';

interface IProps {
  listData: BookMarkRaw[];
}

export default function ContentList(props: IProps) {
  const { listData } = props;
  const { openBookMarkModal, openFolderModal } = useContext(BookMarkContext);

  const formattedListData = listData?.sort((a, b) => {
    if ((a.children && b.children) || (!a.children && !b.children)) {
      return (a.title || '').localeCompare(b.title || '');
    } else if (a.children && !b.children) {
      return -1;
    }
    return 1;
  });

  const handleEdit = useCallback((item: BookMarkRaw) => {
    if (item.children) {
      openFolderModal(item);
    } else {
      openBookMarkModal(item);
    }
  }, [openBookMarkModal, openFolderModal]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={formattedListData}
      renderItem={(item, index) => (
        <List.Item
          className={`${item.children ? 'bg-gray-100' : ''} hover:bg-gray-200`}
          actions={[
            <a
              key="list-loadmore-edit"
              onClick={() => handleEdit(item)}
            >
              edit
            </a>,
            <a
              key="list-loadmore-delete"
            >
              <span className='text-red-500'>delete</span>
            </a>
          ]}
        >
          <List.Item.Meta
            className='px-2'
            avatar={
              item.url ? <Avatar
                // src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                src={faviconURL(item.url)}
                size='small'
              /> : <FolderOutlined style={{ fontSize: 24 }} />
            }
            title={item.title ? <a href="https://ant.design">{item.title}</a> : null}
            description={item.children ? 'folder' : item.url}
          />
        </List.Item>
      )}
    />
  )
}