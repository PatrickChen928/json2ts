export type CompileOptions = {
  spiltType?: boolean;
  parseArray?: boolean;
  required?: boolean;
  semicolon?: boolean;
}

export type Position = {
  offset: number // from start of file
  line: number
  column: number
}

export type ParserContext = {
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
  value: string | AstChildNode[]
  type: string;
  loc?: LocType;
  typeValue?: Record<string, string | Object> | Array<string | Object>;
}

export type Visiter = {
  [key: string]: {
    entry?: (node: AstChildNode, parent: AstChildNode | null) => void;
    exit?: (node: AstChildNode, parent: AstChildNode | null) => void;
  }
}