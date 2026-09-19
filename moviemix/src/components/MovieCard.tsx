import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/src/theme/tokens';

export function MovieCard({
  compact = false,
  title,
  posterUrl,
  href,
}: {
  compact?: boolean;
  title?: string;
  posterUrl?: string | null;
  href?: string;
}) {
  const router = useRouter();
  return (
    <Pressable
      style={[styles.card, compact && styles.compact]}
      onPress={href ? () => router.push(href as never) : undefined}
    >
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
