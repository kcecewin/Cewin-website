import test from 'node:test';
import assert from 'node:assert/strict';
import { submitAuth } from '../src/lib/auth.js';

const fields = { name: ' Alex ', email: ' alex@example.com ', password: 'example-password', confirmPassword: 'example-password' };

test('mismatched passwords never reach Supabase', async () => {
  const client = { auth: { signUp: () => assert.fail('Must not submit') } };
  await assert.rejects(submitAuth(client, true, { ...fields, confirmPassword: 'different' }), /Passwords do not match/);
});

test('signup sends name as metadata and supports email confirmation', async () => {
  const client = { auth: { signUp: async (payload) => {
    assert.deepEqual(payload, { email: 'alex@example.com', password: fields.password, options: { data: { name: 'Alex' } } });
    return { data: { user: { id: 'user-id' }, session: null }, error: null };
  } } };
  const result = await submitAuth(client, true, fields);
  assert.equal(result.session, null);
});

test('invalid credentials show the requested friendly message', async () => {
  const client = { auth: { signInWithPassword: async () => ({ error: { code: 'invalid_credentials', message: 'Invalid login credentials' } }) } };
  await assert.rejects(submitAuth(client, false, fields), /Invalid email or password/);
});

test('successful login returns the authenticated session', async () => {
  const session = { user: { id: 'user-id', user_metadata: { name: 'Alex' } } };
  const client = { auth: { signInWithPassword: async (payload) => {
    assert.deepEqual(payload, { email: 'alex@example.com', password: fields.password });
    return { data: { session }, error: null };
  } } };
  assert.equal((await submitAuth(client, false, fields)).session, session);
});

test('unconfirmed email gets an actionable message', async () => {
  const client = { auth: { signInWithPassword: async () => ({ error: { code: 'email_not_confirmed' } }) } };
  await assert.rejects(submitAuth(client, false, fields), /confirm your email/i);
});

test('missing configuration gives a clear error', async () => {
  await assert.rejects(submitAuth(null, false, fields), /not configured/i);
});
