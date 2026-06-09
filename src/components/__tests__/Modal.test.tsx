import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.append(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    modalRoot?.remove();
  });

  it('renders content through the portal and applies aria attributes', () => {
    render(
      <Modal title="Test Modal" onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when clicking outside the modal content', () => {
    const onClose = vi.fn();

    render(
      <Modal title="Test Modal" onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();

    render(
      <Modal title="Test Modal" onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('focuses the first input inside the modal on open', async () => {
    render(
      <Modal title="Test Modal" onClose={vi.fn()}>
        <input data-testid="first-input" />
      </Modal>
    );

    const firstInput = screen.getByTestId('first-input');
    await waitFor(() => {
      expect(firstInput).toHaveFocus();
    });
  });
});
