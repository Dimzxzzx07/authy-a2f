```markdown
# auth-a2f

<div align="center">
    <img src="https://img.shields.io/badge/Version-1.0.0-2563eb?style=for-the-badge&logo=typescript" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative" alt="License">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?style=for-the-badge&logo=nodedotjs" alt="Node">
    <img src="https://img.shields.io/badge/2FA-TOTP-ff6b6b?style=for-the-badge" alt="2FA">
</div>

<div align="center">
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Dimzxzzx07-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Dimzxzzx07-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/auth-a2f">
        <img src="https://img.shields.io/badge/NPM-auth--a2f-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
</div>

---

## Table of Contents

- [What is Auth-A2F?](#what-is-auth-a2f)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [FAQ](#faq)
- [License](#license)

---

## What is Auth-A2F?

**Auth-A2F** is a lightweight Node.js library for generating and verifying Time-based One-Time Password (TOTP) codes used in two-factor authentication. Simply provide an OTPAuth URL and get real-time authentication codes.

---

## Features

| Category | Features |
|----------|----------|
| TOTP Generation | RFC 6238 compliant, 30-second intervals, 6-8 digit codes |
| QR Display | Terminal QR code generation for easy setup |
| Verification | Built-in token verification with time window |
| CLI Support | Full command-line interface |
| Realtime Mode | Continuous token generation |
| TypeScript | Full type definitions included |
| Zero Dependencies | Only essential packages |

---

## Installation

```bash
npm install auth-a2f
npm install -g auth-a2f
```

Requirements

Requirement Minimum Recommended
Node.js 18.0.0 20.0.0+
RAM 50 MB 128 MB+

---

Quick Start

JavaScript/TypeScript

```javascript
const a2f = require("auth-a2f");

async function main() {
  const result = await a2f({
    operator: "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub"
  });

  console.log("Current Token:", result.token);
  console.log("Verify 123456:", result.verify("123456"));
  result.qr();
}

main();
```

With Custom Class

```javascript
const { A2FAuth } = require("auth-a2f");

const auth = new A2FAuth("otpauth://totp/Service:user?secret=SECRET123");

console.log(auth.generateToken());
console.log(auth.verifyToken("123456"));
console.log(auth.getInfo());
```

---

CLI Usage

Basic Commands

```bash
# Generate a single token
a2f "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub"

# Show QR code
a2f "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub" --qr

# Verify a token
a2f "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub" --verify

# Realtime continuous mode
a2f "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub" --realtime

# Wait for current token (returns once)
a2f "otpauth://totp/GitHub:Dimzxzzx07?secret=TGZ76WG6VZTEC5Q2&issuer=GitHub" --wait
```

CLI Options

Option Description
--qr Display QR code for the OTP URL
--verify Enter interactive verification mode
--realtime Generate tokens continuously in realtime
--wait Output the current token once and exit

---

API Reference

createA2F(options)

Main function to create an A2F instance.

```typescript
function createA2F(options: string | A2FOptions): Promise<A2FResult>
```

Parameters:

· options: OTPAuth URL string or object with operator property

Returns:

```typescript
interface A2FResult {
  token: string;              // Current TOTP token
  verify: (token: string) => boolean;  // Verify a token
  qr: () => void;             // Display QR code in terminal
  url: string;                // Original OTP URL
  generateNewToken: () => string;  // Generate fresh token
}
```

A2FAuth Class

```typescript
class A2FAuth {
  constructor(operatorUrl: string);
  generateToken(): string;
  generateRealtimeToken(): string;
  verifyToken(token: string): boolean;
  showQR(): void;
  getInfo(): { issuer: string; account: string; secret: string };
  waitForToken(): Promise<string>;
}
```

---

Usage Examples

Basic Authentication Flow

```javascript
const a2f = require("auth-a2f");

