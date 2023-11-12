import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';

import { BookMarkRaw } from '../types';
import { BookMarkContext } from '../hooks/useBookMarkContext';

import Header from './Header';
import DashboardPage from '../pages/dashboard';
import ListPage from '../pages/list';
import AddFolderModal from '../components/bookmark/AddFolderModal';
import AddBookMarkModal from '../components/bookmark/AddBookMarkModal';

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookmarks, setBookMarks] = useState<BookMarkRaw[]>([]);
  const [curFolder, setCurFolder] = useState<BookMarkRaw | null>(null);
  const [modalTargetFolder, setModalTargetFolder] = useState<BookMarkRaw | null>(null);
  const [modalTargetItem, setModalTargetItem] = useState<BookMarkRaw | null>(null);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [bookmarkModalVisible, setBookMarkModalVisible] = useState(false);

  const refresh = useCallback(async () => {
    const tree: BookMarkRaw[] = await chrome?.bookmarks?.getTree?.();
    console.log('chrome bookmarks:', tree);
    setBookMarks(tree);
  }, []);

  const updateCurFolder = useCallback((folder: BookMarkRaw) => setCurFolder(folder), []);

  const openFolderModal = useCallback((targetFolder: BookMarkRaw | null) => {
    setModalTargetFolder(targetFolder);
    setFolderModalVisible(true);
  }, []);

  const closeFolderModal = useCallback(() => {
    setModalTargetFolder(null);
    setFolderModalVisible(false);
  }, []);

  const openBookMarkModal = useCallback((item: BookMarkRaw | null) => {
    setModalTargetItem(item);
    setBookMarkModalVisible(true);
  }, []);

  const closeBookMarkModal = useCallback(() => {
    setModalTargetItem(null);
    setBookMarkModalVisible(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /*
  const handleKeyDown = useCallback((event: { ctrlKey: any; metaKey: any; keyCode: number; }) => {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 86) {
      showModal();
   }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  */

  return (
    <BookMarkContext.Provider
      value={{
        bookmarks,
        curFolder,
        modalTargetFolder,
        modalTargetItem,
        refresh,
        updateCurFolder,
        openBookMarkModal,
        closeBookMarkModal,
        openFolderModal,
        closeFolderModal,
      }}
    >
      <div className="h-screen flex flex-col">
        <div className='w-full h-20 flex shrink-0 justify-center bg-slate-300'>
          <Header>
            <div className='flex gap-2 mx-6'>
              <Button type="text" onClick={() => {
                setSearchParams({mode: 'dashboard'});
              }}>Dashboard</Button>
              <Button type="text" onClick={() => {
                setSearchParams({mode: 'list'});
              }}>List</Button>
              <Button type='primary' onClick={() => openBookMarkModal(null)} className='ml-2'>Add New</Button>
            </div>
          </Header>
        </div>
        <div className='w-full flex-1 flex justify-center'>
          <div className='w-5/6 h-full overflow-scroll'>
            {
              searchParams.get('mode') === 'dashboard' ? (
                <DashboardPage />
              ) : (
                <ListPage />
              )
            }
          </div>
        </div>

        <AddBookMarkModal
          visible={bookmarkModalVisible}
          onClose={closeBookMarkModal}
        />
        <AddFolderModal
          visible={folderModalVisible}
          onClose={closeFolderModal}
        />
      </div>
    </BookMarkContext.Provider>
  )
}