import { Modal, Form, Input, Select  } from 'antd';
import { useCallback } from 'react';

interface IProps {
  visible: boolean;
  folderOptions: {
    id: string;
    title: string;
  }[];
  onClose: () => void;
}

export default function AddFolderModal(props: IProps) {
  const { visible, folderOptions, onClose } = props;
  const [form] = Form.useForm();

  const handleOk = useCallback(() => {
    const { name, folder } = form.getFieldsValue();
    chrome?.bookmarks?.create(
      {
        parentId: folder,
        title: name
      },
      () => {
        form.resetFields();
        onClose();
      },
    );
  }, [form, onClose]);

  return (
    <Modal
      title="Add New Folder"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
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
          <Form.Item name="name" label="Folder Name">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="folder" label="Parent Folder">
            <Select allowClear>
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