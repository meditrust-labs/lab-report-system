import React, { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import ReportsApi from "@Services/firebase.service";

export default function UpdateReferenceModal({ show, closeModal }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  async function updateRefrence() {
    setLoading(true);
    const id = toast.loading("Updating reference ...");

    try {
      await ReportsApi.resetReference();
      toast.success("Reference updated successfully", { id });
    } catch (err) {
      toast.error("An error occurred", { id });
      console.log(err);
    }

    closeModal();
    history.push("/dashboard");
    setLoading(false);
  }

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Reset Refrence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to reset refrence value to 0? This action can't be
        reversed !
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={updateRefrence} disabled={loading}>
          Reset Reference
        </Button>
        <Button variant="primary" onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
