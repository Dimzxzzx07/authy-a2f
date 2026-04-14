import { A2FOptions, A2FResult, ParsedUrl } from './types';
import { parseOperatorUrl } from './utils/urlParser';
import { generateTOTPToken, verifyTOTPToken, generateRealtimeTokens } from './utils/tokenGenerator';
import { displayQR } from './utils/qrDisplay';

export class A2FAuth {
  private secret: string;
  private url: string;
  private issuer: string;
  private account: string;
  private realtimeTokenGetter: () => string;

  constructor(options: A2FOptions | string) {
    const operatorUrl = typeof options === 'string' ? options : options.operator;
    const parsed: ParsedUrl = parseOperatorUrl(operatorUrl);
    
    this.secret = parsed.secret;
    this.url = parsed.originalUrl;
    this.issuer = parsed.issuer;
    this.account = parsed.account;
    this.realtimeTokenGetter = generateRealtimeTokens(this.secret);
  }

  generateToken(): string {
    return generateTOTPToken(this.secret);
  }

  generateRealtimeToken(): string {
    return this.realtimeTokenGetter();
  }

  verifyToken(token: string): boolean {
    return verifyTOTPToken(this.secret, token);
  }

  showQR(): void {
    displayQR(this.url);
  }

  getInfo(): { issuer: string; account: string; secret: string } {
    return {
      issuer: this.issuer,
      account: this.account,
      secret: this.secret
    };
  }

  async waitForToken(): Promise<string> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const token = this.generateRealtimeToken();
        resolve(token);
        clearInterval(interval);
      }, 100);
    });
  }
}

export async function createA2F(options: A2FOptions | string): Promise<A2FResult> {
  const auth = new A2FAuth(options);
  
  return {
    token: auth.generateToken(),
    verify: (inputToken: string) => auth.verifyToken(inputToken),
    qr: () => auth.showQR(),
    url: typeof options === 'string' ? options : options.operator,
    generateNewToken: () => auth.generateRealtimeToken()
  };
}