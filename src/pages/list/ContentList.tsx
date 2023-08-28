import { Avatar, List } from 'antd';

import { BookMarkRaw } from "../../types";
import { faviconURL } from "../../utils/favicon";

interface IProps {
  listData: BookMarkRaw[];
}

export default function ContentList(props: IProps) {
  const { listData } = props;
  const sortedListData = listData?.sort((a, b) => {
    if ((a.children && b.children) || (!a.children && !b.children)) {
      return (a.title || '').localeCompare(b.title || '');
    } else if (a.children && !b.children) {
      return -1;
    }
    return 1;
  })

  return (
    <List
      itemLayout="horizontal"
      dataSource={sortedListData}
      renderItem={(item, index) => (
        <List.Item
          className={`${item.children ? 'bg-gray-100' : ''} hover:bg-gray-200`}
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
            avatar={
              item.url ? <Avatar
                // src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                src={faviconURL(item.url)}
                size='small'
              /> : null
            }
            title={<a href="https://ant.design">{item.title}</a>}
            description={item.children ? 'folder' : item.url}
          />
        </List.Item>
      )}
    />
  )
}