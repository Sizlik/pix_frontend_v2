import { AgGridReact, AgGridReactProps } from "ag-grid-react"; // AG Grid Component
import {
  ColDef,
  GetRowIdParams,
  CellValueChangedEvent,
} from "ag-grid-community";
import {LegacyRef, Ref} from "react";

const localeText = {
  // Общие
  noRowsToShow: 'Нет данных для отображения',

  // Фильтры
  equals: 'Равно',
  notEqual: 'Не равно',
  lessThan: 'Меньше',
  lessThanOrEqual: 'Меньше или равно',
  greaterThan: 'Больше',
  greaterThanOrEqual: 'Больше или равно',
  contains: 'Содержит',
  notContains: 'Не содержит',
  startsWith: 'Начинается с',
  endsWith: 'Заканчивается на',
  filterOoo: 'Фильтр...',
  applyFilter: 'Применить',
  resetFilter: 'Сбросить',
  clearFilter: 'Очистить',

  // Панель фильтров
  filterTitle: 'Фильтр',
  columns: 'Колонки',
  filters: 'Фильтры',
};

interface gridProps<T> {
  colDefs: ColDef<T>[];
  rowData: T[];
  className?: string;
  quickFilterText?: string;
  getRowId?: (params: GetRowIdParams<T, string>) => string;
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  ref?: LegacyRef<AgGridReact<T>>;
}

export default function Grid<T>({
  className,
  colDefs,
  rowData,
  quickFilterText,
  getRowId,
  onCellValueChanged, ref,
}: gridProps<T>) {
  return (
    <div className={`${className} ag-theme-quartz`}>
      <AgGridReact
        autoSizeStrategy={{ type: "fitGridWidth" }}
        quickFilterText={quickFilterText}
        getRowId={getRowId}
        suppressMovableColumns={true}
        className="w-full h-full"
        columnDefs={colDefs}
        onCellValueChanged={onCellValueChanged}
        rowData={rowData}
        localeText={localeText}
        ref={ref}
      />
    </div>
  );
}
