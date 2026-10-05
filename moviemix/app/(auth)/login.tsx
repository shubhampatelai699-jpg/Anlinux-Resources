import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { tokens } from '@/src/theme/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, loading } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MovieMix</Text>
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
      <Pressable style={styles.button} onPress={() => signIn(email, password)} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.google]} onPress={signInWithGoogle} disabled={loading}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </Pressable>
      <Link href="/(auth)/forgot-password" style={styles.link}>Forgot password?</Link>
      <Link href="/(auth)/signup" style={styles.link}>Create account</Link>
      <Text style={styles.footer}>Powered by TMDB · This product uses the TMDB API but is not endorsed or certified by TMDB.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: tokens.space[4], backgroundColor: tokens.color.background },
  title: { fontSize: 32, color: tokens.color.text, marginBottom: tokens.space[6], textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space[3],
    marginBottom: tokens.space[3],
    color: tokens.color.text,
    backgroundColor: tokens.color.surface,
  },
  button: { backgroundColor: tokens.color.primary, padding: tokens.space[3], borderRadius: tokens.radius.md, marginBottom: tokens.space[3] },
  google: { backgroundColor: tokens.color.secondary },
  buttonText: { color: tokens.color.text, textAlign: 'center' },
  link: { color: tokens.color.primary, textAlign: 'center', marginTop: tokens.space[2] },
  footer: { color: tokens.color.textMuted, fontSize: 10, textAlign: 'center', marginTop: tokens.space[8] },
});
