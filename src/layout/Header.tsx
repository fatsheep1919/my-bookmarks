import React from 'react';

import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-5/6 h-full flex justify-between items-center">
      <div className='flex justify-center items-center gap-4'>
        <div className='text-xl font-bold mx-10'>My-BookMark</div>
        <div className='w-64 ml-6'>
          {/* <Select
            showSearch
            className='w-full'
            value={''}
            defaultActiveFirstOption={false}
            suffixIcon={<SearchOutlined />}
            filterOption={false}
            options={([{value: 'abc', text: 'abc'}]).map((d) => ({
              value: d.value,
              label: d.text,
            }))}
          /> */}
        </div>
      </div>
      { children }
    </div>
  )
}