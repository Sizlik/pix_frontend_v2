"use client";
import Grid from "@/components/grid/grid";
import {
  PixSearch,
  PixTextArea,
} from "@/components/inputs/pixInputs";
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import {
  ColDef,
  GetRowIdParams,
  CellValueChangedEvent,
} from "ag-grid-community";
import { Search, Square, SymmetryHorizontal } from "react-bootstrap-icons";
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
  GetMessagesOrderEndpoint,
  GetOrder,
  PutPositionCountEndpoint,
  RemovePositionEndpoint,
  getMessagesType,
} from "@/routes/routes";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import OrderOperationsSection from "./OrderOperations";

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

interface PixInputSupportChatFields {
  message: string;
}

export default function MyOrder({ params }: { params: { id: string } }) {
  const [search, setSearch] = useState<string>("");
  const [searchDocument, setSearchDocument] = useState<string>("");
  const [searchActions, setSearchActions] = useState<string>("");
  const [name, setName] = useState<string>("00000");
  const [state, setState] = useState<string>("Новый");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [colDefs, setColDefs] = useState<ColDef<OrderGrid>[]>([]);
  const [messages, setMessages] = useState<getMessagesType[]>();
  const { register } = useForm<PixInputSupportChatFields>();
  const [socket, setSocket] = useState<WebSocket>();

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

  const [documentRowData, setDocumentRowData] = useState<DocumtnsGrid[]>([]);

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

  // Fetch order data and messages
  useEffect(() => {
    console.log("Fetching order data");
    
    // Fetch order details
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
      const documentRowData = [
        {
          document_id: params.id,
          document_type: "order",
          document_name: 'Документ "Заказ"',
        },
      ];
      if (response.data.invoicesOut?.length) {
        const invoiceLength =
          response.data.invoicesOut[0].meta.href.split("/").length;
        documentRowData.push({
          document_id:
            response.data.invoicesOut[0].meta.href.split("/")[
              invoiceLength - 1
            ],
          document_type: "invoiceout",
          document_name: 'Документ "Счёт"',
        });
      }
      setDocumentRowData(documentRowData);
      setName(response.data.name);
      setState(response.data.state.name);
    });
    
    // Fetch actions
    GetActions(params.id).then((response) => {
      setActionRowData(
        response.data.map((item) => {
          return { ...item };
        })
      );
    });
    
    // Fetch messages
    GetMessagesOrderEndpoint(params.id).then((response) => {
      setMessages(response.data);
    });
  }, [params.id]);
  
  // Setup WebSocket in a separate useEffect to avoid infinite loops
  const webSocketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    console.log("Setting up WebSocket");
    
    // Close the previous socket if it exists
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    
    // Create a new WebSocket connection
    const ws = new WebSocket(
      `wss://pixlogistic.com/api_v1/chat/ws?auth=${getCookie("token")!.split(" ")[1]}&room=${params.id}`
    );
    
    // Store the WebSocket in the ref
    webSocketRef.current = ws;
    
    // Set up the message handler
    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => {
        if (prev) return [message, ...prev];
        else return [message];
      });
    };
    
    // Update the socket state (outside the socket message handler)
    setSocket(ws);
    
    // Clean up on unmount
    return () => {
      console.log("Cleaning up WebSocket");
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, [params.id]); // Only depend on params.id, not on socket

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket?.send(
      JSON.stringify({
        message: event.currentTarget.message.value,
        to_chat_room_id: params.id,
      })
    );
    event.currentTarget.message.value = "";
  };

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
      <div className="w-full lg:h-screen flex flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:p-4 overflow-y-auto">
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
          <Grid
            colDefs={colDefs}
            quickFilterText={search}
            rowData={rowData}
            getRowId={getRowId}
            onCellValueChanged={handleEditCount}
            className="w-full lg:h-full h-[260px]"
          />
        </div>
      </div>
    );
  
  return (
    <div className="w-full h-full flex flex-col lg:gap-4 justify-center items-top lg:pt-24 pt-16 lg:p-4 overflow-y-auto">
      {/* Верхняя панель с заголовком заказа */}
      <div className="bg-white lg:rounded-2xl lg:p-4 p-2 shadow-xl">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2 mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(true)}
              className="hover:underline cursor-pointer"
            >
              Развернуть
            </button>
            <PixSearch
              onChange={onChangeSearch}
              icon={<Search/>}
              inputClassName="w-[300px]"
              className=""
              placeholder="Поиск по заказу"
            />
          </div>
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
        
        {/* Документы заказа в правой части */}
        <div className="flex justify-end mb-2">
          <div className="max-w-md">
            <h2 className="font-semibold text-lg mb-1">Документы заказа</h2>
            <div className="bg-gray-50 p-2 rounded">
              {documentRowData.map((doc, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{doc.document_name}</span>
                  <Link
                    prefetch={true}
                    className="text-[#2E90FA] hover:underline transition-all ml-4"
                    href="#"
                    onClick={() => ExportEndpoint(doc.document_id!, doc.document_type!).then(
                      (response) => {
                        const file = new Blob([response.data], { type: "application/pdf" });
                        const fileURL = URL.createObjectURL(file);
                        const pdfWindow = window.open();
                        pdfWindow!.location.href = fileURL;
                      }
                    )}
                  >
                    Скачать
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Позиции заказа на всю ширину */}
        <div className="w-full">
          <h2 className="font-semibold text-lg mb-1">Позиции заказа</h2>
          <Grid
            colDefs={colDefs}
            quickFilterText={search}
            rowData={rowData}
            getRowId={getRowId}
            onCellValueChanged={handleEditCount}
            className="w-full h-[300px]"
          />
        </div>
      </div>

      {/* Комментарии по заказу */}
      <div className="bg-white lg:rounded-2xl lg:p-4 p-2 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-xl">Комментарии по заказу</h2>
        </div>
        <div className="bg-gradient-radial from-[#ACCBEE] to-[#E7F0FD] rounded-xl">
          <div className="h-[calc(300px-100px)] flex flex-col-reverse gap-2 py-2 overflow-y-auto scrollbar">
            {messages?.map((item, index) => (
              <Message
                key={index}
                isSender={item.first_name != "bot"}
                message={item.message}
              />
            ))}
            <Message
              isSender={false}
              message="Здравствуйте! Если у вас возникли какие-либо вопросы, задайте их в этом чате."
            />
          </div>
          <form onSubmit={sendMessage} className="">
            <div className="h-[100px] p-2 relative flex justify-between items-center">
              <PixTextArea
                className="w-full"
                name="message"
                register={register}
                placeholder="Введите сообщение..."
              />
              <button
                type="submit"
                className="text-white bg-[#314255] w-12 h-12 flex justify-center items-center rounded-full absolute right-8 hover:scale-110 transition-all cursor-pointer active:scale-100"
              >
                <SymmetryHorizontal size={24} className="relative left-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Транзакции по заказу */}
      <div className="bg-white lg:rounded-2xl lg:p-4 p-2 shadow-xl">
        <h2 className="font-bold text-xl mb-2">Транзакции по заказу</h2>
        <div className="w-full h-[300px]">
          <OrderOperationsSection orderId={params.id} />
        </div>
      </div>
    </div>
  );
}

function DownloadDocumentCellRenderer(
  props: CustomCellRendererProps<DocumtnsGrid>
) {
  const handleDownload = () => {
    ExportEndpoint(props.data!.document_id!, props.data!.document_type!).then(
      (response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const pdfWindow = window.open();
        pdfWindow!.location.href = fileURL;
      }
    );
  };
  return (
    <Link
      prefetch={true}
      className="text-[#2E90FA] hover:underline transition-all"
      href="#"
      onClick={handleDownload}
    >
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

function Message({
  isSender,
  message,
}: {
  isSender: boolean;
  message: string;
}) {
  return isSender ? (
    <div className="max-w-[80%] bg-white border border-[#314255] px-2 py-2 rounded-xl ms-2 place-self-start text-start">
      {message}
    </div>
  ) : (
    <div className="max-w-[80%] bg-[#314255] px-2 py-2 rounded-xl place-self-end text-white font-light text-end me-2">
      {message}
    </div>
  );
}
