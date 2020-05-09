declare namespace Express {
    interface Response {
        sendFile: (
            file: string,
            options?: {
                maxAge?: number;
                root?: string;
                lastModified?: boolean;
                headers?: object;
                dotfiles?: 'allow' | 'deny' | 'ignore';
                acceptRanges?: boolean;
                cacheControl?: boolean;
                immutable: boolean;
            },
            fn?: (err: any) => void
        ) => any;
    }
}

declare module '*.glsl' {
    let str: string;
    export default str;
}

declare module '*.obj' {
    let str: string;
    export default str;
}

declare module '*.png' {
    let str: string;
    export default str;
}
