import styled from 'styled-components'

interface SectionProps {
  width: string;
  height: string;
}

export const Section = styled.section<SectionProps>`
  width: ${(p) => `${p.width}rem`};
  height: ${(p) => `${p.height}rem`};
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 0 7px #999;
  overflow-y: auto;
`
