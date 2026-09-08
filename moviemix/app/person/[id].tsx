import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/src/theme/tokens';

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>Person {id}</Text>
      <Text style={styles.bio}>Biography placeholder for person details.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: tokens.color.surface, margin: tokens.space[4] },
  name: { fontSize: 24, color: tokens.color.text, marginHorizontal: tokens.space[4] },
  bio: { color: tokens.color.textMuted, margin: tokens.space[4] },
});
