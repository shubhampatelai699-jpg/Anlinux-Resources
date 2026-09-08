import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MovieCard } from './MovieCard';
import { tokens } from '@/src/theme/tokens';

export function HorizontalRail({ title, queryKey }: { title: string; queryKey: string }) {
  const items = Array.from({ length: 12 }, (_, i) => ({ id: `${queryKey}-${i}` }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={() => <MovieCard compact />}
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
