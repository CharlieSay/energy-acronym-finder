import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import styled from 'styled-components'
import { AcronymTable } from './components/table-component'
import { Acronym, getAcronyms } from './hooks/data-hooks'

const Spacer = styled.div`
  padding: 32px 0 32px 0;
`

const App = () => {
  const [data, setData] = useState<Acronym[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const fetchIdRef = React.useRef(0)

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current

    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        const acronyms = getAcronyms()
        setData(acronyms.results.slice(startRow, endRow))
        setTotalCount(acronyms.totalResults)
        setPageCount(Math.ceil(acronyms.totalResults / pageSize))
      }
    }, 100)
  }, [])
  return (
    <div style={{ backgroundColor: '#f7f5f9' }}>
      <Container>
        <Spacer>
          <AcronymTable
            acronymData={data}
            totalCount={totalCount}
            fetchData={fetchData}
            controlledPageCount={pageCount}
          />
        </Spacer>
      </Container>
    </div>
  )
}

export default App
