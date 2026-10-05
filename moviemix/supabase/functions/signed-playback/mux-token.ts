import { Buffer } from 'node:buffer';
import { createPrivateKey, sign } from 'node:crypto';

// Mux asset IDs are different from playback IDs.
export function signMuxPlaybackToken(playbackId: string, keyId: string, base64Pem: string, expiration: number): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const input = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ sub: playbackId, aud: 'v', exp: expiration, kid: keyId })}`;
  const key = createPrivateKey(Buffer.from(base64Pem, 'base64').toString('utf8'));
  return `${input}.${sign('RSA-SHA256', Buffer.from(input), key).toString('base64url')}`;
}
