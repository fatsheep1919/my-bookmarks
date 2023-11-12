import React, { useCallback, useContext } from 'react';
import { Avatar, List, Modal, Button } from 'antd';
import { FolderOutlined, ExclamationCircleFilled } from '@ant-design/icons';


import { BookMarkRaw } from "../../types";
import { faviconURL } from "../../utils/favicon";
import { BookMarkContext } from '../../hooks/useBookMarkContext';

interface IProps {
  listData: BookMarkRaw[];
  onFolderClick: (key: string) => void;
}

export default function ContentList(props: IProps) {
  const { listData, onFolderClick } = props;
  const { openBookMarkModal, openFolderModal, refresh } = useContext(BookMarkContext);

  const formattedListData = listData?.sort((a, b) => {
    if ((a.children && b.children) || (!a.children && !b.children)) {
      return (a.title || '').localeCompare(b.title || '');
    } else if (a.children && !b.children) {
      return -1;
    }
    return 1;
  });

  const handleClick = useCallback((item: BookMarkRaw) => {
    if (item.children) {
      onFolderClick(item.id);
    } else {
      window.open(item.url, '_blank');
    }
  }, [onFolderClick]);

  const handleEdit = useCallback((item: BookMarkRaw) => {
    if (item.children) {
      openFolderModal(item);
    } else {
      openBookMarkModal(item);
    }
  }, [openBookMarkModal, openFolderModal]);

  const handleRemove = useCallback((item: BookMarkRaw) => {
    Modal.confirm({
      title: 'Are you sure delete this item?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if ((item.children || []).length > 0) {
          chrome?.bookmarks?.removeTree(
            item.id,
            () => {
              refresh();
            },
          )

        } else {
          chrome?.bookmarks?.remove(
            item.id,
            () => {
              refresh();
            },
          )
        }
      },
      onCancel() {},
    });
  }, [refresh]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={formattedListData}
      renderItem={(item, index) => (
        <div onClick={() => handleClick(item)}>
          <List.Item
            className={`${item.children ? 'bg-gray-100' : ''} cursor-pointer hover:bg-gray-200`}
            actions={[
              <Button
                type="link"
                key="list-loadmore-edit"
                onClick={(e: React.MouseEvent) => {
                  handleEdit(item);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                edit
              </Button>,
              <Button
                type="link"
                key="list-loadmore-delete"
                onClick={(e: React.MouseEvent) => {
                  handleRemove(item);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <span className='text-red-500'>
                  delete
                </span>
              </Button>
            ]}
          >
            <List.Item.Meta
              className='px-2'
              avatar={
                item.url ? <Avatar
                  src={faviconURL(item.url)}
                  size='small'
                /> : <FolderOutlined style={{ fontSize: 24 }} />
              }
              title={item.title ? <a href="https://ant.design">{item.title}</a> : null}
              description={item.children ? 'folder' : item.url}
            />
          </List.Item>
        </div>
      )}
    />
  )
}