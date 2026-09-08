import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { tokens } from '@/src/theme/tokens';

function strengthLabel(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return ['Weak', 'Fair', 'Good', 'Strong'][score - 1] ?? 'Too short';
}

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp, loading } = useAuthStore();
  const label = useMemo(() => strengthLabel(password), [password]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={tokens.color.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={tokens.color.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.meter}>Password strength: {label}</Text>
      <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms((v) => !v)}>
        <Text style={styles.termsText}>{acceptedTerms ? '☑' : '☐'} I agree to the Terms of Service and Privacy Policy</Text>
      </Pressable>
      <Pressable
        style={[styles.button, (!acceptedTerms || loading) && styles.disabled]}
        onPress={() => signUp(email, password)}
        disabled={!acceptedTerms || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Sign Up'}</Text>
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>Already have an account? Sign in</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: tokens.space[4], backgroundColor: tokens.color.background },
  title: { fontSize: 28, color: tokens.color.text, marginBottom: tokens.space[6], textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space[3],
    marginBottom: tokens.space[3],
    color: tokens.color.text,
    backgroundColor: tokens.color.surface,
  },
  meter: { color: tokens.color.textMuted, marginBottom: tokens.space[3] },
  termsRow: { marginBottom: tokens.space[4] },
  termsText: { color: tokens.color.text },
  button: { backgroundColor: tokens.color.primary, padding: tokens.space[3], borderRadius: tokens.radius.md },
  disabled: { opacity: 0.5 },
  buttonText: { color: tokens.color.text, textAlign: 'center' },
  link: { color: tokens.color.primary, textAlign: 'center', marginTop: tokens.space[4] },
});
