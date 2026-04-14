export interface A2FOptions {
  operator: string;
}

export interface A2FResult {
  token: string;
  verify: (inputToken: string) => boolean;
  qr: () => void;
  url: string;
  generateNewToken: () => string;
}

export interface ParsedUrl {
  secret: string;
  issuer: string;
  account: string;
  originalUrl: string;
}