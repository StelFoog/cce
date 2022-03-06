export declare type ParsedObject = {
    parsed: string[];
    error: boolean;
    specials: string[];
};
export default function parseArgs(args: string): ParsedObject;
