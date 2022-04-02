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

/**
 * parse to ast
 * @param input
 * @param options
 * @returns ast
 */
declare function parse(input: string, options?: CompileOptions): AstChildNode;

export { parse };
