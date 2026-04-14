import { A2FAuth, createA2F } from './A2FAuth';
import { A2FOptions, A2FResult } from './types';

export = async function(options: A2FOptions | string): Promise<A2FResult> {
  return createA2F(options);
};

module.exports = async function(options: A2FOptions | string): Promise<A2FResult> {
  return createA2F(options);
};

module.exports.A2FAuth = A2FAuth;
module.exports.createA2F = createA2F;