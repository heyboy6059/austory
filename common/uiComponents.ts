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

export const UserImage = styled(Image)({
  cursor: "pointer",
  borderRadius: "50%",
})

export const LogoImage = styled(Image)({
  cursor: "pointer",
})
