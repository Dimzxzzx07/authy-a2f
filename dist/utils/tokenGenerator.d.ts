export declare function generateTOTPToken(secret: string): string;
export declare function verifyTOTPToken(secret: string, token: string): boolean;
export declare function generateRealtimeTokens(secret: string, interval?: number): () => string;
//# sourceMappingURL=tokenGenerator.d.ts.map