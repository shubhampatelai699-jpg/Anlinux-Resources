import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { tokens } from '@/src/theme/tokens';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email', 'A password reset link has been sent.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={tokens.color.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable style={styles.button} onPress={reset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending…' : 'Send Reset Link'}</Text>
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>Back to login</Link>
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
  button: { backgroundColor: tokens.color.primary, padding: tokens.space[3], borderRadius: tokens.radius.md },
  buttonText: { color: tokens.color.text, textAlign: 'center' },
  link: { color: tokens.color.primary, textAlign: 'center', marginTop: tokens.space[4] },
});
