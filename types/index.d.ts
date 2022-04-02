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
};
declare type Visiter = {
    [key: string]: {
        entry?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
        exit?: (node: TransformNodeType, parent: TransformNodeType | null) => void;
    };
};

/**
 * parse to ast
 * @param input
 * @param options
 * @returns ast
 */
declare function parse(input: string, options?: CompileOptions): AstChildNode;

declare function traverser(ast: TransformNodeType, visiter: Visiter): TransformNodeType;

declare const ROOT_TYPE = "Root";
declare const STRING_TYPE = "string";
declare const NUMBER_TYPE = "number";
declare const NULL_TYPE = "null";
declare const BOOLEAN_TYPE = "boolean";
declare const UNDEFINED_TYPE = "undefined";
declare const OBJECT_TYPE = "Object";
declare const ARRAY_TYPE = "Array";
declare const COMMENT_TYPE = "Comment";
declare const ROOT_KEY = "root";
declare const ARRAY_ITEM = "$ARRAY_ITEM$";
declare const LAST_COMMENT = "$LAST_COMMENT$";
declare const NEXT_COMMENT = "$NEXT_COMMENT$";
declare const ARRAY_ERROR_MESSAGE = "array should be closed";
declare const COMMENT_ERROR_MESSAGE = "comment is illegal";
declare const VALUE_ILLEGAL_ERROR_MESSAGE = "value is illegal";

declare function json2ts(code: string, options?: CompileOptions): string;

export { ARRAY_ERROR_MESSAGE, ARRAY_ITEM, ARRAY_TYPE, BOOLEAN_TYPE, COMMENT_ERROR_MESSAGE, COMMENT_TYPE, LAST_COMMENT, NEXT_COMMENT, NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ROOT_KEY, ROOT_TYPE, STRING_TYPE, UNDEFINED_TYPE, VALUE_ILLEGAL_ERROR_MESSAGE, json2ts as default, json2ts, parse, traverser };
