import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MovieCard } from './MovieCard';
import { tokens } from '@/src/theme/tokens';

export type RailItem = { id: string; title: string; poster_url: string | null };

export function HorizontalRail({ title, items }: { title: string; items?: RailItem[] }) {
  const data = items?.length ? items : Array.from({ length: 6 }, (_, i) => ({ id: `placeholder-${i}`, title: '', poster_url: null }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard compact title={item.title} posterUrl={item.poster_url} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: tokens.space[5] },
  title: { color: tokens.color.text, fontSize: 18, marginHorizontal: tokens.space[4], marginBottom: tokens.space[2] },
  list: { paddingHorizontal: tokens.space[4] },
});
