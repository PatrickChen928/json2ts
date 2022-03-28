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

declare const ROOT_TYPE = "Root";
declare const STRING_TYPE = "string";
declare const NUMBER_TYPE = "number";
declare const NULL_TYPE = "null";
declare const BOOLEAN_TYPE = "boolean";
declare const UNDEFINED_TYPE = "undefined";
declare const OBJECT_TYPE = "Object";
declare const ARRAY_TYPE = "Array";
declare const ROOT_KEY = "root";
declare const ARRAY_ITEM = "$ARRAY_ITEM$";
declare const COMMENT_KEY = "$COMMENT_KEY$";
declare const LAST_COMMENT = "$LAST_COMMENT$";
declare const NEXT_COMMENT = "$NEXT_COMMENT$";

declare function json2ts(code: string, options?: CompileOptions): string;

export { ARRAY_ITEM, ARRAY_TYPE, BOOLEAN_TYPE, COMMENT_KEY, LAST_COMMENT, NEXT_COMMENT, NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ROOT_KEY, ROOT_TYPE, STRING_TYPE, UNDEFINED_TYPE, json2ts as default, json2ts, parse, traverser };
