"use client";
import Grid from "@/components/grid/grid";
import {
  PixInput,
  PixSearch,
  PixTextArea,
} from "@/components/inputs/pixInputs";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { ColDef, IRowNode } from "ag-grid-community";
import { Search, Square } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import PixButton from "@/components/button/button";
import {
  AgGridReact,
  AgGridReactProps,
  CustomCellRendererProps,
} from "ag-grid-react";
import Link from "next/link";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { GetTransactions } from "@/routes/routes";

interface TransactionsGrid {
  id: string;
  sum: number;
  date: string;
  order: string;
}

export default function Transactions() {
  const [search, setSearch] = useState<string>("");
  const [colDefs, setColDefs] = useState<ColDef<TransactionsGrid>[]>([
    {
      field: "id",
      resizable: false,
      minWidth: 80,
      headerName: "№",
      width: 80,
    },
    {
      field: "sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Сумма",
    },
    {
      field: "date",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Дата",
    },
    {
      field: "order",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Заказ",
      cellRenderer: OrderLink,
    },
  ]);

  const [rowData, setRowData] = useState<TransactionsGrid[]>([]);

  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    GetTransactions().then((response) => {
      setRowData(
        response.data.rows.map((item) => {
          return {
            date: item.created.split(" ")[0],
            id: item.name,
            order:
              item.operations[0].customerOrder.meta.href.split("/")[
                item.operations[0].customerOrder.meta.href.split("/").length - 1
              ],
            sum: item.sum / 100,
          };
        })
      );
    });
  }, []);

  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по заказам"
            onChange={onChangeSearch}
          />
          <h1 className="font-bold text-2xl">Мои заказы</h1>
        </div>
        <Grid
          className="w-full h-full"
          colDefs={colDefs}
          rowData={rowData}
          quickFilterText={search}
        />
      </div>
    </div>
  );
}

function OrderLink(props: CustomCellRendererProps<TransactionsGrid>) {
  return (
    <Link
      className="text-[#2E90FA] hover:underline transition-all"
      href={`/dashboard/orders/${props.data!.order}`}
    >
      {props.data!.order}
    </Link>
  );
}
