import { motion } from 'framer-motion'
import { springScale } from '../lib/motion'
import { t } from '../i18n'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <motion.div
        variants={springScale}
        initial="initial"
        animate="animate"
        className="w-full max-w-sm rounded-xl border border-border bg-bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-text-primary">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            {cancelLabel ?? t('confirm.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-accent-warm py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {confirmLabel ?? t('confirm.delete')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
