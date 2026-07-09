declare module "xlsx-populate" {
  interface Color {
    rgb: string;
  }

  interface PatternFill {
    type: "pattern";
    pattern: string;
    foreground?: Color;
    background?: Color;
  }

  interface GradientFill {
    type: "gradient";
    stops: { position: number; color: Color }[];
  }

  interface CellStyle {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontSize?: number;
    fontColor?: string;
    fontFamily?: string;
    fill?: PatternFill | GradientFill;
    horizontalAlignment?: string;
    verticalAlignment?: string;
    wrapText?: boolean;
    numberFormat?: string;
  }

  interface Cell {
    value(): unknown;
    value(value: unknown): Cell;
    style(): CellStyle;
    style(style: CellStyle | string, value?: unknown): Cell;
  }

  interface Range {
    value(): unknown[][];
    value(
      value:
        unknown | ((cell: Cell, rowIdx: number, colIdx: number) => unknown),
    ): Range;
    merged(): boolean;
    merged(merged: boolean): Range;
    style(): CellStyle;
    style(style: CellStyle | string, value?: unknown): Range;
    forEach(
      callback: (
        cell: Cell,
        rowIdx: number,
        colIdx: number,
        range: Range,
      ) => void,
    ): Range;
    map<T>(
      callback: (cell: Cell, rowIdx: number, colIdx: number, range: Range) => T,
    ): T[][];
  }

  interface Row {
    height(): number | undefined;
    height(height: number): Row;
    style(): CellStyle;
    style(style: CellStyle | string, value?: unknown): Row;
  }

  interface Column {
    width(): number | undefined;
    width(width: number): Column;
  }

  interface Sheet {
    name(): string;
    name(name: string): Sheet;
    cell(address: string): Cell;
    range(address: string): Range;
    row(rowNumber: number): Row;
    column(colNumber: number): Column;
    usedRange(): Range | undefined;
  }

  interface Workbook {
    sheet(nameOrIndex: string | number): Sheet;
    addSheet(name: string): Sheet;
    outputAsync(type?: string): Promise<Buffer>;
    outputAsync(opts?: { type?: string; password?: string }): Promise<Buffer>;
  }

  interface XlsxPopulateStatic {
    fromBlankAsync(): Promise<Workbook>;
    fromFileAsync(filePath: string): Promise<Workbook>;
    fromDataAsync(
      data: Buffer | ArrayBuffer | Blob | string,
    ): Promise<Workbook>;
  }

  const XlsxPopulate: XlsxPopulateStatic;
  export = XlsxPopulate;
}
