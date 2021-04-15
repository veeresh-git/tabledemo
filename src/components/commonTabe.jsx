import React, { useEffect, useState } from "react";
import {
  useTable,
  useBlockLayout,
  useColumnOrder,
  useResizeColumns,
  usePagination,
  useSortBy,
} from "react-table";
import "./table.scss";

function Table({
  data,
  columns,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  sortBy
}) {
  const [defaultColumn, setdefaultColumn] = React.useState({
    minWidth: (2.5 * window.innerWidth) / 100,
    width: (12.5 * window.innerWidth) / 100,
    maxWidth: (33.3 * window.innerWidth) / 100,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    resetResizing,
    setColumnOrder,
    visibleColumns,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useColumnOrder,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  function shuffle(arr) {
    arr = [...arr];
    const shuffled = [];
    while (arr.length) {
      const rand = Math.floor(Math.random() * arr.length);
      shuffled.push(arr.splice(rand, 1)[0]);
    }
    return shuffled;
  }

  const randomizeColumns = () => {
    setColumnOrder(shuffle(visibleColumns.map((d) => d.id)));
  };

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const [selectedCol, SetselectedCol] = useState(columns[0].accessor);

  const handleColChange = (e) => {
    SetselectedCol(e.target.value);
    if(selectedOrder !="none"){
      sortBy(e.target.value,selectedOrder)
      console.log(e.target.value,selectedCol)
    }
  };

  const [selectedOrder, SetselectedOrder] = useState("none");

  const handleOrderChange = (e) => {
    SetselectedOrder(e.target.value);
    sortBy(selectedCol,e.target.value)
  };

  return (
    <div className="table_wrapper">
      <div className="Buttons_container">
        <button onClick={() => randomizeColumns({})}>Reorder Columns</button>
        <button onClick={resetResizing}>Reset Resizing</button>
        <div className="sorting">
        <p>Sort by coloumn:</p>
        <select onChange={handleColChange} value={selectedCol}>
          {columns.map((col, i) => (
            <option key={i} value={col.accessor}>
              {col.Header}
            </option>
          ))}
        </select>
        <p>Order:</p>
        <select onChange={handleOrderChange} value={selectedOrder}>
          <option value="none">None</option>
          <option value="ascending">Ascending</option>
          <option value="discending">Discending</option>
        </select>
        </div>
        
      </div>
      <div className="table_container">
        <div {...getTableProps()} className="table">
          <div style={{ width: "100%" }}>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="th">
                    {column.render("Header")}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? "isResizing" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()} style={{ width: "100%" }}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className="td">
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <tr>
              {loading ? (
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                  results
                </td>
              )}
            </tr>
          </div>
        </div>
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Table;
