import { Modal } from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddBookMarkModal(props: IProps) {
  const { visible, onClose } = props;
  return (
    <Modal
      title="Modal"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      okText="Add"
      cancelText="Cancel"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </Modal>
  )
}