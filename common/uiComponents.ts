import styled from "styled-components"
import Image from "next/image"

export const FlexCenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const FlexVerticalCenterDiv = styled.div`
  display: flex;
  align-items: center;
`

export const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`

export const GridDiv = styled.div`
  display: grid;
`

export const EllipsisDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserImage = styled(Image)({
  cursor: "pointer",
  borderRadius: "50%",
})

export const LogoImage = styled(Image)({
  cursor: "pointer",
})

export const H1 = styled.div`
  font-size: 2rem;
  margin: 10px 0px;
`
