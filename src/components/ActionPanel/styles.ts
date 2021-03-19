import styled from 'styled-components'
import { WorkSituation } from '../../utils/constants'

interface ButtonProps {
  variant: WorkSituation
}

const situationColor = (p: ButtonProps) => {
  switch (p.variant) {
    case WorkSituation.ARRIVING:
      return '#008000'
    case WorkSituation.EXITING:
      return '#ff0000'
    default:
      return '#999'
  }
}

export const WelcomeMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  span {
    display: block;
    font-size: 1.5rem;
  }
`

export const Avatar = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
`

export const Timer = styled.h1`
  font-size: 3rem;
`

export const Button = styled.button<ButtonProps>`
  width: 15rem;
  height: 5rem;
  border: 2px solid ${situationColor};
  background-color: white;
  color: ${situationColor};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.5rem;
  transition: background-color 200ms, color 500ms, border 500ms;
  &:focus {
    outline: none;
  }
`
