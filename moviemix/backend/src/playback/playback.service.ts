import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class PlaybackService {
  // Legacy backend auth uses its own JWT_SECRET, while the app signs in with Supabase.
  // Never return the former HMAC URL: Mux cannot verify it and it did not check title rights.
  signUrl(_contentId: string, _userId: string): never {
    throw new NotImplementedException('Use the authenticated Supabase signed-playback function');
  }
}
