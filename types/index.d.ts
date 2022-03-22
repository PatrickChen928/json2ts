declare type CompileOptions = {
    spiltType?: boolean;
    parseArray?: boolean;
    required?: boolean;
    semicolon?: boolean;
    typePrefix?: string;
    typeSuffix?: string;
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

/**
 * parse to ast
 * @param input
 * @param options
 * @returns ast
 */
declare function parse(input: string, options?: CompileOptions): AstChildNode;

declare function traverser(ast: AstChildNode, visiter: Visiter): AstChildNode;

declare function json2ts(code: string, options?: CompileOptions): string;

export { json2ts as default, json2ts, parse, traverser };
