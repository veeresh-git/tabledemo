import React, { useEffect, useState } from "react";
import Table from "./commonTabe";

function Transac() {
  const [tempData,settempData]=useState([])
  useEffect(() => {
    fetch("https://canopy-frontend-task.vercel.app/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.transactions);
        let arr = [];
        data.transactions.map((item, i) => {
          arr.push({
            name: item.name,
            ticker: item.ticker,
            traded_on: item.traded_on,
            quantity: item.quantity,
            currency: item.currency,
            settlement_amount: item.settlement_amount,
          });
        });
        settempData(arr)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name of the holding",
        accessor: "name",
      },
      {
        Header: "Ticker",
        accessor: "ticker",
      },
      {
        Header: "Trade Date",
        accessor: "traded_on",
      },
      {
        Header: "QTY",
        accessor: "quantity",
      },
      {
        Header: "CCY",
        accessor: "currency",
      },
      {
        Header: "Settlement Amount",
        accessor: "settlement_amount",
      },
    ],
    []
  );
// We'll start our table without any data
const [data, setData] = React.useState([]);
const [loading, setLoading] = React.useState(false);
const [pageCount, setPageCount] = React.useState(0);
const fetchIdRef = React.useRef(0);

const [coloumn, setcoloumn] = React.useState("");
const [order, setorder] = React.useState("");

function shuffle(arr) {
  arr = [...arr];
  const shuffled = [];
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(rand, 1)[0]);
  }
  return shuffled;
}


const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
  // This will get called when the table needs new data
  // You could fetch your data from literally anywhere,
  // even a server. But for this example, we'll just fake it.

  // Give this fetch an ID
  const fetchId = ++fetchIdRef.current;

  // Set the loading state
  setLoading(true);

  // We'll even set a delay to simulate a server here
  setTimeout(() => {
    // Only update the data if this is the latest fetch
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex;
      const endRow = startRow + pageSize;
      if(coloumn){
        let arr=[];
        if(order==="none"){
          arr=shuffle(tempData)
          setData(arr.slice(startRow, endRow));

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(arr.length / pageSize));

        setLoading(false);
        }else{
          tempData.sort((a, b) => {
            if (a[coloumn] < b[coloumn]) {
              if (order === "ascending") {
                return -1;
              } else if (order === "discending") {
                return 1;
              }
            }
            if (a[coloumn] > b[coloumn]) {
              if (order === "ascending") {
                return 1;
              } else if (order === "discending") {
                return -1;
              }
            }
            return 0;
          });
          setData(tempData.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(tempData.length / pageSize));
          setLoading(false);
        }
      }else{
        setData(tempData.slice(startRow, endRow));
        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(tempData.length / pageSize));
        setLoading(false);
      }
    }
  }, 1000);
}, [coloumn,order,tempData]);

const handleSort = (coloumn, order) => {
  setcoloumn(coloumn)
  setorder(order)
};

return (
  <Table
    columns={columns || []}
    data={data || []}
    fetchData={fetchData}
    loading={loading}
    pageCount={pageCount}
    sortBy={handleSort}
  />
);
}
export default Transac;
