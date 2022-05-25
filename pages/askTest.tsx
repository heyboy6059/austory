import { FC, useState } from 'react'
import Card from '@mui/material/card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { styled } from '@mui/material/styles'
import ShowMoreText from 'react-show-more-text'
import { FlexVerticalCenterDiv } from '../common/uiComponents'
import { AiOutlineComment } from 'react-icons/ai'
import { COLOURS } from '../common/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const AskTask: FC = () => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <Card>
        <CardContent>
          <ShowMoreText
            more={
              <div style={{ color: COLOURS.PRIMARY_BLUE }}>
                <strong>더보기</strong>
              </div>
            }
            less={
              <div style={{ color: COLOURS.PRIMARY_BLUE }}>
                <strong>줄이기</strong>
              </div>
            }
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {`
멜번에서 5년차 회계사로 근무하고 있습니다.

제가 지금 좀 힘든게.

한국에서 고등학교 졸업하고 와서.

여기서 겨우겨우 대학교 나오고.

영주권도 겨우겨우 받아서 살고 있는데.

5년동안 한국사람이 운영하는 회계펌에서만 일을 했습니다.

첫 직장에는 취업이 쉬워서 했고.

두번째 직장에는 아는 사람 통해서 연봉 조금 올려서 갔는데요.

요즘 좀 회의감이 느껴집니다.

호주에서 살면서 계속 한국 사람들 하고만 일을 하고.

또 한인 업체들에서만 일 하면서 비전도 좀 없는것 처럼 느껴집니다.

근데 막상 영어만 쓰는 환경에 가려니 겁이 좀 많이 나는것도 사실입니다.

호주에서는 다들 이직 어떻게 하시나요?

영어가 좀 부족하면 아무래도 좀 업무하는데 눈치도 많이 보이고 어찌보면 무시도 좀 많이 당할까요?

오늘따라 더 마음이 심란하네요.. 도움주세요!
                `}
            </div>
          </ShowMoreText>
          {/* <CardActions> */}
          <FlexVerticalCenterDiv style={{ placeContent: 'flex-end' }}>
            <div>
              {/* <FcSms
                fontSize={18}
                style={{ marginTop: '1px'}}
              /> */}
              <AiOutlineComment
                fontSize={18}
                style={{
                  marginRight: '1px',
                  marginTop: '1px',
                  color: COLOURS.LIGHT_PURPLE
                }}
              />
              <span style={{ color: COLOURS.SECONDARY_SPACE_GREY }}>{3}</span>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </div>
          </FlexVerticalCenterDiv>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <div>Comments</div>
            </CardContent>
          </Collapse>
          {/* </CardActions> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default AskTask
