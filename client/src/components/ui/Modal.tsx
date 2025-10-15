import React from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
  footer?: React.ReactNode;
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  widthClass = "w-[560px]",
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className={`bg-white rounded-lg shadow-xl ${widthClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-500">
          <h3 className="text-[16.5px] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 grid place-items-center rounded hover:bg-gray-100"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-gray-500">{footer}</div>
        )}
      </div>
    </div>
  );
}
