import * as qrcode from 'qrcode-terminal';

export function displayQR(url: string): void {
  qrcode.generate(url, { small: true });
}

export function getQRCode(url: string): Promise<string> {
  return new Promise((resolve) => {
    let output = '';
    qrcode.generate(url, { small: true }, (qrString) => {
      output = qrString;
      resolve(output);
    });
  });
}