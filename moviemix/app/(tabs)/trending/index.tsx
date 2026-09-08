import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { MovieCard } from '@/src/components/MovieCard';
import { tokens } from '@/src/theme/tokens';

type Window = '24h' | '7d' | '30d';

const chips: Window[] = ['24h', '7d', '30d'];

export default function TrendingScreen() {
  const [window, setWindow] = useState<Window>('24h');
  const items = Array.from({ length: 20 }, (_, i) => ({ id: `${window}-${i}`, rank: i + 1 }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending</Text>
      <View style={styles.chipRow}>
        {chips.map((c) => (
          <Pressable
            key={c}
            style={[styles.chip, window === c && styles.activeChip]}
            onPress={() => setWindow(c)}
          >
            <Text style={[styles.chipText, window === c && styles.activeChipText]}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{item.rank}</Text>
            <MovieCard />
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  title: { fontSize: 24, color: tokens.color.text, padding: tokens.space[4], paddingBottom: tokens.space[2] },
  chipRow: { flexDirection: 'row', paddingHorizontal: tokens.space[4], marginBottom: tokens.space[3] },
  chip: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.space[4],
    paddingVertical: tokens.space[2],
    marginRight: tokens.space[2],
  },
  activeChip: { backgroundColor: tokens.color.primary, borderColor: tokens.color.primary },
  chipText: { color: tokens.color.text },
  activeChipText: { color: tokens.color.text },
  list: { paddingHorizontal: tokens.space[4] },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.space[3] },
  rank: { width: 28, color: tokens.color.text, fontSize: 18, fontWeight: '700' },
});
