import { Modal, TitleBar } from "@shopify/app-bridge-react";

export default function ModalWarning({ onClick, shopify }) {
  return (
    <Modal id="warning-export">
      <p
        style={{
          margin: "1.5rem 0 1.5rem 1.5rem",
          color: "red",
          backgroundColor: "yellow",
          width:'fit-content'
        }}
      >
        You need to select reviews to export.
      </p>
      <TitleBar title="Action required!"></TitleBar>
    </Modal>
  );
}
