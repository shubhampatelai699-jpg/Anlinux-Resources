import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.body}>
        <Text style={styles.title}>Movie {id}</Text>
        <Text style={styles.meta}>2024 · 2h 15m · Action</Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Play</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]}>
          <Text style={styles.buttonText}>+ My List</Text>
        </Pressable>
        <Text style={styles.section}>Cast & Crew</Text>
        <Text style={styles.credit}>Actor Name · Character</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  backdrop: { width: '100%', height: 240, backgroundColor: tokens.color.surface },
  body: { padding: tokens.space[4] },
  title: { fontSize: 24, color: tokens.color.text, marginBottom: tokens.space[2] },
  meta: { color: tokens.color.textMuted, marginBottom: tokens.space[4] },
  button: { backgroundColor: tokens.color.primary, padding: tokens.space[3], borderRadius: tokens.radius.md, marginBottom: tokens.space[3] },
  secondary: { backgroundColor: tokens.color.secondary },
  buttonText: { color: tokens.color.text, textAlign: 'center' },
  section: { color: tokens.color.text, fontSize: 18, marginTop: tokens.space[6], marginBottom: tokens.space[2] },
  credit: { color: tokens.color.textMuted },
});
