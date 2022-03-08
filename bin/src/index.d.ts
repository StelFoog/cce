#!/usr/bin/env node
import { ParsedObject } from './parseArgs';
export declare type Options = {
    compiler?: string;
    compilerArguments?: string;
    executeArguments?: string;
    stdin?: string;
    stdout?: string;
    outfile?: string;
    save?: true;
    asIs?: true;
    onlyExecPrints?: true;
};
export declare type cceParams = {
    file: string;
    compiler: string;
    compilerArguments: string;
    executeArguments: ParsedObject;
    stdin: string;
    stdout: string;
    outfile: string;
    save: boolean;
    asIs: boolean;
    onlyExecPrints: boolean;
};
