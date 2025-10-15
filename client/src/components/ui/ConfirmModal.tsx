import React from "react";
import Modal from "./Modal";

interface Props {
  open: boolean;
  title?: string; 
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean; 
}

export default function ConfirmModal({
  open,
  title = "Delete Category",
  message,
  onCancel,
  onConfirm,
  loading,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      widthClass="w-[560px]"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 h-9 rounded bg-gray-500/70 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 h-9 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <p className="text-[15px] leading-6">{message}</p>
    </Modal>
  );
}
