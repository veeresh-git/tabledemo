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

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

function Table({
  data,
  columns,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) {
  const [defaultColumn, setdefaultColumn] = React.useState({
    minWidth: (2.5*window.innerWidth)/100,
    width:  (12.5*window.innerWidth)/100,
    maxWidth: (33.3*window.innerWidth)/100,
  });

  const size = useWindowSize();

  useEffect(() => {
    setdefaultColumn({
      minWidth: (2.5*size.width)/100,
      width: (12.5*size.width)/100,
      maxWidth: (33.3*size.width)/100,
    });
  }, [size.width]);


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
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, 
      pageCount: controlledPageCount,
    },
    useColumnOrder,
    useBlockLayout,
    useResizeColumns,
    useSortBy,
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

  return (
    <div className="table_wrapper">
      <div className="Buttons_container">
        <button onClick={() => randomizeColumns({})}>Reorder Columns</button>
        <button onClick={resetResizing}>Reset Resizing</button>
      </div>
      <div className="table_container">
        <div {...getTableProps()} className="table">
          <div style={{ width: "100%" }}>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="th"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
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
                // Use our custom loading state to show a loading indicator
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
