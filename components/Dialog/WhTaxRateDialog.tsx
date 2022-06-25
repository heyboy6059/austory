import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { FC, Dispatch, SetStateAction } from 'react'
import { FinancialYear } from '../../typing/enums'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  financialYear: FinancialYear
}
const WhTaxRateDialog: FC<Props> = ({ open, setOpen, financialYear }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="info-dialog-title"
      aria-describedby="info-dialog-description"
    >
      <DialogTitle>{financialYear} 소득세율표</DialogTitle>
      <DialogContent style={{ padding: '0 10px 20px 10px' }}>
        {/**
         * Currently we have only one tax rate table
         */}
        <Image
          src="/wh_tax_rate_table_2022_2023.png"
          width={564}
          height={270}
        />
        <div style={{ fontSize: '12px', margin: '5px' }}>
          자세한 정보:{' '}
          <Link
            href="https://www.ato.gov.au/rates/schedule-15---tax-table-for-working-holiday-makers/"
            passHref
          >
            <a target="_blank">
              ATO Schedule 15 – Tax table for working holiday makers
            </a>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WhTaxRateDialog
