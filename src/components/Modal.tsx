import { useEffect, useRef, useId } from 'react';
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  portalId?: string;
  title: string;
}

export default function Modal({
  children,
  onClose,
  title,
  portalId = 'modal-root',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const firstInput = modalRef.current?.querySelector(
      'input, button, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') onClose?.();
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
      aria-labelledby={titleId}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div className="flex flex-col relative max-h-[90vh] rounded overflow-hidden w-full max-w-md bg-white shadow-lg">
        <div className="flex justify-between px-2 py-4 bg-amber-100 text-amber-900">
          <div className="flex items-center gap-2 px-4">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className=" py-2 px-4 rounded-md text-amber-900 hover:bg-amber-200 dark:hover:text-amber-900 text-xl font-bold transition-colors"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        <div
          className="overflow-y-auto"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
}
