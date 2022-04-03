declare type CompileOptions = {
    splitType?: boolean;
    parseArray?: boolean;
    required?: boolean;
    semicolon?: boolean;
    typePrefix?: string;
    typeSuffix?: string;
    indent?: number;
    comment?: 'inline' | 'block' | false | 'false';
};
declare type Position = {
    offset: number;
    line: number;
    column: number;
};
declare type LocType = {
    start: Position;
    end: Position;
    source: string;
};
declare type AstChildNode = {
    key: string;
    value: string | AstChildNode[];
    type: string;
    loc?: LocType;
};
declare type TransformNodeType = AstChildNode & {
    typeValue?: Record<string, string | Object> | Array<string | Object>;
    comments?: Record<string, string[]>;
    i?: number;
    nextComment?: string[];
};
declare type Visiter = {
    [key: string]: {
        entry?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
        exit?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
    };
};

declare function traverser(ast: TransformNodeType, visiter: Visiter): TransformNodeType;
declare function transform(ast: TransformNodeType, options?: CompileOptions): TransformNodeType;

export { transform, traverser };
