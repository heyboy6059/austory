import { FC, SetStateAction, Dispatch, forwardRef } from "react"
import Dialog from "@mui/material/Dialog"
import { TransitionProps } from "@mui/material/transitions"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import WarningIcon from "@mui/icons-material/Warning"
import Slide from "@mui/material/Slide"
import { FlexCenterDiv, FlexSpaceBetween } from "../common/uiComponents"
import Tooltip from "@mui/material/Tooltip"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
const CovidInfoDialog: FC<Props> = ({ open, setOpen }) => {
  // Slide transition
  const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />
  })

  return (
    <Dialog
      // fullScreen
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      maxWidth="xl"
      fullWidth={true}
    >
      <div style={{ height: "85vh" }}>
        <FlexSpaceBetween
          style={{
            alignItems: "center",
            backgroundColor: "#2F7AE5",
            height: "35px",
            padding: "0 10px 0 5px",
          }}
        >
          <Tooltip title="뒤로가기" placement="bottom" arrow>
            <ArrowBackIcon
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => setOpen(false)}
            />
          </Tooltip>
          <Tooltip title="링크 복사" placement="bottom" arrow>
            <ContentCopyIcon style={{ color: "white", cursor: "pointer" }} />
          </Tooltip>
        </FlexSpaceBetween>
        <FlexCenterDiv style={{ height: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <WarningIcon style={{ color: "orange" }} fontSize="large" />
            <div>준비중 입니다.</div>
          </div>
        </FlexCenterDiv>
      </div>
    </Dialog>
  )
}

export default CovidInfoDialog
