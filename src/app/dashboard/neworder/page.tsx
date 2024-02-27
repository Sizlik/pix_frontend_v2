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
import { CustomCellRendererProps } from "ag-grid-react";
import { CreateOrder } from "@/routes/routes";

type AddPositionInputs = {
  position: string;
  count: number;
  comment: string;
};

interface CartGrid {
  index: number;
  position: string;
  count: number;
  comment: string;
  delete: null;
}

interface CartData {
  position: string;
  count: number;
  comment: string;
}

export default function NewOrder() {
  const { register, handleSubmit } = useForm<AddPositionInputs>();

  const [data, setData] = useState<CartData[] | []>([]);
  // const [data, setData] = useState<CartData[] | []>([
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 2, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 3, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "21313er" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "12345235", count: 5, comment: "test" },
  //   { position: "sdvcfsdv", count: 1, comment: "sadsdaswd" },
  //   { position: "Iphone SE", count: 7, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 7, comment: "4324234dsfc" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  //   { position: "Iphone SE", count: 1, comment: "test" },
  // ]);
  const [colDefs, setColDefs] = useState<ColDef<CartGrid>[]>([
    {
      field: "index",
      resizable: false,
      minWidth: 50,
      headerName: "№",
      width: 50,
    },
    {
      field: "position",
      resizable: false,
      minWidth: 200,
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
      headerName: "Комментарий",
    },
    {
      field: "delete",
      resizable: false,
      minWidth: 90,
      width: 90,
      headerName: "Удалить",
      cellRenderer: (props: CustomCellRendererProps) => (
        <DeleteCell cellProps={props} deleteItem={deleteItem} />
      ),
    },
  ]);

  const [rowData, setRowData] = useState<CartGrid[]>(
    data.map((item, index) => {
      return {
        index: index + 1,
        position: item.position,
        count: item.count,
        comment: item.comment,
        delete: null,
      };
    })
  );

  const onSubmit = (data: AddPositionInputs) => {
    setData((oldItems) => {
      return [...oldItems, { ...data }];
    });
  };

  const deleteItem = (index: number) => {
    setData((oldItems) => {
      const newData = [
        ...oldItems.slice(0, index),
        ...oldItems.slice(index + 1),
      ];
      if (!newData.length) localStorage.removeItem("cart");
      return newData;
    });
  };

  useEffect(() => {
    console.log("here2", data);

    const localStorageCart = localStorage.getItem("cart");
    const cart: CartData[] = localStorageCart
      ? JSON.parse(localStorageCart)
      : [];

    console.log("here3", cart);
    setData(cart);
  }, []);

  useEffect(() => {
    console.log("here", data);
    if (data.length) localStorage.setItem("cart", JSON.stringify(data));
    setRowData(
      data.map((item, index) => {
        return {
          index: index + 1,
          position: item.position,
          count: item.count,
          comment: item.comment,
          delete: null,
        };
      })
    );
  }, [data]);

  const clearCart = () => {
    localStorage.removeItem("cart");
    setData([]);
  };

  const submitOrder = () => {
    CreateOrder(
      data.map((item) => {
        return {
          link: item.position,
          count: item.count,
          comment: item.comment || "",
        };
      })
    );
  };

  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 lg:justify-center shadow-xl p-2">
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center lg:gap-0 gap-2">
          <PixSearch
            icon={<Search />}
            inputClassName="w-[300px]"
            className=""
            placeholder="Поиск по корзине"
          />
          <h1 className="font-bold text-2xl">Коризна</h1>
        </div>
        <Grid
          colDefs={colDefs}
          rowData={rowData}
          className="w-full lg:h-full h-[260px]"
        />
        <div className="flex justify-between">
          <PixButton
            value="Очистить"
            variant="cancel"
            onClick={() => clearCart()}
          />
          <PixButton value="Оформить" onClick={submitOrder} />
        </div>
      </div>
      <div className="w-screen h-min bg-white lg:rounded-2xl lg:p-4 flex flex-col gap-2 shadow-xl">
        <div className="flex lg:flex-row flex-col justify-between items-center lg:gap-0 gap-2 mt-4 lg:mt-0">
          <h1 className="font-bold text-2xl">Добавить позицию</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-2"
        >
          <div className="flex lg:flex-row flex-col gap-2 justify-between">
            <PixInput
              name="position"
              register={register}
              label="Товар (Название/Артикул/Ссылка)"
              placeholder="Iphone 12"
              options={{ required: "Введите позицию" }}
            />
            <PixInput
              name="count"
              type="number"
              register={register}
              label="Количество"
              placeholder="1"
              options={{
                min: 1,
                max: 100,
                required: "Количесво должно быть больше 0",
                valueAsNumber: true,
              }}
            />
          </div>
          <PixTextArea
            name="comment"
            register={register}
            placeholder="Комментарий"
          />
          <div className="flex gap-4 justify-end">
            <PixButton value="Добавить" type="submit" />
            <PixButton value="Загрузить файл" />
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteCell({
  deleteItem,
  cellProps,
}: {
  deleteItem: (index: number) => void;
  cellProps: CustomCellRendererProps;
}) {
  return (
    <input
      type="button"
      value="Удалить"
      onClick={() => deleteItem(cellProps.node.rowIndex!)}
      className="text-red-400 hover:font-bold cursor-pointer transition-all"
    />
  );
}
