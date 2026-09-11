import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMovie, addToWatchlist } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: movie } = useQuery({ queryKey: ['movie', id], queryFn: () => fetchMovie(id) });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.body}>
        <Text style={styles.title}>{movie?.title ?? `Movie ${id}`}</Text>
        <Text style={styles.meta}>
          {movie?.release_year ?? '—'} · {movie?.runtime ? `${movie.runtime} min` : '—'} · ★ {movie?.rating ?? '—'}
        </Text>
        <Text style={styles.description}>{movie?.description}</Text>
        <Pressable style={styles.button} onPress={() => router.push(`/player/${id}`)}>
          <Text style={styles.buttonText}>Play</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => addToWatchlist({ movieId: id })}>
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
