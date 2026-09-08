import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { tokens } from '@/src/theme/tokens';

export default function PlayerScreen() {
  const { contentId } = useLocalSearchParams<{ contentId: string }>();

  const player = useVideoPlayer(
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    (p) => {
      p.loop = false;
      p.play();
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // 10s heartbeat placeholder
      console.log('heartbeat', contentId, player.currentTime);
    }, 10000);
    return () => clearInterval(interval);
  }, [contentId, player]);

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background, justifyContent: 'center' },
  video: { width: '100%', height: 240 },
});
