import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

export type HeroItem = { id: string; title: string; backdrop_url: string | null };

export function HeroBanner({ items }: { items?: HeroItem[] }) {
  const slides = items?.length ? items.slice(0, 5) : Array.from({ length: 5 }, (_, i) => ({ id: `hero-${i}`, title: '', backdrop_url: null }));
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {item.backdrop_url ? (
              <Image source={{ uri: item.backdrop_url }} style={styles.image} />
            ) : null}
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { width, height: 240, backgroundColor: tokens.color.surface, justifyContent: 'flex-end' },
  image: { ...StyleSheet.absoluteFillObject, width, height: 240 },
  title: { color: tokens.color.text, fontSize: 20, fontWeight: '700', padding: tokens.space[4], zIndex: 1 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: tokens.space[2] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.color.secondary, marginHorizontal: tokens.space[1] },
  activeDot: { backgroundColor: tokens.color.primary },
});
