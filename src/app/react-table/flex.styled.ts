import styled from 'styled-components'

const DFlex = styled.div`
  display: flex !important;
  gap: 1rem;
  align-items: center;
`

const DFlexJustifyBetween = styled(DFlex)`
  justify-content: space-between !important;
  align-items: center;
`

const DFlexJustifyStart = styled(DFlex)`
  justify-content: flex-start !important;
`

const DFlexJustifyEnd = styled(DFlex)`
  justify-content: flex-end !important;
`

export const DFlexALignCenter = styled(DFlex)`
  align-items: center;
`
export const DFLexCenterBetween = styled(DFlex)`
  align-items: center;
  justify-content: space-between;
`

export const DFLexEndBetween = styled(DFlex)`
  align-items: end;
  justify-content: space-between;
`

export const DFlexJustifyCenter = styled(DFlex)`
  justify-content: center !important;
`
const DFlexCenterBeetwenStretch = styled(DFlex)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const FlexColumn = styled(DFlex)`
  flex-direction: column;
  align-items: flex-start;
`

const FlexRow = styled(DFlex)`
  flex-direction: row;
  align-items: flex-start;
  gap: 0.75rem;
`

const DFlexColumn = styled.div`
  display: flex !important;
  gap: 1rem;
  flex-direction: column;
`

export { DFlex, DFlexCenterBeetwenStretch, DFlexColumn, DFlexJustifyBetween, DFlexJustifyEnd, DFlexJustifyStart, FlexColumn, FlexRow }

