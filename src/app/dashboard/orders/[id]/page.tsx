"use client";
import Grid from "@/components/grid/grid";
import {
  PixInput,
  PixSearch,
  PixTextArea,
} from "@/components/inputs/pixInputs";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ColDef,
  GetRowIdParams,
  CellValueChangedEvent,
} from "ag-grid-community";
import { Search, Square } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import PixButton from "@/components/button/button";
import { AgGridReactProps, CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";
import TabButton from "@/components/button/tabButton";
import {
  AcceptOrderEndpoint,
  CancelOrderEndpoint,
  ExportEndpoint,
  GetActions,
  GetOrder,
  PutPositionCountEndpoint,
  RemovePositionEndpoint,
} from "@/routes/routes";
import { useRouter } from "next/navigation";

interface OrderGrid {
  id?: number;
  position_id: string;
  position?: string;
  count?: number;
  comment?: string;
  delivered?: number;
  price?: number;
  sum?: number;
  deleteCell?: null;
}

interface Document {
  document_id?: string;
  document_name?: string;
  document_type?: string;
}

interface ActionsGrid extends Document {
  new_state: string;
  date: string;
}

interface DocumtnsGrid extends Document {
  download?: null;
}

export default function MyOrder({ params }: { params: { id: string } }) {
  const [search, setSearch] = useState<string>("");
  const [searchDocument, setSearchDocument] = useState<string>("");
  const [searchActions, setSearchActions] = useState<string>("");
  const [name, setName] = useState<string>("00000");
  const [state, setState] = useState<string>("Новый");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [colDefs, setColDefs] = useState<ColDef<OrderGrid>[]>([]);
  const router = useRouter();

  const [rowData, setRowData] = useState<OrderGrid[]>([]);

  const [actionColDefs, setActionColDefs] = useState<ColDef<ActionsGrid>[]>([
    {
      field: "new_state",
      resizable: false,
      minWidth: 200,
      headerName: "Новый статус",
      width: 200,
    },
    {
      field: "date",
      resizable: false,
      minWidth: 120,
      width: 120,
      headerName: "Дата",
    },
  ]);

  const [actionRowData, setActionRowData] = useState<ActionsGrid[]>([]);

  const [documentColDefs, setDocumentColDefs] = useState<
    ColDef<DocumtnsGrid>[]
  >([
    {
      field: "document_name",
      resizable: false,
      minWidth: 200,
      headerName: "Документ",
    },
    {
      field: "download",
      resizable: false,
      headerName: "Скачать",
      cellRenderer: DownloadDocumentCellRenderer,
    },
  ]);

  const [documentRowData, setDocumentRowData] = useState<DocumtnsGrid[]>([])

  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onChangeSearchDocument = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchDocument(event.target.value);
  };

  const onChangeSearchActions = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchActions(event.target.value);
  };

  const handleEditCount = (event: CellValueChangedEvent<OrderGrid>) => {
    console.log(event);
    PutPositionCountEndpoint({
      count: event.newValue,
      order_id: params.id,
      position_id: event.data.position_id,
    }).then(() => {
      event.node.setData({
        ...event.data,
        sum: event.newValue * event.data.price!,
      });
    });
  };

  const getRowId = (params: GetRowIdParams<OrderGrid>) =>
    params.data.position_id;

  useEffect(() => {
    GetOrder(params.id).then((response) => {
      setRowData(
        response.data.positions.rows.map((item, index) => {
          return {
            id: index + 1,
            position_id: item.id,
            position: item.assortment.name,
            count: item.quantity,
            comment: item.assortment.description,
            delivered: item.shipped,
            price: item.price / 100,
            sum: (item.price / 100) * item.quantity,
          };
        })
      );
      const documentRowData = [{
        document_id: params.id,
        document_type: 'order',
        document_name: 'Документ "Заказ"',
      }]
      if (response.data.invoicesOut?.length) {
        const invoiceLength = response.data.invoicesOut[0].meta.href.split("/").length
        documentRowData.push({
          document_id: response.data.invoicesOut[0].meta.href.split("/")[invoiceLength - 1],
          document_type: 'invoiceout',
          document_name: 'Документ "Счёт"',
        })
      }
      setDocumentRowData(documentRowData)
      setName(response.data.name);
      setState(response.data.state.name);
    });
    GetActions(params.id).then((response) => {
      setActionRowData(response.data.map((item) => {
        return { ...item }
      }))
    })
  }, [params.id]);

  const handleAcceptOrder = () => {
    AcceptOrderEndpoint(params.id).then((response) => {
      router.replace("/dashboard/orders");
    });
  };

  const handleCancelOrder = () => {
    CancelOrderEndpoint(params.id).then((response) => {
      router.replace("/dashboard/orders");
    });
  };

  useEffect(() => {
    if (state == "Ожидает подтверждения клиента") {
      setColDefs([
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
          cellRenderer: positionCell,
        },
        {
          field: "count",
          resizable: false,
          minWidth: 110,
          width: 110,
          headerName: "Количество",
          editable: state == "Ожидает подтверждения клиента",
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
          field: "deleteCell",
          resizable: false,
          minWidth: 120,
          width: 120,
          headerName: "Удалить",
          cellRenderer: (props: CustomCellRendererProps) => (
            <CancelPositionCellRenderer props={props} order_id={params.id} />
          ),
        },
      ]);
    } else {
      setColDefs([
        {
          field: "id",
          resizable: false,
          minWidth: 50,
          headerName: "№",
          width: 50,
        },
        {
          field: "position",
          resizable: true,
          minWidth: 250,
          headerName: "Позиция",
          cellRenderer: positionCell,
        },
        {
          field: "count",
          resizable: false,
          minWidth: 110,
          width: 110,
          headerName: "Количество",
          editable: state == "Ожидает подтверждения клиента",
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
      ]);
    }
  }, [state, params.id]);
  if (isFullScreen)
    return (
      <div className="lg:w-screen lg:h-screen flex flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:p-4">
        <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2 h-full">
          <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
            <PixSearch
              onChange={onChangeSearch}
              icon={<Search />}
              inputClassName="w-[300px]"
              className=""
              placeholder="Поиск по заказу"
            />
            <button
              onClick={() => setIsFullScreen(false)}
              className="hover:underline cursor-pointer"
            >
              Свернуть
            </button>
            {state == "Ожидает подтверждения клиента" ? (
              <div className="flex gap-2">
                <PixButton
                  value="Отказаться"
                  onClick={handleCancelOrder}
                  variant="cancel"
                />
                <PixButton
                  value="Подтвердить заказ"
                  onClick={handleAcceptOrder}
                />
              </div>
            ) : (
              <h1 className="font-bold text-2xl">Заказ #{name}</h1>
            )}
          </div>
          {state == "Ожидает подтверждения клиента" ? (
            <Grid
              colDefs={colDefs}
              quickFilterText={search}
              rowData={rowData}
              getRowId={getRowId}
              onCellValueChanged={handleEditCount}
              className="w-full lg:h-full h-[260px]"
            />
          ) : (
            <Grid
              colDefs={colDefs}
              quickFilterText={search}
              rowData={rowData}
              getRowId={getRowId}
              onCellValueChanged={handleEditCount}
              className="w-full lg:h-full h-[260px]"
            />
          )}
        </div>
      </div>
    );
  return (
    <div className="lg:w-screen lg:h-screen lg:grid lg:grid-cols-2 lg:grid-rows-2 flex flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:p-4">
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            onChange={onChangeSearch}
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по заказу"
          />
          <button
            onClick={() => setIsFullScreen(true)}
            className="hover:underline cursor-pointer"
          >
            Развернуть
          </button>
          {state == "Ожидает подтверждения клиента" ? (
            <div className="flex gap-2">
              <PixButton
                value="Отказаться"
                onClick={handleCancelOrder}
                variant="cancel"
              />
              <PixButton
                value="Подтвердить заказ"
                onClick={handleAcceptOrder}
              />
            </div>
          ) : (
            <h1 className="font-bold text-2xl">Заказ #{name}</h1>
          )}
        </div>
        {state == "Ожидает подтверждения клиента" ? (
          <Grid
            colDefs={colDefs}
            quickFilterText={search}
            rowData={rowData}
            getRowId={getRowId}
            onCellValueChanged={handleEditCount}
            className="w-full lg:h-full h-[260px]"
          />
        ) : (
          <Grid
            colDefs={colDefs}
            quickFilterText={search}
            rowData={rowData}
            getRowId={getRowId}
            onCellValueChanged={handleEditCount}
            className="w-full lg:h-full h-[260px]"
          />
        )}
      </div>
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            onChange={onChangeSearchActions}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по действиям"
          />
          <h1 className="font-bold text-2xl">Действия</h1>
        </div>
        <Grid
          colDefs={actionColDefs}
          rowData={actionRowData}
          quickFilterText={searchActions}
          className="w-full lg:h-full h-[260px]"
        />
      </div>

      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            onChange={onChangeSearchDocument}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по документм"
          />
          <h1 className="font-bold text-2xl">Документы</h1>
        </div>
        <Grid
          colDefs={documentColDefs}
          rowData={documentRowData}
          quickFilterText={searchDocument}
          className="w-full lg:h-full h-[260px]"
        />
      </div>
      <div className="bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <p className="text-center">Чат появится в следующем обновлении</p>
        <div className="flex lg:flex-row flex-col-reverse justify-end items-center lg:gap-0 gap-2 blur-sm">
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
  const handleDownload = () => {
    ExportEndpoint(props.data!.document_id!, props.data!.document_type!).then((response) => {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const pdfWindow = window.open();
      pdfWindow!.location.href = fileURL;
    })
  }
  return (
    <Link className="text-[#2E90FA] hover:underline transition-all" href="#" onClick={handleDownload}>
      Скачать
    </Link>
  );
}

function CancelPositionCellRenderer({
  props,
  order_id,
}: {
  props: CustomCellRendererProps<OrderGrid>;
  order_id: string;
}) {
  const handleClick = () => {
    RemovePositionEndpoint({
      order_id: order_id,
      position_id: props.data!.position_id,
    }).then((response) => {
      props.api.applyTransaction({
        remove: [{ position_id: props.data!.position_id }],
      });
    });
  };
  return (
    <button
      onClick={handleClick}
      className="text-red-400 hover:font-bold cursor-pointer transition-all"
    >
      Удалить
    </button>
  );
}

function positionCell({ data }: CustomCellRendererProps<OrderGrid>) {
  const linkRegex =
    /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; // Регулярное выражение для поиска ссылок в тексте
  const textBlocks = data!.position!.split(" ");
  const text = textBlocks.map((text, index) => {
    const link = text.match(linkRegex) && text.match(linkRegex)![0];
    if (link) {
      return (
        <a key={index} href={link} className="text-blue-400 hover:underline">
          {link}{" "}
        </a>
      );
    } else {
      return <span key={index}>{text} </span>;
    }
  });
  return <div>{text}</div>;
}
