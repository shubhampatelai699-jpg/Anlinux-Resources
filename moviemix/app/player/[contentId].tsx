import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { getSignedPlaybackUrl } from '@/src/lib/api';
import { tokens } from '@/src/theme/tokens';

const FALLBACK_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function PlayerScreen() {
  const { contentId, episodeId } = useLocalSearchParams<{ contentId: string; episodeId?: string }>();
  const playbackId = episodeId ?? contentId;
  const [source, setSource] = useState<string | null>(null);

  const { error } = useQuery({
    queryKey: ['signed-url', playbackId],
    queryFn: async () => {
      const { url } = await getSignedPlaybackUrl(playbackId);
      setSource(url);
      return url;
    },
    retry: 1,
  });

  // Fall back to the public test stream in dev when Mux credentials are not configured.
  const streamUrl = source ?? (error ? FALLBACK_STREAM : null);

  const player = useVideoPlayer(streamUrl, (p) => {
    p.loop = false;
    p.play();
  });

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
      {streamUrl ? (
        <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
      ) : (
        <Text style={styles.loading}>Loading stream…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.background, justifyContent: 'center' },
  video: { width: '100%', height: 240 },
  loading: { color: tokens.color.textMuted, textAlign: 'center' },
});
