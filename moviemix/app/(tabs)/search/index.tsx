import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MovieCard } from '@/src/components/MovieCard';
import { tokens } from '@/src/theme/tokens';

const tabs = ['All', 'Movies', 'Series', 'People'] as const;
type Tab = (typeof tabs)[number];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const recents = ['Inception', 'Breaking Bad', 'Christopher Nolan'];
  const results = Array.from({ length: 8 }, (_, i) => ({ id: `${activeTab}-${i}` }));

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
        data={results}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={() => <MovieCard />}
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
