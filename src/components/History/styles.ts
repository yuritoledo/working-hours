import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
`

export const Registers = styled.div`
  display: flex;
  flex-direction: column;
`

export const Line = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;

  span {
    font-size: 2rem;
    :not(:first-child, :last-child) {
      background-color: peachpuff;
      margin: auto -6px;
      &:nth-child(even) {
        :after {
          content: '-'
        }
      }
      &:nth-child(odd) {
        margin-left: 6px;
      }
    }
    &:first-child {
      font-weight: bold;
      margin-right: 5rem;
    }
    &:last-child {
      font-weight: bold;
      margin-left: 5rem;
    }
  }
`
