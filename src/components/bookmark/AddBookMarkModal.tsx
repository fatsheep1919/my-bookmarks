import { useCallback, useContext, useEffect } from 'react';
import { Modal, Form, Input, Select  } from 'antd';

import { BookMarkRaw } from '../../types';
import { BookMarkContext } from '../../hooks/useBookMarkContext';

type FolderOption = {
  id: string;
  title: string;
}

const formatFolderOptions = (nodes: BookMarkRaw[], path: string, arr: FolderOption[]) => {
  nodes
    .filter(it => Array.isArray(it.children) && it.children.length >= 0)
    .forEach(it => {
      const title = `${path}/${it.title}`;
      arr.push({
        ...it,
        title,
      });

      if (it.children && it.children.length > 0) {
        formatFolderOptions(it.children, title, arr);
      }
    });
}

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddBookMarkModal(props: IProps) {
  const { visible, onClose } = props;
  const { bookmarks, curFolder, curItem, refresh } = useContext(BookMarkContext);
  const [form] = Form.useForm();

  const folderOptions: FolderOption[] = [];
  formatFolderOptions(bookmarks?.[0]?.children || [], '', folderOptions);

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
      const { url, name, folder } = form.getFieldsValue();

      if (curItem) {
        chrome?.bookmarks?.update(
          curItem.id,
          {
            url,
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
            url,
            title: name,
            parentId: folder,
          },
          () => {
            onClose();
            refresh();
          },
        );
      }
    } catch (error) {}
  }, [form, curItem, refresh, onClose]);

  const handleAfterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (visible) {
      form.setFieldValue('url', curItem?.url || '');
      form.setFieldValue('name', curItem?.title || '');
      form.setFieldValue('folder', curFolder?.id || folderOptions[0]?.id);
    }
  }, [visible, curFolder, curItem, form]);

  return (
    <Modal
      title="Add New BookMark"
      open={visible}
      onOk={handleSave}
      onCancel={onClose}
      afterClose={handleAfterClose}
      okText="Ok"
      cancelText="Cancel"
    >
      <div className='my-6'>
        <Form
          form={form}
          {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
          }}
        >
          <Form.Item name="url" label="Url" rules={[{ required: true }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="folder" label="Folder">
            <Select placeholder="Select a folder" disabled={curItem !== null}>
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
  )
}