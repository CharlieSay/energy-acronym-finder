import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import styled from 'styled-components'
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useAsyncDebounce,
} from 'react-table'
import { Acronym } from '../hooks/data-hooks'

import Left from '../assets/left.svg'
import Right from '../assets/right.svg'

interface AcronymTableProps {
  acronymData: Acronym[]
  totalCount: number
  fetchData: ({ pageSize, pageIndex }: any) => void
  controlledPageCount: number
}

interface GlobalFilterProps {
  preGlobalFilteredRows: number
  globalFilter: string
  setGlobalFilter: (filterValue: any) => void
}

const PaginationButton = styled.button`
  font-family: 'MSM Primary Book';
  font-weight: 900;
  border-radius: 8px;
  background-color: white;
  border: none;
  box-shadow: 20px 41px 55px rgb(0 0 0 / 6%);
`

const GlobalFilterComponent = (props: GlobalFilterProps) => {
  const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = props
  const count = preGlobalFilteredRows
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value: any) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
        style={{
          padding: `8px`,
          border: 'none',
          borderRadius: '4px',
          marginLeft: `4px`,
          fontSize: '0.8em',
          boxShadow: '20px 41px 55px rgb(0 0 0 / 6%)',
        }}
      />
    </span>
  )
}

export const AcronymTable = (props: AcronymTableProps) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Acronym',
        accessor: 'acronym', // accessor is the "key" in the data
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Commonly Used',
        accessor: 'commonlyUsed',
      },
    ],
    [],
  )
  const { fetchData, controlledPageCount, totalCount } = props

  const data = props.acronymData

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    useGlobalFilter,
    usePagination,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance

  useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  return (
    <>
      <Table
        striped
        bordered
        hover
        {...getTableProps()}
        style={{
          fontFamily: 'MSM Primary Book',
          fontWeight: 700,
          fontSize: '18px',
        }}
      >
        <thead>
          {headerGroups.map(
            (headerGroup: {
              getHeaderGroupProps: () => JSX.IntrinsicAttributes &
                React.ClassAttributes<HTMLTableRowElement> &
                React.HTMLAttributes<HTMLTableRowElement>
              headers: any[]
            }) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(
                  (column: {
                    getHeaderProps: () => JSX.IntrinsicAttributes &
                      React.ClassAttributes<HTMLTableHeaderCellElement> &
                      React.ThHTMLAttributes<HTMLTableHeaderCellElement>
                    render: (arg0: string) => React.ReactNode
                    isSorted: any
                    isSortedDesc: any
                  }) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ),
                )}
              </tr>
            ),
          )}
          <tr>
            <th colSpan={visibleColumns.length}>
              <GlobalFilterComponent
                preGlobalFilteredRows={totalCount}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row: {
              getRowProps: () => JSX.IntrinsicAttributes &
                React.ClassAttributes<HTMLTableRowElement> &
                React.HTMLAttributes<HTMLTableRowElement>
              cells: any[]
            }) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(
                    (cell: {
                      getCellProps: () => JSX.IntrinsicAttributes &
                        React.ClassAttributes<HTMLTableDataCellElement> &
                        React.TdHTMLAttributes<HTMLTableDataCellElement>
                      render: (arg0: string) => React.ReactNode
                    }) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    },
                  )}
                </tr>
              )
            },
          )}
          <tr>
            <td colSpan={3}>
              Showing {page.length} of {totalCount} results
            </td>
          </tr>
        </tbody>
      </Table>
      <div className="pagination">
        <div>
          <PaginationButton
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <img
              src={Left}
              style={{ opacity: `${!canPreviousPage ? '0.2' : '1'}` }}
            />
            <img
              src={Left}
              style={{ opacity: `${!canPreviousPage ? '0.2' : '1'}` }}
            />
          </PaginationButton>
          <PaginationButton
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <img
              src={Left}
              style={{ opacity: `${!canPreviousPage ? '0.2' : '1'}` }}
            />
          </PaginationButton>
          <PaginationButton onClick={() => nextPage()} disabled={!canNextPage}>
            <img
              src={Right}
              style={{ opacity: `${!canNextPage ? '0.2' : '1'}` }}
            />
          </PaginationButton>
          <PaginationButton
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <img
              src={Right}
              style={{ opacity: `${!canNextPage ? '0.2' : '1'}` }}
            />
            <img
              src={Right}
              style={{ opacity: `${!canNextPage ? '0.2' : '1'}` }}
            />
          </PaginationButton>
        </div>
        <span
          style={{
            padding: `8px`,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '20px 41px 55px rgb(0 0 0 / 6%)',
            marginLeft: `16px`,
          }}
        >
          Page{' '}
          <strong style={{ borderColor: '#674186' }}>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
          style={{
            padding: `8px`,
            border: 'none',
            borderRadius: '4px',
            marginLeft: `16px`,
            boxShadow: '20px 41px 55px rgb(0 0 0 / 6%)',
          }}
        >
          {[10, 20, 30].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
