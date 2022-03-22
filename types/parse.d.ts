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

/**
 * parse to ast
 * @param input
 * @param options
 * @returns ast
 */
declare function parse(input: string, options?: CompileOptions): AstChildNode;

export { parse };
