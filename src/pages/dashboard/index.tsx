import React from 'react';
import { Typography } from 'antd';

export default function DashboardPage() {
  
  return (
    <>
      <Typography.Text
        type='secondary'
        className='flex justify-center items-center py-12'
      >
        click 'Add New' button, or press 'Ctrl + v / Cmd + v' to add new bookmark
      </Typography.Text>
    </>
  )
}