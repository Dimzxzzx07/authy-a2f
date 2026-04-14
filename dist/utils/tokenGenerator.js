"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTOTPToken = generateTOTPToken;
exports.verifyTOTPToken = verifyTOTPToken;
exports.generateRealtimeTokens = generateRealtimeTokens;
const speakeasy = __importStar(require("speakeasy"));
function generateTOTPToken(secret) {
    return speakeasy.totp({
        secret: secret,
        encoding: 'base32'
    });
}
function verifyTOTPToken(secret, token) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1
    });
}
function generateRealtimeTokens(secret, interval = 30000) {
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
