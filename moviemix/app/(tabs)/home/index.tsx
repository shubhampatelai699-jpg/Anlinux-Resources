import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { HeroBanner } from '@/src/components/HeroBanner';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { fetchFeaturedMovies, fetchMovies, fetchSeries } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function HomeScreen() {
  const { data: featured } = useQuery({ queryKey: ['featured-movies'], queryFn: fetchFeaturedMovies });
  const { data: movies } = useQuery({ queryKey: ['movies'], queryFn: () => fetchMovies(12) });
  const { data: series } = useQuery({ queryKey: ['series'], queryFn: () => fetchSeries(12) });

  const heroItems = (featured ?? []).map((m) => ({ id: m.id, title: m.title, backdropUrl: m.backdropUrl, href: `/movie/${m.id}` }));
  const featuredRail = (featured ?? []).map((m) => ({ id: m.id, title: m.title, posterUrl: m.posterUrl, href: `/movie/${m.id}` }));
  const movieRail = (movies ?? []).map((m) => ({ id: m.id, title: m.title, posterUrl: m.posterUrl, href: `/movie/${m.id}` }));
  const seriesRail = (series ?? []).map((s) => ({ id: s.id, title: s.title, posterUrl: s.posterUrl, href: `/series/${s.id}` }));

  return (
    <ScrollView style={styles.container}>
      <HeroBanner items={heroItems} />
      <HorizontalRail title="Featured Movies" items={featuredRail} />
      <HorizontalRail title="New Movies" items={movieRail} />
      <HorizontalRail title="New Series" items={seriesRail} />
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  spacer: { height: tokens.space[6] },
});
