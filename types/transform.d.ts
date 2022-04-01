declare type CompileOptions = {
    splitType?: boolean;
    parseArray?: boolean;
    required?: boolean;
    semicolon?: boolean;
    typePrefix?: string;
    typeSuffix?: string;
    indent?: number;
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
    typeValue?: Record<string, string | Object> | Array<string | Object>;
};
declare type Visiter = {
    [key: string]: {
        entry?: (node: AstChildNode, parent: AstChildNode | null) => void;
        exit?: (node: AstChildNode, parent: AstChildNode | null) => void;
    };
};

declare function traverser(ast: AstChildNode, visiter: Visiter): AstChildNode;
declare function transform(ast: AstChildNode, options?: CompileOptions): AstChildNode;

export { transform, traverser };
