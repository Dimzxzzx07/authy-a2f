"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOperatorUrl = parseOperatorUrl;
function parseOperatorUrl(url) {
    const secretMatch = url.match(/secret=([A-Z2-7]+)/i);
    const issuerMatch = url.match(/issuer=([^&]+)/i);
    const accountMatch = url.match(/otpauth:\/\/totp\/([^:?]+):([^?]+)/);
    if (!secretMatch) {
        throw new Error('Invalid OTP URL: secret not found');
    }
    return {
        secret: secretMatch[1],
        issuer: issuerMatch ? decodeURIComponent(issuerMatch[1]) : 'Unknown',
        account: accountMatch ? `${accountMatch[1]}:${accountMatch[2]}` : 'Unknown',
        originalUrl: url
    };
}
