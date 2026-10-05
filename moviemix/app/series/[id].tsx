import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchSeriesWithEpisodes, addToWatchlist } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: series } = useQuery({ queryKey: ['series', id], queryFn: () => fetchSeriesWithEpisodes(id) });
  const seasons = series?.seasons ?? [];
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);
  const activeSeason = seasons.find((s) => s.id === activeSeasonId) ?? seasons[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.body}>
        <Text style={styles.title}>{series?.title ?? `Series ${id}`}</Text>
        <Text style={styles.meta}>
          {series?.releaseYear ?? '—'} · {seasons.length} Season{seasons.length === 1 ? '' : 's'} · ★ {series?.rating ?? '—'}
        </Text>
        <Text style={styles.description}>{series?.description}</Text>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => addToWatchlist({ seriesId: id })}>
          <Text style={styles.buttonText}>+ My List</Text>
        </Pressable>
        <View style={styles.seasonRow}>
          {seasons.map((s) => (
            <Pressable
              key={s.id}
              style={[styles.season, s.id === activeSeason?.id && styles.seasonActive]}
              onPress={() => setActiveSeasonId(s.id)}
            >
              <Text style={styles.seasonText}>{s.title ?? `Season ${s.seasonNumber}`}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.section}>Episodes</Text>
        {(activeSeason?.episodes ?? []).map((ep) => (
          <Pressable key={ep.id} style={styles.episode} onPress={() => router.push(`/player/${id}?episodeId=${ep.id}` as never)}>
            <Text style={styles.epText}>{ep.episodeNumber}. {ep.title}</Text>
          </Pressable>
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
  description: { color: tokens.color.text, marginBottom: tokens.space[4] },
  button: { backgroundColor: tokens.color.primary, padding: tokens.space[3], borderRadius: tokens.radius.md, marginBottom: tokens.space[3] },
  secondary: { backgroundColor: tokens.color.secondary },
  buttonText: { color: tokens.color.text, textAlign: 'center' },
  seasonRow: { flexDirection: 'row', flexWrap: 'wrap' },
  season: { borderWidth: 1, borderColor: tokens.color.border, padding: tokens.space[3], borderRadius: tokens.radius.md, marginBottom: tokens.space[4], marginRight: tokens.space[2] },
  seasonActive: { borderColor: tokens.color.primary },
  seasonText: { color: tokens.color.text },
  section: { color: tokens.color.text, fontSize: 18, marginBottom: tokens.space[2] },
  episode: { paddingVertical: tokens.space[3], borderBottomWidth: 1, borderBottomColor: tokens.color.border },
  epText: { color: tokens.color.text },
});
