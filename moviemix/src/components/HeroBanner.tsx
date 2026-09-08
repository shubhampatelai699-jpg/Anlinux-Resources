import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

const slides = Array.from({ length: 5 }, (_, i) => ({ id: `hero-${i}` }));
const { width } = Dimensions.get('window');

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={() => <View style={styles.slide} />}
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
  slide: { width, height: 220, backgroundColor: tokens.color.surface },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: tokens.space[2] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.color.secondary, marginHorizontal: tokens.space[1] },
  activeDot: { backgroundColor: tokens.color.primary },
});
