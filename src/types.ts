export interface Position {
  offset: number // from start of file
  line: number
  column: number
}

export interface ParserContext {
  options: Record<string, unknown>
  readonly originalSource: string
  source: string
  offset: number
  line: number
  column: number
}

export type LocType = {
  start: Position;
  end: Position;
  source: string;
}

export type AstChildNode = {
  key: string;
  value: string | AstChildNode
  type: string;
  loc: LocType;
}

export type Ast = {
  type: string;
  children: AstChildNode[];
  typeList?: Array<string | Object>;
}