import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/src/components/MovieCard';
import { fetchWatchlist } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function MyListScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['watchlist'], queryFn: fetchWatchlist });
  const items = (data ?? []).map((item) => ({
    id: item.contentId,
    title: item.movie?.title ?? item.series?.title ?? '',
    posterUrl: item.movie?.posterUrl ?? item.series?.posterUrl ?? null,
    href: item.contentType === 'movie' ? `/movie/${item.contentId}` : `/series/${item.contentId}`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My List</Text>
      {isLoading ? <Text style={styles.empty}>Loading…</Text> : null}
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard title={item.title} posterUrl={item.posterUrl} href={item.href} />}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  title: { fontSize: 24, color: tokens.color.text, padding: tokens.space[4] },
  grid: { paddingHorizontal: tokens.space[4], paddingBottom: tokens.space[6] },
  empty: { color: tokens.color.textMuted, paddingHorizontal: tokens.space[4] },
});
