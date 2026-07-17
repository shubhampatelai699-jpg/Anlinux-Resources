import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface JobEvent {
  status: string;
  progress: number;
  stage: string | null;
}

interface Props {
  jobId: string;
}

const STAGE_LABELS: Record<string, string> = {
  transcription: 'Transcribing audio…',
  diarization: 'Identifying speakers…',
  awaiting_speaker_confirmation: 'Waiting for speaker confirmation…',
  translating: 'Translating…',
  synthesizing: 'Synthesizing voice…',
  mixing: 'Mixing audio…',
  lipsync: 'Applying lip-sync…',
  done: 'Done!',
};

export default function JobProgress({ jobId }: Props) {
  const { t } = useTranslation('common');
  const [event, setEvent] = useState<JobEvent | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('dubkami_token');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/stream`;
    const es = new EventSource(url + (token ? `?token=${token}` : ''));
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        setEvent(JSON.parse(e.data));
      } catch {
        // ignore malformed
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [jobId]);

  if (!event) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <span className="animate-spin w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full" />
        <span>{t('job.connecting')}</span>
      </div>
    );
  }

  const stageKey = Object.keys(STAGE_LABELS).find((k) => event.stage?.startsWith(k));
  const stageLabel = stageKey ? STAGE_LABELS[stageKey] : event.stage ?? '';

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{stageLabel}</span>
        <span>{event.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-brand-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${event.progress}%` }}
        />
      </div>
      {event.status === 'completed' && (
        <p className="text-green-600 font-semibold text-sm">{t('job.completed')}</p>
      )}
      {event.status === 'failed' && (
        <p className="text-red-500 font-semibold text-sm">{t('job.failed')}</p>
      )}
    </div>
  );
}
