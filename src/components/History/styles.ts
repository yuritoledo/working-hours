import styled, { keyframes } from 'styled-components'

const slideUp = keyframes`
 from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    transform: translateY(0px);
    opacity: 1;
  }
`

export const Registers = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
  animation: ${slideUp} 2s ease;
`

export const Line = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  span {
    animation: ${slideUp} 1s ease;
    flex: 3;
    font-weight: bold;
    :not(:first-child, :last-child) {
      flex: 1;
      font-weight: normal;
      text-align:center;

      &:nth-child(even) {
        margin-left: 7px;
        text-align: right;
      }

      &:nth-child(odd) {
        margin-right: 7px;
        ::before {
          content: '-'
        }
      }
    }

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }
  }
`

export const Message = styled.p`
  font-size: 1.2rem;
  text-align: center;
`

export const Day = styled.p`
  font-size: 1.9rem;
  font-weight: bold;
  margin: 0 15px 0 0;
`

export const WorkedTime = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  animation: ${slideUp} 2s ease;
`
