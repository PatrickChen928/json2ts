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
  value: string | AstChildNode[]
  type: string;
  loc?: LocType;
  typeValue?: Object;
  vars?: Object;
}

export type Visiter = {
  [key: string]: {
    entry?: (node: AstChildNode, parent: AstChildNode | null) => void;
    exit?: (node: AstChildNode, parent: AstChildNode | null) => void;
  }
}