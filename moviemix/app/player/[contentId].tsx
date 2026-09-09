import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { tokens } from '@/src/theme/tokens';

export default function PlayerScreen() {
  const { contentId, episodeId } = useLocalSearchParams<{ contentId: string; episodeId?: string }>();

  const player = useVideoPlayer(
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    (p) => {
      p.loop = false;
      p.play();
    }
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      await supabase.functions.invoke('heartbeat', {
        body: {
          movieId: episodeId ? undefined : contentId,
          episodeId,
          positionSeconds: Math.floor(player.currentTime ?? 0),
          completed: false,
        },
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [contentId, episodeId, player]);

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
