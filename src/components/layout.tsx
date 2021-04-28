import { Container, Navbar } from 'react-bootstrap'
import styled from 'styled-components'

const HeaderTitle = styled.h1`
  color: #674186;
  font-size: 56px;
`

const HeaderStyle = styled.header`
  background-color: #ffffff;
`

export const Header = () => {
  return (
    <HeaderStyle>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">
            <HeaderTitle>MSM Acronym Finder</HeaderTitle>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </HeaderStyle>
  )
}

export const Footer = () => {
  return <footer></footer>
}
