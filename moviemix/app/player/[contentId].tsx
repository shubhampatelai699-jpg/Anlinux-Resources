import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { getSignedPlaybackUrl } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

export default function PlayerScreen() {
  const { contentId, episodeId } = useLocalSearchParams<{ contentId: string; episodeId?: string }>();
  const { data, error } = useQuery({
    queryKey: ['signed-url', contentId, episodeId],
    queryFn: () => getSignedPlaybackUrl(contentId, episodeId),
    retry: 1,
  });
  const streamUrl = data?.url ?? null;

  const player = useVideoPlayer(streamUrl, (p) => {
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    if (!streamUrl) return;
    const interval = setInterval(async () => {
      const positionSeconds = Math.floor(player.currentTime ?? 0);
      if (!Number.isFinite(positionSeconds) || positionSeconds < 0) return;
      await supabase.functions.invoke('heartbeat', {
        body: {
          movieId: episodeId ? undefined : contentId,
          episodeId,
          positionSeconds,
          completed: false,
        },
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [contentId, episodeId, player, streamUrl]);

  return (
    <View style={styles.container}>
      {streamUrl ? (
        <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
      ) : (
        <Text style={styles.loading}>{error ? 'Playback unavailable. Please try again later.' : 'Loading stream…'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background, justifyContent: 'center' },
  video: { width: '100%', height: 240 },
  loading: { color: tokens.color.textMuted, textAlign: 'center' },
});
