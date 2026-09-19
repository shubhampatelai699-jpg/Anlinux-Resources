import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/src/components/MovieCard';
import { fetchGenres, fetchMovies, fetchSeries } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function GenreScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });
  const genre = genres?.find((g) => g.slug === slug);

  const { data: movies } = useQuery({
    queryKey: ['genre', slug, 'movies'],
    queryFn: () => fetchMovies(20, genre!.id),
    enabled: !!genre,
  });
  const { data: seriesList } = useQuery({
    queryKey: ['genre', slug, 'series'],
    queryFn: () => fetchSeries(20, genre!.id),
    enabled: !!genre,
  });

  const items = [
    ...(movies ?? []).map((m) => ({ id: `movie-${m.id}`, title: m.title, posterUrl: m.posterUrl, href: `/movie/${m.id}` })),
    ...(seriesList ?? []).map((s) => ({ id: `series-${s.id}`, title: s.title, posterUrl: s.posterUrl, href: `/series/${s.id}` })),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{genre?.name ?? slug.replace('-', ' ')}</Text>
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
  title: { fontSize: 24, color: tokens.color.text, padding: tokens.space[4], textTransform: 'capitalize' },
  grid: { paddingHorizontal: tokens.space[4], paddingBottom: tokens.space[6] },
});
