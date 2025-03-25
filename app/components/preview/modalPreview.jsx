import { Modal, TitleBar } from "@shopify/app-bridge-react";

export default function ModalPreview({
  shopify,
  onClick,
  message,
  id,
  title,
  button,
}) {
  return (
    <Modal id={id}>
      <p style={{ margin: "1.5rem 0 1.5rem 1.5rem" }}>{message}</p>

      <TitleBar title={title}>
        <button variant="primary" onClick={onClick}>
          {button}
        </button>
        <button onClick={() => shopify.modal.hide(id)}>Cancel</button>
      </TitleBar>
    </Modal>
  );
}
