// Passwords go only to Supabase Auth, never into a profile or database table.
export async function submitAuth(client, isSignup, fields) {
  if (!client) throw new Error('Authentication is not configured yet.');
  const email = fields.email.trim();
  const password = fields.password;
  let result;

  if (isSignup) {
    if (!fields.name.trim()) throw new Error('Please enter your name.');
    if (password !== fields.confirmPassword) throw new Error('Passwords do not match.');
    if (password.length < 6) throw new Error('Use a password with at least 6 characters.');
    result = await client.auth.signUp({
      email,
      password,
      options: { data: { name: fields.name.trim() } },
    });
  } else {
    result = await client.auth.signInWithPassword({ email, password });
  }

  if (result.error) {
    if (result.error.code === 'invalid_credentials') {
      throw new Error('Invalid email or password');
    }
    if (result.error.code === 'email_not_confirmed') {
      throw new Error('Please confirm your email before logging in. Check your inbox.');
    }
    throw new Error(result.error.message || 'Unable to authenticate. Please try again.');
  }
  return result.data;
}
