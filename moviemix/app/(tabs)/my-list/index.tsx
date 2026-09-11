import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/src/components/MovieCard';
import { fetchWatchlist } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function MyListScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['watchlist'], queryFn: fetchWatchlist });
  const items = (data ?? []).map((item: any) => ({
    id: item.movie_id ?? item.series_id,
    title: item.movies?.title ?? item.series?.title ?? '',
    poster_url: item.movies?.poster_url ?? item.series?.poster_url ?? null,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My List</Text>
      {isLoading ? <Text style={styles.empty}>Loading…</Text> : null}
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard title={item.title} posterUrl={item.poster_url} />}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  title: { fontSize: 24, color: tokens.color.text, padding: tokens.space[4] },
  grid: { paddingHorizontal: tokens.space[4], paddingBottom: tokens.space[6] },
});
