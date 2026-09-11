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

  return (
    <ScrollView style={styles.container}>
      <HeroBanner items={featured ?? []} />
      <HorizontalRail title="Featured Movies" items={featured ?? []} />
      <HorizontalRail title="New Movies" items={movies ?? []} />
      <HorizontalRail title="New Series" items={series ?? []} />
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  spacer: { height: tokens.space[6] },
});
