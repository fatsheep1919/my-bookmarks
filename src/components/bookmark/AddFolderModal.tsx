import React, { useCallback, useContext, useEffect } from 'react';
import { Modal, Form, Input, Select  } from 'antd';

import { BookMarkContext } from '../../hooks/useBookMarkContext';
import { formatFolderOptions } from '../../utils/data';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddFolderModal(props: IProps) {
  const { visible, onClose } = props;
  const { bookmarks, curFolder, modalTargetFolder, refresh } = useContext(BookMarkContext);
  const [form] = Form.useForm();

  const folderOptions: { id: string, title: string }[] = [];
  formatFolderOptions(bookmarks?.[0]?.children || [], '', folderOptions);

  const handleOk = useCallback(() => {
    const { name, folder } = form.getFieldsValue();

    if (modalTargetFolder) {
      chrome?.bookmarks?.update(
        modalTargetFolder.id,
        {
          title: name,
        },
        () => {
          onClose();
          refresh();
        },
      );
    } else {
      chrome?.bookmarks?.create(
        {
          parentId: folder,
          title: name
        },
        () => {
          onClose();
          refresh();
        },
      );
    }
  }, [form, modalTargetFolder, refresh, onClose]);

  const handleAfterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (visible) {
      if (modalTargetFolder) {
        form.setFieldValue('name', modalTargetFolder.title || '');
        form.setFieldValue('folder', modalTargetFolder.parentId);
      } else {
        form.setFieldValue('folder', curFolder?.id || folderOptions[0]?.id);
      }
    }
  }, [visible, curFolder, modalTargetFolder, form]);

  return (
    <Modal
      title="Add New Folder"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      afterClose={handleAfterClose}
      okText="Ok"
      cancelText="Cancel"     
    >
      <div className='px-9 my-6'>
        <Form
          form={form}
          {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          }}
        >
          <Form.Item name="name" label="Folder Name">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="folder" label="Parent Folder">
            <Select disabled={modalTargetFolder !== null}>
              {
                folderOptions.map(it => (
                  <Select.Option key={it.id} value={it.id}>{it.title}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}