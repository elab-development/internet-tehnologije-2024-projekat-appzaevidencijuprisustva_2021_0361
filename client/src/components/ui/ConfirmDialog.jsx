import Modal from './Modal.jsx';

function ConfirmDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  isOpen,
  isLoading = false,
  message,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="grid gap-5">
        <p className="text-sm leading-6 text-slate-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
