import { FC, Dispatch, SetStateAction } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  leftLabel: string
  rightLabel: string
  leftAction: () => void
  rightAction: () => void
  content: string
}
const ConfirmDialog: FC<Props> = ({
  open,
  setOpen,
  leftLabel,
  rightLabel,
  leftAction,
  rightAction,
  content
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={() => leftAction()}>{leftLabel}</Button>
          <Button onClick={() => rightAction()}>{rightLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmDialog
