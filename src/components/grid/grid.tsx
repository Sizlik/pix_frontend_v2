import { AgGridReact, AgGridReactProps } from "ag-grid-react"; // AG Grid Component
import {
  ColDef,
  GetRowIdParams,
  CellValueChangedEvent,
} from "ag-grid-community";

interface gridProps<T> {
  colDefs: ColDef<T>[];
  rowData: T[];
  className?: string;
  quickFilterText?: string;
  getRowId?: (params: GetRowIdParams<T, string>) => string;
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
}

export default function Grid<T>({
  className,
  colDefs,
  rowData,
  quickFilterText,
  getRowId,
  onCellValueChanged,
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
      />
    </div>
  );
}
