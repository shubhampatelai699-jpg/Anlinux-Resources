import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/src/store/auth';
import { tokens } from '@/src/theme/tokens';

const menuItems = [
  'Subscription',
  'Downloads',
  'Notifications',
  'Playback Settings',
  'Account',
  'Parental Controls',
  'Help & Support',
  'Terms of Service',
  'Sign Out',
];

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{user?.email ?? 'Guest'}</Text>
      {menuItems.map((item) => (
        <Pressable
          key={item}
          style={styles.item}
          onPress={() => item === 'Sign Out' && signOut()}
        >
          <Text style={styles.itemText}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background },
  title: { fontSize: 24, color: tokens.color.text, padding: tokens.space[4], paddingBottom: tokens.space[1] },
  email: { color: tokens.color.textMuted, paddingHorizontal: tokens.space[4], marginBottom: tokens.space[4] },
  item: {
    padding: tokens.space[4],
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  itemText: { color: tokens.color.text, fontSize: 16 },
});
