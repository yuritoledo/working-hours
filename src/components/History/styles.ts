import styled from 'styled-components'

export const Registers = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
`

export const Line = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  span {
    flex: 3;
    font-weight: bold;
    :not(:first-child, :last-child) {
      flex: 1;
      font-weight: normal;

      &:nth-child(even) {
        margin-left: 15px;
        margin-right: 0;
        text-align: right;
      }

      &:nth-child(odd) {
        ::before {
          content: '-'
        }
      }
    }

    &:first-child {
      text-align: left;
      margin-right: 1rem;
    }

    &:last-child {
      text-align: right;
      margin-left: 1rem;
    }
  }
`

export const Message = styled.p`
  font-size: 1.2rem;
  text-align: center;
`

export const Day = styled.p`
  font-size: 1.5rem;
  margin: 0 15px 0 0;

`
