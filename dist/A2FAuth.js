"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A2FAuth = void 0;
exports.createA2F = createA2F;
const urlParser_1 = require("./utils/urlParser");
const tokenGenerator_1 = require("./utils/tokenGenerator");
const qrDisplay_1 = require("./utils/qrDisplay");
class A2FAuth {
    constructor(options) {
        const operatorUrl = typeof options === 'string' ? options : options.operator;
        const parsed = (0, urlParser_1.parseOperatorUrl)(operatorUrl);
        this.secret = parsed.secret;
        this.url = parsed.originalUrl;
        this.issuer = parsed.issuer;
        this.account = parsed.account;
        this.realtimeTokenGetter = (0, tokenGenerator_1.generateRealtimeTokens)(this.secret);
    }
    generateToken() {
        return (0, tokenGenerator_1.generateTOTPToken)(this.secret);
    }
    generateRealtimeToken() {
        return this.realtimeTokenGetter();
    }
    verifyToken(token) {
        return (0, tokenGenerator_1.verifyTOTPToken)(this.secret, token);
    }
    showQR() {
        (0, qrDisplay_1.displayQR)(this.url);
    }
    getInfo() {
        return {
            issuer: this.issuer,
            account: this.account,
            secret: this.secret
        };
    }
    async waitForToken() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const token = this.generateRealtimeToken();
                resolve(token);
                clearInterval(interval);
            }, 100);
        });
    }
}
exports.A2FAuth = A2FAuth;
async function createA2F(options) {
    const auth = new A2FAuth(options);
    return {
        token: auth.generateToken(),
        verify: (inputToken) => auth.verifyToken(inputToken),
        qr: () => auth.showQR(),
        url: typeof options === 'string' ? options : options.operator,
        generateNewToken: () => auth.generateRealtimeToken()
    };
}
