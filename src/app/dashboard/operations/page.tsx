"use client";
import {
  PixSearch,
} from "@/components/inputs/pixInputs";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { ColDef, IRowNode } from "ag-grid-community";
import { Search, Square } from "react-bootstrap-icons";
import {
  AgGridReact,
  CustomCellRendererProps,
} from "ag-grid-react";
import Link from "next/link";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {GetOperations, GetTransactions} from "@/routes/routes";
import TabButton from "@/components/button/tabButton";

type PaymentType = "Пополнение" | "Списание" | "Зарезервировано"; // Added new type

interface PaymentRow {
  id: string;
  name: string;
  moment: string;
  sum: number;
  type: PaymentType;
  order?: string; // ID заказа
  orderStatus?: string;
}

export default function Transactions() {
  const [search, setSearch] = useState<string>("");
  const tabButtons: Array<string> = [
    "Все",
    "Пополнение",
    "Списание",
    "Зарезервировано", // Added new tab
  ];
  const ref = useRef<AgGridReact<PaymentRow>>(null);
  const [tabButton, setTabButton] = useState<string>(tabButtons[0]);
  const [colDefs, setColDefs] = useState<ColDef<PaymentRow>[]>([
    { field: "name", headerName: "№ Платежа", minWidth: 100 },
    { field: "moment", headerName: "Дата", minWidth: 120 },
    { field: "type", headerName: "Тип", minWidth: 100,
      filter: true,
      filterParams: {
        readOnly: true,
        maxNumConditions: 20,
      },
    },
    { field: "sum", headerName: "Сумма", minWidth: 120 },
    {
      field: "order",
      headerName: "Заказ",
      minWidth: 180,
      cellRenderer: OrderLink,
    },
    { field: "orderStatus", headerName: "Статус заказа", minWidth: 150 },
  ]);
  const [rowData, setRowData] = useState<PaymentRow[]>([]);

  const onClickTabButton = (title: string) => {
    switch (title) {
      case "Все":
        ref.current!.api.setColumnFilterModel("type", null).then(() => {
          ref.current!.api.onFilterChanged();
        });
        break;
      case "Пополнение":
        ref.current!.api.setColumnFilterModel("type", {
          filterType: "text",
          conditions: [
            {
              type: "equals",
              filter: "Пополнение",
            }
          ],
          operator: "OR",
        })
            .then(() => {
              ref.current!.api.onFilterChanged();
            });
        break;
      case "Списание":
        ref.current!.api.setColumnFilterModel("type", {
          filterType: "text",
          conditions: [
            {
              type: "equals",
              filter: "Списание",
            },
          ],
          operator: "OR",
        })
            .then(() => {
              ref.current!.api.onFilterChanged();
            });
        break;
      case "Зарезервировано": // Added new case
        ref.current!.api.setColumnFilterModel("type", {
          filterType: "text",
          conditions: [
            {
              type: "equals",
              filter: "Зарезервировано",
            },
          ],
          operator: "OR",
        })
            .then(() => {
              ref.current!.api.onFilterChanged();
            });
        break;
    }
  };

  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    GetOperations().then((response) => {
      setRowData(
          response.data.rows.map((item: any) => ({
            id: item.id,
            name: item.name,
            moment: item.moment.split(" ")[0],
            sum: item.sum / 100,
            type: item.meta.type === "paymentin"
                ? "Пополнение"
                : item.meta.type === "customerorder"
                    ? "Зарезервировано"
                    : "Списание",
            order: item.meta.type === "paymentin"
                ? null
                : item?.meta?.href?.split("/").pop(),
            orderStatus: item?.state?.name,
          })))
    });
  }, []);

  return (
      <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
        <div
            className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
          <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
            <PixSearch
                icon={<Search/>}
                inputClassName="w-[300px]"
                className=""
                placeholder="Поиск по операциям"
                onChange={onChangeSearch}
            />
            <TabButton
                className="lg:text-base text-xs"
                titles={tabButtons}
                state={tabButton}
                setState={setTabButton}
                onClick={onClickTabButton}
            />
            <h1 className="font-bold text-2xl">Мои операции</h1>
          </div>
          <div className={`w-full lg:h-full h-[260px] ag-theme-quartz`}>
            <AgGridReact
                ref={ref}
                suppressMovableColumns={true}
                autoSizeStrategy={{type: "fitGridWidth"}}
                className="w-full h-full"
                columnDefs={colDefs}
                rowData={rowData}
                quickFilterText={search}
            />
          </div>
        </div>
      </div>
  );
}

function OrderLink(props: CustomCellRendererProps<PaymentRow>) {
  if (!props.data!.order) return;
  return (
      <Link
          prefetch={true}
          className="text-[#2E90FA] hover:underline transition-all"
          href={`/dashboard/orders/${props.data!.order}`}
      >
        #{props.data!.name}
      </Link>
  );
}