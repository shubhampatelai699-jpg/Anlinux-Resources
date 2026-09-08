import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MovieCard } from '@/src/components/MovieCard';
import { tokens } from '@/src/theme/tokens';

const items = Array.from({ length: 12 }, (_, i) => ({ id: `mylist-${i}` }));

export default function MyListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My List</Text>
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={() => <MovieCard />}
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
