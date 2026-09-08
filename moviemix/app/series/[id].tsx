import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.body}>
        <Text style={styles.title}>Series {id}</Text>
        <Text style={styles.meta}>2024 · 2 Seasons · Drama</Text>
        <Pressable style={styles.season}>
          <Text style={styles.seasonText}>Season 1 ▼</Text>
        </Pressable>
        <Text style={styles.section}>Episodes</Text>
        {[1, 2, 3].map((ep) => (
          <View key={ep} style={styles.episode}>
            <Text style={styles.epText}>Episode {ep}</Text>
          </View>
        ))}
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
  season: { borderWidth: 1, borderColor: tokens.color.border, padding: tokens.space[3], borderRadius: tokens.radius.md, marginBottom: tokens.space[4] },
  seasonText: { color: tokens.color.text },
  section: { color: tokens.color.text, fontSize: 18, marginBottom: tokens.space[2] },
  episode: { paddingVertical: tokens.space[3], borderBottomWidth: 1, borderBottomColor: tokens.color.border },
  epText: { color: tokens.color.text },
});
