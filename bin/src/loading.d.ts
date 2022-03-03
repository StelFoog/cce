export declare type Loader = {
    done: () => void;
    error: () => void;
};
export default function startLoading(name: string): Loader;
