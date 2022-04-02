export type CompileOptions = {
  splitType?: boolean;
  parseArray?: boolean;
  required?: boolean;
  semicolon?: boolean;
  typePrefix?: string;
  typeSuffix?: string;
  indent?: number;
  comment?: 'inline' | 'block' | false | 'false'
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
}

export type TransformNodeType = AstChildNode & {
  typeValue?: Record<string, string | Object> | Array<string | Object>;
  comments?: Record<string, string[]>;
  i?: number
}

export type Visiter = {
  [key: string]: {
    entry?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
    exit?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
  }
}