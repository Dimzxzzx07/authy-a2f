import { A2FOptions, A2FResult } from './types';
export declare class A2FAuth {
    private secret;
    private url;
    private issuer;
    private account;
    private realtimeTokenGetter;
    constructor(options: A2FOptions | string);
    generateToken(): string;
    generateRealtimeToken(): string;
    verifyToken(token: string): boolean;
    showQR(): void;
    getInfo(): {
        issuer: string;
        account: string;
        secret: string;
    };
    waitForToken(): Promise<string>;
}
export declare function createA2F(options: A2FOptions | string): Promise<A2FResult>;
//# sourceMappingURL=A2FAuth.d.ts.map