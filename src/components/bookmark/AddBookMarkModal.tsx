import { Modal, Form, Input, Select  } from 'antd';
import { useCallback } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const getPageTitle = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    return title;
  } catch (err) {
    console.error(`Error fetching page title: ${err}`);
    return null;
  }
};

export default function AddBookMarkModal(props: IProps) {
  const { visible, onClose } = props;
  const [form] = Form.useForm();
  const [bookmarks, saveBookMarks] = useLocalStorage();

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
      const fields = form.getFieldsValue();

      let targetFolderData;
      if (fields.folder) {
        targetFolderData = bookmarks.find(it => it.type === 'folder' && it.name === fields.folder);
      }

      const lastId = bookmarks?.length > 0 ? bookmarks[bookmarks.length - 1].id : 0;
      bookmarks.push({
        id: lastId + 1,
        pId: targetFolderData?.id || 0,
        type: 'url',
        name: fields.name,
        value: fields.url,
      })

      console.log('bookmarks:', bookmarks)
      saveBookMarks([...bookmarks]);
      onClose();
    } catch (error) {}
  }, [form, bookmarks, saveBookMarks, onClose]);

  const handleAfterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleInputUrl = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = await getPageTitle(e.target.value);
    console.log('title:', title);
  }, []);

  return (
    <Modal
      title="Add New BookMark"
      open={visible}
      onOk={handleSave}
      onCancel={onClose}
      afterClose={handleAfterClose}
      okText="Add"
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
            <Input allowClear onBlur={handleInputUrl} />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="folder" label="Folder">
            <Select placeholder="Select a folder" allowClear>
              <Select.Option value='ukll'>ukll</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}