import * as speakeasy from 'speakeasy';

export function generateTOTPToken(secret: string): string {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
}

export function verifyTOTPToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });
}

export function generateRealtimeTokens(secret: string, interval: number = 30000): () => string {
  let lastToken = '';
  let lastTimestamp = 0;
  
  return () => {
    const now = Date.now();
    const currentInterval = Math.floor(now / interval);
    
    if (currentInterval !== lastTimestamp) {
      lastTimestamp = currentInterval;
      lastToken = generateTOTPToken(secret);
    }
    
    return lastToken;
  };
}