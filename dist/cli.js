#!/usr/bin/env node
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
const commander_1 = require("commander");
const A2FAuth_1 = require("./A2FAuth");
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function question(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}
async function main() {
    commander_1.program
        .version('1.0.0')
        .description('A2F Authentication CLI - Generate and verify TOTP codes')
        .argument('<url>', 'OTPAuth URL')
        .option('-v, --verify', 'Verify mode - check if token is valid')
        .option('-q, --qr', 'Show QR code')
        .option('-r, --realtime', 'Generate realtime tokens continuously')
        .option('-w, --wait', 'Wait and output current token once')
        .parse(process.argv);
    const url = commander_1.program.args[0];
    const options = commander_1.program.opts();
    if (!url) {
        console.error('Error: OTP URL is required');
        process.exit(1);
    }
    try {
        const auth = new A2FAuth_1.A2FAuth(url);
        if (options.qr) {
            console.log('\nQR Code:');
            auth.showQR();
            console.log('');
        }
        if (options.verify) {
            const userToken = await question('Enter token to verify: ');
            const isValid = auth.verifyToken(userToken);
            console.log(isValid ? 'Token is valid' : 'Token is invalid');
        }
        else if (options.realtime) {
            console.log('Generating realtime tokens (Ctrl+C to stop):\n');
            const interval = setInterval(() => {
                const token = auth.generateRealtimeToken();
                process.stdout.write(`\rCurrent token: ${token} `);
            }, 1000);
            process.on('SIGINT', () => {
                clearInterval(interval);
                console.log('\n\nStopped');
                process.exit(0);
            });
        }
        else if (options.wait) {
            const token = await auth.waitForToken();
            console.log(token);
        }
        else {
            const token = auth.generateToken();
            const info = auth.getInfo();
            console.log(`\nIssuer: ${info.issuer}`);
            console.log(`Account: ${info.account}`);
            console.log(`Current Token: ${token}\n`);
        }
        rl.close();
    }
    catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
main();
