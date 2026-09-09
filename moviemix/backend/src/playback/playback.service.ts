import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PlaybackService {
  signUrl(contentId: string, userId: string) {
    const secret = process.env.MUX_TOKEN_SECRET;
    if (!secret) throw new UnauthorizedException('Playback signing not configured');

    const expiration = Math.floor(Date.now() / 1000) + 3600;
    const payload = `${contentId}:${userId}:${expiration}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const tokenId = process.env.MUX_TOKEN_ID;
    const url = `${process.env.CDN_BASE_URL}/${contentId}.m3u8?token=${tokenId}:${signature}:exp=${expiration}`;
    return { url, expiration };
  }
}
