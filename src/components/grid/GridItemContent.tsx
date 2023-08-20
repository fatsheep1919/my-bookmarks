import React, { useCallback } from "react";
import { Avatar, List } from 'antd';

import { BookMarkRaw } from "../../types";
import { faviconURL } from "../../utils/favicon";

interface IProps {
  data?: BookMarkRaw | null;
}

export default function GridItemContent(props: IProps) {
  const { data } = props;
  console.log('GridItem data:', data)

  const handleClick = useCallback((item: BookMarkRaw) => {
    window.open(item.url, '_blank');
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-12 bg-slate-300 px-4 py-2 flex items-center cursor-move">
        {data?.title || `folder-${data?.id || 'unknown'}`}
        <span>({data?.children?.length || 0})</span>
      </div>
      <div className="flex-1 p-2 overflow-scroll">
        <List
          itemLayout="horizontal"
          dataSource={(data?.children || []).filter(it => it.url)}
          renderItem={(item, index) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => handleClick(item)}
            >
              <List.Item.Meta
                className='px-2'
                avatar={
                  item.url ? <Avatar src={faviconURL(item.url, 32)}/> : null
                }
                title={<a href={item.url}>{item.title}</a>}
                description={
                  <div className="text-ellipsis whitespace-nowrap overflow-hidden">{item.url}</div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}
