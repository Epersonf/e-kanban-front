import styled from "styled-components";

export const HeaderContainer = styled.header`
  background: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};
  padding: ${props => props.theme.spacing(2)}px;
  fontSize: ${props => props.theme.typography.h5.fontSize};
  fontWeight: ${props => props.theme.typography.h5.fontSize};
`;