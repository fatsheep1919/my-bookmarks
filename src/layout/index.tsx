import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Input, Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import AddBookMarkModal from '../components/bookmark/AddBookMarkModal';

export default function Layout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleKeyDown = useCallback((event: { ctrlKey: any; metaKey: any; keyCode: number; }) => {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 86) {
      showModal();
   }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);  

  return (
    <div className="h-screen flex flex-col">
      <div className='w-full h-20 flex shrink-0 justify-center bg-slate-300'>
        <div className="w-5/6 h-full flex justify-between items-center">
          <div className='flex justify-center items-center gap-4'>
            <div className='text-2xl font-bold mx-6'>My-BookMark</div>
            <div className='w-64 mx-2'>
              {/* <Input prefix={<SearchOutlined />} className='w-full' /> */}
              <Select
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
              />
            </div>
          </div>
          <div className='flex gap-2 mx-6'>
            <Button type="text" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            <Button type="text" onClick={() => navigate('/list')}>List</Button>
            <Button type='primary' onClick={showModal} className='ml-2'>Add New</Button>
          </div>
          
        </div>
      </div>
      <div className='w-full flex-1 flex justify-center'>
        <div className='w-5/6 h-full overflow-scroll'>
          <Outlet />

        </div>
      </div>

      <AddBookMarkModal visible={open} onClose={hideModal} />
    </div>
  )
}