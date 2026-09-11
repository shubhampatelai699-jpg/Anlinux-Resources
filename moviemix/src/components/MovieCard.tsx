import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

export function MovieCard({
  compact = false,
  title,
  posterUrl,
}: {
  compact?: boolean;
  title?: string;
  posterUrl?: string | null;
}) {
  return (
    <Pressable style={[styles.card, compact && styles.compact]}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={[styles.image, compact && styles.compactImage]} />
      ) : (
        <View style={[styles.image, compact && styles.compactImage]} />
      )}
      {title ? <Text numberOfLines={1} style={styles.title}>{title}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: tokens.space[3] },
  compact: { width: 120 },
  image: { width: 160, height: 220, borderRadius: tokens.radius.md, backgroundColor: tokens.color.surface },
  compactImage: { width: 120, height: 170 },
  title: { color: tokens.color.text, fontSize: 12, marginTop: tokens.space[1] },
});