async function loginWith2FA() {
  const auth = await a2f("otpauth://totp/MyApp:user@example.com?secret=JBSWY3DPEHPK3PXP");

  console.log("Scan this QR code with Google Authenticator:");
  auth.qr();

  const userToken = await prompt("Enter 2FA code: ");
  
  if (auth.verify(userToken)) {
    console.log("Login successful!");
  } else {
    console.log("Invalid code");
  }
}
```

Real-time Token Monitor

```javascript
const { A2FAuth } = require("auth-a2f");

const auth = new A2FAuth("otpauth://totp/GitHub:user?secret=SECRET123");

setInterval(() => {
  const token = auth.generateRealtimeToken();
  console.log(`Token: ${token} - Expires in: ${30 - (Date.now() / 1000 % 30)}s`);
}, 1000);
```

Express.js Backend Integration

```javascript
const express = require("express");
const { A2FAuth } = require("auth-a2f");

const app = express();
app.use(express.json());

const userSecrets = new Map();

app.post("/api/2fa/setup", (req, res) => {
  const { userId, secretUrl } = req.body;
  const auth = new A2FAuth(secretUrl);
  userSecrets.set(userId, auth);
  res.json({ message: "2FA setup complete" });
});

app.post("/api/2fa/verify", (req, res) => {
  const { userId, token } = req.body;
  const auth = userSecrets.get(userId);
  
  if (auth && auth.verifyToken(token)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.listen(3000);
```

Generate Multiple Accounts

```javascript
const { A2FAuth } = require("auth-a2f");

const accounts = [
  "otpauth://totp/GitHub:user1?secret=AAA111",
  "otpauth://totp/Gmail:user2@email.com?secret=BBB222",
  "otpauth://totp/Discord:user3?secret=CCC333"
];

const tokens = accounts.map(url => {
  const auth = new A2FAuth(url);
  return {
    account: auth.getInfo().account,
    token: auth.generateToken()
  };
});

console.table(tokens);
```

---

FAQ

Q1: What is an OTPAuth URL format?

Answer: The standard format is:

```
otpauth://totp/ISSUER:ACCOUNT?secret=BASE32SECRET&issuer=ISSUER
```

Example:

```
otpauth://totp/GitHub:username?secret=JBSWY3DPEHPK3PXP&issuer=GitHub
```

Q2: How do I get the secret key?

Answer: Secret keys are usually provided when enabling 2FA on services like GitHub, Google, Discord, or Authy. They are typically Base32 encoded strings (letters A-Z and numbers 2-7).

Q3: What's the difference between generateToken and generateRealtimeToken?

Answer:

· generateToken(): Returns token based on current time (30-second windows)
· generateRealtimeToken(): Same as generateToken but caches result within the same time window for performance

Q4: Why does verification fail?

Answer: Common reasons:

1. Token expired (tokens are valid for 30 seconds only)
2. Time sync issues (ensure system time is accurate)
3. Wrong secret key
4. Token already used (some services prevent replay)

Valid Data: Standard TOTP allows a 1-step window (30 seconds before/after) for clock drift, giving about 90 seconds total validity.

Q5: Can I use this for my own app's 2FA?

Answer: Yes. You can generate secrets using speakeasy or otplib, then create OTPAuth URLs to share with users via QR codes.

Secret generation example:

```javascript
const speakeasy = require("speakeasy");
const secret = speakeasy.generateSecret({ length: 20 });
console.log(secret.base32);
console.log(`otpauth://totp/MyApp:user?secret=${secret.base32}&issuer=MyApp`);
```

Q6: Is this compatible with Google Authenticator?

Answer: Yes. Google Authenticator, Microsoft Authenticator, Authy, and all TOTP-compatible apps work with this library.

Q7: How accurate is the time-based generation?

Answer: TOTP uses Unix timestamps divided by 30. Accuracy depends on system clock synchronization. Use NTP (Network Time Protocol) for best results. Clock drift up to 1 step (30 seconds) is automatically handled by the verification window.

---

License

MIT License

Copyright (c) 2026 Dimzxzzx07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
    <strong>Powered By Dimzxzzx07</strong>
    <br>
    <br>
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub">
    </a>
    <br>
    <br>
    <small>Copyright © 2026 Dimzxzzx07. All rights reserved.</small>
</div>