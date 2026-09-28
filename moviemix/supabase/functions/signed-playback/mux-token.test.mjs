import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { generateKeyPairSync, verify } from 'node:crypto';
import { signMuxPlaybackToken } from './mux-token.ts';

test('Mux playback JWT has the playback ID and a verifiable RS256 signature', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const token = signMuxPlaybackToken('playback_id', 'signing_key', Buffer.from(pem).toString('base64'), 2000000000);
  const [header, payload, signature] = token.split('.');
  assert.deepEqual(JSON.parse(Buffer.from(header, 'base64url').toString()), { alg: 'RS256', typ: 'JWT' });
  assert.deepEqual(JSON.parse(Buffer.from(payload, 'base64url').toString()), {
    sub: 'playback_id', aud: 'v', exp: 2000000000, kid: 'signing_key',
  });
  assert.equal(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature, 'base64url')), true);
});
