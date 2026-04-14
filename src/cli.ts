#!/usr/bin/env node

import { program } from 'commander';
import { A2FAuth } from './A2FAuth';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  program
    .version('1.0.0')
    .description('A2F Authentication CLI - Generate and verify TOTP codes')
    .argument('<url>', 'OTPAuth URL')
    .option('-v, --verify', 'Verify mode - check if token is valid')
    .option('-q, --qr', 'Show QR code')
    .option('-r, --realtime', 'Generate realtime tokens continuously')
    .option('-w, --wait', 'Wait and output current token once')
    .parse(process.argv);

  const url = program.args[0];
  const options = program.opts();

  if (!url) {
    console.error('Error: OTP URL is required');
    process.exit(1);
  }

  try {
    const auth = new A2FAuth(url);

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
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();