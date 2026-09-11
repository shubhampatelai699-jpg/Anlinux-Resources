import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/src/components/MovieCard';
import { searchMoviesAndSeries } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

const tabs = ['All', 'Movies', 'Series', 'People'] as const;
type Tab = (typeof tabs)[number];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMoviesAndSeries(query, activeTab === 'All' ? undefined : (activeTab.toLowerCase() as 'movie' | 'series')),
    enabled: query.length > 1,
  });
  const recents = ['Inception', 'Breaking Bad', 'Christopher Nolan'];

  const items = [
    ...(results?.movies ?? []).map((m: any) => ({ ...m, kind: 'movie' as const })),
    ...(results?.series ?? []).map((s: any) => ({ ...s, kind: 'series' as const })),
  ];
  const filtered = items.filter((item) => activeTab === 'All' || activeTab.toLowerCase() === item.kind);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search movies, series, people…"
        placeholderTextColor={tokens.color.textMuted}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <Pressable key={t} onPress={() => setActiveTab(t)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      {!query && (
        <View style={styles.recents}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recents.map((r) => (
            <Pressable key={r} style={styles.recentItem}>
              <Text style={styles.recentText}>{r}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <FlatList
        data={filtered}
        numColumns={3}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        renderItem={({ item }) => <MovieCard compact title={item.title} posterUrl={item.poster_url} />}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  input: {
    margin: tokens.space[4],
    padding: tokens.space[3],
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.surface,
    color: tokens.color.text,
  },
  tabRow: { flexDirection: 'row', paddingHorizontal: tokens.space[4], marginBottom: tokens.space[3] },
  tab: { marginRight: tokens.space[4] },
  tabText: { color: tokens.color.textMuted },
  activeTabText: { color: tokens.color.primary, fontWeight: '700' },
  recents: { paddingHorizontal: tokens.space[4], marginBottom: tokens.space[4] },
  sectionTitle: { color: tokens.color.text, fontSize: 16, marginBottom: tokens.space[2] },
  recentItem: { paddingVertical: tokens.space[2] },
  recentText: { color: tokens.color.text },
  grid: { paddingHorizontal: tokens.space[4] },
});
