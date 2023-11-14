import React, { useCallback, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { Avatar, List, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { BookMarkRaw } from "../../types";
import { faviconURL } from "../../utils/favicon";
import { BookMarkContext } from '../../hooks/useBookMarkContext';

interface IProps {
  data?: BookMarkRaw | null;
}

export default function GridItemContent(props: IProps) {
  const { data } = props;
  const { updateCurFolder } = useContext(BookMarkContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = useCallback((item: BookMarkRaw) => {
    window.open(item.url, '_blank');
  }, []);

  const handleManageFolder = useCallback(() => {
    if (data) {
      updateCurFolder(data);
      setSearchParams({mode: 'list'});
    }
  }, [data, updateCurFolder, setSearchParams]);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-12 bg-slate-300 px-4 py-1 flex justify-between items-center cursor-move">
        <div>
          {data?.title || `folder-${data?.id || 'unknown'}`}
          <span>({data?.children?.length || 0})</span>
        </div>
        <Button type="link" size="small" onClick={handleManageFolder} icon={<MenuOutlined />} />
      </div>
      <div className="flex-1 p-2 overflow-scroll">
        <List
          itemLayout="horizontal"
          dataSource={(data?.children || []).filter(it => it.url)}
          renderItem={(item, index) => (
            <List.Item
              className="py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleClick(item)}
            >
              <List.Item.Meta
                className='px-2'
                avatar={
                  item.url
                  ? <Avatar style={{ width: '24px', height: '24px' }} src={faviconURL(item.url, 24)}/>
                  : null
                }
                title={
                  <div className="text-ellipsis whitespace-nowrap overflow-hidden">{item.title || item.url}</div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}
