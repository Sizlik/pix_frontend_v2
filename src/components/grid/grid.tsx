import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

interface gridProps<T> {
  colDefs: ColDef<T>[];
  rowData: T[];
  className?: string;
}

export default function Grid<T>({ className, colDefs, rowData }: gridProps<T>) {
  return (
    <div className={`${className} ag-theme-quartz`}>
      <AgGridReact
        autoSizeStrategy={{ type: "fitGridWidth" }}
        suppressMovableColumns={true}
        className="w-full h-full"
        columnDefs={colDefs}
        rowData={rowData}
      />
    </div>
  );
}
