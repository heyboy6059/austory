import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { FC, Dispatch, SetStateAction } from 'react'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  content: JSX.Element
}
const InfoDialog: FC<Props> = ({ open, setOpen, title, content }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="info-dialog-title"
      aria-describedby="info-dialog-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  )
}

export default InfoDialog
