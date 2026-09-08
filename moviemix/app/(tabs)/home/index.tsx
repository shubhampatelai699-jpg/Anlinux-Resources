import { ScrollView, StyleSheet, View } from 'react-native';
import { HeroBanner } from '@/src/components/HeroBanner';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { tokens } from '@/src/theme/tokens';

const rails = [
  { title: 'Trending Now', key: 'trending' },
  { title: 'New Releases', key: 'new' },
  { title: 'Top Rated Movies', key: 'top_movies' },
  { title: 'Top Rated Series', key: 'top_series' },
  { title: 'Action & Adventure', key: 'action' },
  { title: 'Comedy', key: 'comedy' },
  { title: 'Horror', key: 'horror' },
  { title: 'Documentaries', key: 'documentary' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <HeroBanner />
      {rails.map((rail) => (
        <HorizontalRail key={rail.key} title={rail.title} queryKey={rail.key} />
      ))}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  spacer: { height: tokens.space[6] },
});
