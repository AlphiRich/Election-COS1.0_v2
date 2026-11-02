/**
 * @startingPoint section="Data" subtitle="Dense War Room table with Ink header rule" viewport="700x300"
 */
export interface TableColumn {
  key: string;
  label: React.ReactNode;
  numeric?: boolean;
  width?: number | string;
  render?: (row: any) => React.ReactNode;
}
export interface TableProps {
  columns: TableColumn[];
  rows: any[];
  dense?: boolean;
  rowKey?: string;
  onRowClick?: (row: any) => void;
}