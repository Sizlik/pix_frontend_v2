"use client";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic

import { useEffect, useRef, useState } from "react";
import { ArrowBarLeft } from "react-bootstrap-icons";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreateOrder } from "@/routes/routes";

const BACKEND_URL = "https://pixlogistic.com/api_v1";

export default function FileOrderGrid({setOpenned}) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const ref = useRef();
  const rowData = data.map((value) => {
    const row = {};
    value.forEach((item, index) => {
      row[index.toString()] = item;
    });
    return row;
  });

  const [options, setOptions] = useState({
    position: false,
    count: false,
    comment: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const getColDefs = (data) => {
    const colDefs = data[0].map((_, index) => {
      return {
        field: index.toString(),
        headerComponent: (api) =>
          MyComponent(api, options, setOptions, reloadColDefs),
        suppressMovable: true,
        resizable: false,
      };
    });
    return colDefs;
  };
  const colDefs = data.length ? getColDefs(data) : [];

  const reloadColDefs = (colDefs) => {
    colDefs.forEach((colDef) => {
      colDef.headerComponent = (api) =>
        MyComponent(api, options, setOptions, reloadColDefs);
    });
    ref.current.api.setGridOption("columnDefs", colDefs);
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setFile(file);
    setLoader(true);
    const promise = axios.post(
      `${BACKEND_URL}/orders/file`,
      { file: file, first_line_header: true },
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );
    toast
      .promise(promise, {
        loading: "Загрузка файла...",
        success: "Успешно!",
        error: "Ошибка!",
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {
        setFile(null);
      });
    setLoader(false);
  };

  const handleFileDelete = () => {
    setFile(null);
    setData([]);
    setOptions({
      position: false,
      count: false,
      comment: false,
    });
  };

  const handleSubmitOrder = (event) => {
    event.preventDefault();
    if (!file) {
      toast.error("Вы не загрузили файл!");
      return;
    }
    const columnDefs = ref.current.api.getColumnDefs();

    const positions_column = columnDefs.find(
      (value) => value.option == "position"
    );
    const counts_column = columnDefs.find((value) => value.option == "count");
    if (!positions_column || !counts_column) {
      toast.error(
        "Вы не выбрали обязательные поля! Позиция или Количество отсутствует"
      );
      return;
    }

    const positions = positions_column.colId;
    const counts = counts_column.colId;
    const comments = columnDefs.find((value) => value.option == "comment");

    const orders = ref.current.props.rowData.map((value) => {
      return {
        link: value[positions].toString(),
        count: value[counts],
        comment: comments ? value[comments.colId].toString() : "",
      };
    });

    setLoader(true);
    CreateOrder(orders).then((reponse) => {
        setLoader(false);

        router.replace("/dashboard/orders");
        localStorage.setItem(
          "section",
          JSON.stringify({
            section: "Для клиента",
            title: "Мои заказы",
          })
        );
      })
      .catch(() => {
        setLoader(false);

        setOptions({ position: false, count: false, comment: false });
      });
  };

  useEffect(() => {}, [data]);
  return (
    <div className="flex flex-col">
      <div className="flex mt-2 lg:flex-row flex-col items-center lg:h-20 lg:gap-12 h-full gap-2 lg:mb-0 mb-4">
        <button
          className="ml-20 text-lg flex flex-row gap-2 items-center transition-all text-gray-600 no-underline hover:text-emerald-400 cursor-pointer"
          onClick={() => setOpenned(false)}
        >
          <ArrowBarLeft /> Вернуться назад
        </button>
        <div>
          {!file ? (
            <label>
              <input
                disabled={loader}
                className="hidden cursor-pointer"
                type="file"
                onChange={handleFile}
              />
              <div className="text-sm px-5 py-2 text-gray-900 cursor-pointer hover:text-white border-1 transition-all mr-2 border-emerald-800 hover:bg-emerald-900 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-center">
                Прикрепить файл
              </div>
            </label>
          ) : (
            <div
              onClick={handleFileDelete}
              className="text-sm px-5 py-2.5 text-gray-900 cursor-pointer hover:text-white border-1 transition-all mr-2 border-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center"
            >
              {file.name.length > 15
                ? `${file.name.substr(0, 5)}...${file.name.substr(-7)}`
                : file.name}
            </div>
          )}
        </div>
        <input
          disabled={loader}
          type="button"
          onClick={handleSubmitOrder}
          className="focus:outline-none text-white bg-emerald-500 transition-all hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5"
          value="Создать заказ"
        />
      </div>
      <div className="ms-3 mb-4">
        Первая строка таблицы удаляется автоматически, размещайте все позиции
        заказа со второй строки!
      </div>
      <div>
        <div className="ag-theme-quartz h-screen">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            ref={ref}
            autoSizeStrategy={{
              type: "fitCellContents",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MyComponent(api, options, setOptions, reloadColDefs) {
  const onChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue == "position") {
      api.api.moveColumn(api.column.colId, 0);
      api.column.colDef.option = "position";
    } else if (selectedValue == "count") {
      api.api.moveColumn(api.column.colId, 1);
      api.column.colDef.option = "count";
    } else if (selectedValue == "comment") {
      api.api.moveColumn(api.column.colId, 2);
      api.column.colDef.option = "comment";
    } else {
      setOptions((prev) => {
        prev[api.column.colDef.option] = false;
        return prev;
      });
      api.api.moveColumn(api.column.colId, -1);
      api.column.colDef.option = null;
    }

    if (selectedValue != "none") {
      setOptions((prev) => {
        prev[api.column.colDef.option] = true;
        return prev;
      });
    }

    const columnState = JSON.stringify(api.api.getColumnState());
    localStorage.setItem("grid", columnState);
    reloadColDefs(api.api.getColumnDefs());
  };

  return (
    <select
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      value={api.column.colDef.option || "none"}
    >
      <option value="none">Выберите тип столбца</option>
      {(!options.position || api.column.colDef.option == "position") && (
        <option value="position">Позиция</option>
      )}
      {(!options.count || api.column.colDef.option == "count") && (
        <option value="count">Количество</option>
      )}
      {(!options.comment || api.column.colDef.option == "comment") && (
        <option value="comment">Коментарий</option>
      )}
    </select>
  );
}
