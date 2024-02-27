"use client";
import Grid from "@/components/grid/grid";
import {
  PixInput,
  PixSearch,
  PixTextArea,
} from "@/components/inputs/pixInputs";
import { useEffect, useState } from "react";
import { ColDef } from "ag-grid-community";
import { Search, Square } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import PixButton from "@/components/button/button";
import { AgGridReactProps, CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";
import TabButton from "@/components/button/tabButton";

interface OrderGrid {
  id: string;
  position: string;
  count: number;
  comment: string;
  created_at: string;
  updated_at: string;
  delivered: number;
  price: number;
  sum: number;
}

interface Document {
  document_id?: string;
  document_name?: string;
  document_type?: string;
}

interface ActionsGrid extends Document {
  action: string;
  date: string;
  comment: string;
  sum: string;
}

interface DocumtnsGrid extends Document {
  date: string;
  download?: null;
}

export default function MyOrder({ params }: { params: { id: string } }) {
  const name = "0001";
  const data: Array<OrderGrid> = [
    {
      id: "1",
      position: "order",
      comment: "Ожидает подтверждения клиента",
      count: 3,
      sum: 300,
      delivered: 1,
      price: 100,
      created_at: "2020-01-01",
      updated_at: "2020-01-01",
    },
    {
      id: "2",
      position: "order",
      comment: "Ожидает подтверждения клиента",
      count: 3,
      sum: 300,
      delivered: 1,
      price: 100,
      created_at: "2020-01-01",
      updated_at: "2020-01-01",
    },
    {
      id: "3",
      position: "order",
      comment: "Ожидает подтверждения клиента",
      count: 3,
      sum: 300,
      delivered: 1,
      price: 100,
      created_at: "2020-01-01",
      updated_at: "2020-01-01",
    },
  ];
  const [colDefs, setColDefs] = useState<ColDef<OrderGrid>[]>([
    {
      field: "id",
      resizable: false,
      minWidth: 50,
      headerName: "№",
      width: 50,
    },
    {
      field: "position",
      resizable: false,
      minWidth: 250,
      headerName: "Позиция",
    },
    {
      field: "count",
      resizable: false,
      minWidth: 110,
      width: 110,
      headerName: "Количество",
    },
    {
      field: "comment",
      resizable: false,
      minWidth: 200,
      width: 200,
      headerName: "Комментарий",
    },
    {
      field: "delivered",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Доставлено",
    },
    {
      field: "price",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Цена за еденицу",
    },
    {
      field: "sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Сумма",
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

  const [rowData, setRowData] = useState<OrderGrid[]>(
    data.map((item, index) => {
      return {
        ...item,
        name: (index + 1).toString(),
      };
    })
  );

  const actionData: Array<ActionsGrid> = [
    {
      action: "Заказ подтвержден",
      comment: "Пользователь подтвердил заказ",
      sum: "-",
      date: "2020-01-01",
      document_id: "",
      document_name: "-",
    },
    {
      action: "Заказ подтвержден",
      comment: "Пользователь подтвердил заказ",
      sum: "-",
      date: "2020-01-01",
      document_id: "",
      document_name: "-",
    },
    {
      action: "Оплата заказа",
      comment: "Пользователь оплатил заказ",
      sum: "100.00$",
      date: "2020-01-01",
      document_id: "",
      document_name: "Транзакция №1",
    },
    {
      action: "Часть заказа доставлена",
      comment: "Часть заказа доставлена",
      sum: "50$",
      date: "2020-01-01",
      document_id: "",
      document_name: "-",
    },
    {
      action: "Заказ подтвержден",
      comment: "Пользователь подтвердил заказ",
      sum: "-",
      date: "2020-01-01",
      document_id: "",
      document_name: "-",
    },
  ];
  const [actionColDefs, setActionColDefs] = useState<ColDef<ActionsGrid>[]>([
    {
      field: "action",
      resizable: false,
      minWidth: 200,
      headerName: "Действие",
      width: 200,
    },
    {
      field: "date",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Дата",
    },
    {
      field: "comment",
      resizable: false,
      minWidth: 250,
      width: 250,
      headerName: "Комментарий",
    },
    {
      field: "sum",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Сумма",
    },
    {
      field: "document_name",
      resizable: false,
      minWidth: 180,
      width: 180,
      headerName: "Документ",
    },
  ]);

  const [actionRowData, setActionRowData] = useState<ActionsGrid[]>(
    actionData.map((item, index) => {
      return {
        ...item,
      };
    })
  );

  const documentData: DocumtnsGrid[] = [
    {
      document_id: "1",
      document_name: "Документ №1",
      date: "2020-01-01",
    },
    {
      document_id: "1",
      document_name: "Документ №2",
      date: "2020-01-01",
    },
    {
      document_id: "1",
      document_name: "Документ №3",
      date: "2020-01-01",
    },
    {
      document_id: "1",
      document_name: "Документ №4",
      date: "2020-01-01",
    },
    {
      document_id: "1",
      document_name: "Документ №5",
      date: "2020-01-01",
    },
  ];
  const [documentColDefs, setDocumentColDefs] = useState<
    ColDef<DocumtnsGrid>[]
  >([
    {
      field: "document_name",
      resizable: false,
      minWidth: 200,
      headerName: "Документ",
      width: 200,
    },
    {
      field: "download",
      resizable: false,
      minWidth: 150,
      width: 150,
      headerName: "Скачать",
      cellRenderer: DownloadDocumentCellRenderer,
    },
    {
      field: "date",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Дата",
    },
  ]);

  const [documentRowData, setDocumentRowData] = useState<DocumtnsGrid[]>(
    documentData.map((item, index) => {
      return {
        ...item,
      };
    })
  );

  return (
    <div className="lg:w-screen lg:h-screen lg:grid lg:grid-cols-2 lg:grid-rows-2 flex flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:p-4">
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по заказу"
          />
          <h1 className="font-bold text-2xl">Заказ #{name}</h1>
        </div>
        <Grid
          colDefs={colDefs}
          rowData={rowData}
          className="w-full lg:h-full h-[260px]"
        />
      </div>
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по действиям"
          />
          <h1 className="font-bold text-2xl">Действия</h1>
        </div>
        <Grid
          colDefs={actionColDefs}
          rowData={actionRowData}
          className="w-full lg:h-full h-[260px]"
        />
      </div>

      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по документм"
          />
          <h1 className="font-bold text-2xl">Документы</h1>
        </div>
        <Grid
          colDefs={documentColDefs}
          rowData={documentRowData}
          className="w-full lg:h-full h-[260px]"
        />
      </div>
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-end items-center lg:gap-0 gap-2">
          <h1 className="font-bold text-2xl">Чат по заказу</h1>
        </div>
        <div className="lg:w-full lg:h-full h-screen w-screen bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}

function DownloadDocumentCellRenderer(
  props: CustomCellRendererProps<DocumtnsGrid>
) {
  return (
    <Link className="text-[#2E90FA] hover:underline transition-all" href="#">
      Скачать
    </Link>
  );
}
