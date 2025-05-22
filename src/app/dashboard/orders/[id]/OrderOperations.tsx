import {useEffect, useState} from "react";
import {GetOperations} from "@/routes/routes";
import Grid from "@/components/grid/grid";
import {ColDef} from "ag-grid-community";

interface PaymentRow {
  id: string;
  name: string;
  moment: string;
  sum: number;
  type: string;
  order?: string;
  orderStatus?: string;
}

export default function OrderOperations({ orderId }: { orderId: string }) {
  const [rowData, setRowData] = useState<PaymentRow[]>([]);
  const [colDefs] = useState<ColDef<PaymentRow>[]>([
    { field: "moment", headerName: "Дата", minWidth: 120 },
    { field: "name", headerName: "Название", minWidth: 200 },
    { field: "sum", headerName: "Сумма", minWidth: 120, valueFormatter: (params) => `${params.value} ₽` },
    { field: "type", headerName: "Тип", minWidth: 100 },
    { field: "orderStatus", headerName: "Статус", minWidth: 120 },
  ]);

  useEffect(() => {
    GetOperations().then((response) => {
      console.log("Fetched operations:", response.data.rows);
      
      setRowData(
        response.data.rows
          .filter((item: any) => {
            // Для customerorder, demand и других связанных с заказом операций ищем orderId в разных местах
            
            // Проверяем meta.href
            const href = item?.meta?.href;
            if (href && href.split("/").pop() === orderId) {
              return true;
            }
            
            // Проверяем agentAccount?.meta?.href для связанных платежей
            const agentHref = item?.agentAccount?.meta?.href;
            if (agentHref && agentHref.includes(orderId)) {
              return true;
            }
            
            // Проверяем operations.meta.href для связанных документов
            const operations = item?.operations;
            if (operations && Array.isArray(operations)) {
              return operations.some(op => 
                op?.meta?.href && op.meta.href.split("/").pop() === orderId
              );
            }
            
            return false;
          })
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            moment: item.moment?.split(" ")[0] ?? "",
            sum: item.sum ? item.sum / 100 : 0,
            type: item.meta.type === "paymentin"
                ? "Пополнение"
                : item.meta.type === "customerorder"
                    ? "Зарезервировано"
                    : "Списание",
            order: item.meta?.href ? item.meta.href.split("/").pop() : null,
            orderStatus: item?.state?.name,
          }))
      );
    });
  }, [orderId]);

  // Показываем либо данные транзакций, либо сообщение об их отсутствии
  if (!rowData.length) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500">
        Нет транзакций по данному заказу
      </div>
    );
  }
  
  return (
    <Grid 
      colDefs={colDefs} 
      rowData={rowData} 
      className="w-full h-full" 
    />
  );
}
