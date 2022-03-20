declare type CompileOptions = {
    spiltType?: boolean;
    parseArray?: boolean;
    required?: boolean;
    semicolon?: boolean;
};

declare function compile(code: string, options: CompileOptions): string;

export { compile };
