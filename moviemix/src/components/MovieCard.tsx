import { Pressable, StyleSheet, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

export function MovieCard({ compact = false }: { compact?: boolean }) {
  return (
    <Pressable style={[styles.card, compact && styles.compact]}>
      <View style={[styles.image, compact && styles.compactImage]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: tokens.space[3] },
  compact: { width: 120 },
  image: { width: 160, height: 220, borderRadius: tokens.radius.md, backgroundColor: tokens.color.surface },
  compactImage: { width: 120, height: 170 },
});
