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
import TabButton from "@/components/button/tabButton";
import { GetOrders } from "@/routes/routes";

interface OrdersGrid {
  id: string;
  name: string;
  state: string;
  count: number;
  created_at: string;
  updated_at: string;
  sum: number;
  payed_sum: number;
  delivered_sum: number;
}

export default function Orders() {
  const tabButtons: Array<string> = [
    "Все",
    "В обработке",
    "Ждут подтверждения",
    "Закрыты",
  ];
  const [search, setSearch] = useState<string>("");
  const [tabButton, setTabButton] = useState<string>(tabButtons[0]);
  const [gridColumnState, setGridColumnState] = useState<string>("");
  const ref = useRef<AgGridReact<OrdersGrid>>(null);
  const [colDefs, setColDefs] = useState<ColDef<OrdersGrid>[]>([
    {
      field: "name",
      resizable: false,
      minWidth: 80,
      headerName: "№",
      width: 80,
      cellRenderer: OrderLink,
    },
    {
      field: "state",
      resizable: false,
      minWidth: 250,
      headerName: "Статус",
      filter: true,
      filterParams: {
        readOnly: true,
        maxNumConditions: 20,
      },
    },
    {
      field: "count",
      resizable: false,
      minWidth: 110,
      width: 110,
      headerName: "Количество",
    },
    {
      field: "sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Сумма",
    },
    {
      field: "payed_sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Оплачено",
    },
    {
      field: "delivered_sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Отправлено",
    },
    {
      field: "created_at",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Создан",
    },
    {
      field: "updated_at",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Обновлён",
    },
  ]);

  const [rowData, setRowData] = useState<OrdersGrid[]>([]);

  useEffect(() => {
    GetOrders().then((response) => {
      console.log(response.data);
      setRowData(
        response.data.map((item) => {
          return {
            id: item.id,
            count: item.positions.meta.size,
            created_at: item.created.split(" ")[0],
            updated_at: item.updated.split(" ")[0],
            delivered_sum: item.shippedSum / 100,
            name: item.name,
            payed_sum: item.payedSum / 100,
            state: item.state.name,
            sum: item.sum / 100,
          };
        })
      );
    });
  }, []);

  const onClickTabButton = (title: string) => {
    switch (title) {
      case "Все":
        ref.current!.api.setColumnFilterModel("state", null).then(() => {
          ref.current!.api.onFilterChanged();
        });
        break;
      case "В обработке":
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Новый",
              },
              {
                type: "equals",
                filter: "Собран",
              },
              {
                type: "equals",
                filter: "Отгружен",
              },
              {
                type: "equals",
                filter: "Подтвержден",
              },
              {
                type: "equals",
                filter: "Подтвержден клиентом",
              },
              {
                type: "equals",
                filter: "Подтвержден менеджером",
              },
              {
                type: "equals",
                filter: "Заказ доставляется",
              },
              {
                type: "equals",
                filter: "Выдан частично",
              },
              {
                type: "equals",
                filter: "Ожидание документов от продавца",
              },
              {
                type: "equals",
                filter: "Готов к выдаче",
              },
              {
                type: "equals",
                filter: "Обмен",
              },
              {
                type: "equals",
                filter: "Доставляется в РБ",
              },
              {
                type: "equals",
                filter: "В ожидании перевозчика",
              },
              {
                type: "equals",
                filter: "Заказ принят",
              },
              {
                type: "equals",
                filter: "Ожидание предоплаты",
              },
              {
                type: "equals",
                filter: "Принят к исполнению",
              },
              {
                type: "equals",
                filter: "Выслан продавцу",
              },
              {
                type: "equals",
                filter: "Возврат",
              },
              {
                type: "equals",
                filter: "Ожидание денег",
              },
              {
                type: "equals",
                filter: "Возвращен продавцу",
              },
            ],
            operator: "OR",
          })
          .then(() => {
            ref.current!.api.onFilterChanged();
          });
        break;
      case "Ждут подтверждения":
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Ожидает подтверждения клиента",
              },
            ],
            operator: "OR",
          })
          .then(() => {
            ref.current!.api.onFilterChanged();
          });
        break;
      case "Закрыты":
        ref.current!.api.setColumnFilterModel("state", {
          values: ["Возврат", "Доставлен", "Отменен"],
        });
        ref
          .current!.api.setColumnFilterModel("state", {
            filterType: "text",
            conditions: [
              {
                type: "equals",
                filter: "Возврат",
              },
              {
                type: "equals",
                filter: "Доставлен",
              },
              {
                type: "equals",
                filter: "Отменен",
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
          <TabButton
            className="lg:text-base text-xs"
            titles={tabButtons}
            state={tabButton}
            setState={setTabButton}
            onClick={onClickTabButton}
          />
          <h1 className="font-bold text-2xl">Мои заказы</h1>
        </div>
        <div className={`w-full lg:h-full h-[260px] ag-theme-quartz`}>
          <AgGridReact
            ref={ref}
            autoSizeStrategy={{ type: "fitGridWidth" }}
            suppressMovableColumns={true}
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

function OrderLink(props: CustomCellRendererProps<OrdersGrid>) {
  return (
    <Link
      className="text-[#2E90FA] hover:underline transition-all"
      href={`/dashboard/orders/${props.data!.id}`}
    >
      #{props.value}
    </Link>
  );
}
