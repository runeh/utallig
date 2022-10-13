import type { RandomFloatFun } from './common';

export type KidAlgorithm = 'sha256' | 'md5';

export function kid(args?: {
  randomFloat?: RandomFloatFun;
  algorithm?: KidAlgorithm;
}): string {
  return 'asdf';
}
