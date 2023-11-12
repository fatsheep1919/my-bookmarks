import { useCallback, useContext, useEffect } from 'react';
import { Modal, Form, Input, Select  } from 'antd';

import { BookMarkContext } from '../../hooks/useBookMarkContext';
import { formatFolderOptions } from '../../utils/data';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddBookMarkModal(props: IProps) {
  const { visible, onClose } = props;
  const { bookmarks, curFolder, modalTargetItem, refresh } = useContext(BookMarkContext);
  const [form] = Form.useForm();

  const folderOptions: { id: string, title: string }[] = [];
  formatFolderOptions(bookmarks?.[0]?.children || [], '', folderOptions);

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
      const { url, name, folder } = form.getFieldsValue();

      if (modalTargetItem) {
        chrome?.bookmarks?.update(
          modalTargetItem.id,
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
  }, [form, modalTargetItem, refresh, onClose]);

  const handleAfterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (visible) {
      form.setFieldValue('url', modalTargetItem?.url || '');
      form.setFieldValue('name', modalTargetItem?.title || '');
      form.setFieldValue('folder', curFolder?.id || folderOptions[0]?.id);
    }
  }, [visible, curFolder, modalTargetItem, form]);

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
            <Select placeholder="Select a folder" disabled={modalTargetItem !== null}>
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