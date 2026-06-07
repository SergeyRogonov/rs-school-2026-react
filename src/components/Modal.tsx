import { useEffect, useRef } from 'react';
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  portalId?: string;
}

export default function Modal({
  children,
  onClose,
  portalId = 'modal-root',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') onClose?.();
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleBackdropClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const modalRoot = document.getElementById(portalId);
  if (!modalRoot) return null;

  return createPortal(
    <div
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
