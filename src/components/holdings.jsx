import React, { useEffect, useState } from "react";
import Table from "./commonTabe";

function Holdings() {
  let serverData = [];
  useEffect(() => {
    fetch("https://canopy-frontend-task.now.sh/api/holdings")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.payload);
        let arr = [];
        data.payload.map((item, i) => {
          arr.push({
            name: item.name,
            ticker: item.ticker,
            asset_class: item.asset_class,
            avg_price: item.avg_price,
            market_price: item.market_price,
            latest_chg_pct: item.latest_chg_pct,
            market_value_ccy: item.market_value_ccy,
          });
        });
        serverData = arr;
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
        Header: "The asset class it belongs to",
        accessor: "asset_class",
      },
      {
        Header: "Average price",
        accessor: "avg_price",
      },
      {
        Header: "Market Price",
        accessor: "market_price",
      },
      {
        Header: "Latest change percentage",
        accessor: "latest_chg_pct",
      },
      {
        Header: "Market Value in Base CCY",
        accessor: "market_value_ccy",
      },
    ],
    []
  );
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

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
        setData(serverData.slice(startRow, endRow));

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(serverData.length / pageSize));

        setLoading(false);
      }
    }, 1000);
  }, []);

  console.log(data);

  return (
    <Table
      columns={columns || []}
      data={data || []}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
    />
  );
}

export default Holdings;
