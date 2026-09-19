import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/src/components/MovieCard';
import { fetchMovies, fetchSeries } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function LanguageScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { data: movies } = useQuery({ queryKey: ['language', code, 'movies'], queryFn: () => fetchMovies(20, undefined, code) });
  const { data: seriesList } = useQuery({ queryKey: ['language', code, 'series'], queryFn: () => fetchSeries(20, undefined, code) });

  const items = [
    ...(movies ?? []).map((m) => ({ id: `movie-${m.id}`, title: m.title, posterUrl: m.posterUrl, href: `/movie/${m.id}` })),
    ...(seriesList ?? []).map((s) => ({ id: `series-${s.id}`, title: s.title, posterUrl: s.posterUrl, href: `/series/${s.id}` })),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language: {code.toUpperCase()}</Text>
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
});
