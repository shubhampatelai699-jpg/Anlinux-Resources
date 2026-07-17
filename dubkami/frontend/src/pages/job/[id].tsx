import React, { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import JobProgress from '@/components/JobProgress';
import SpeakerConfirmation from '@/components/SpeakerConfirmation';
import api from '@/lib/api';

interface Speaker {
  id: string;
  label: string;
  display_name: string | null;
  voice_id: string | null;
  confirmed: boolean;
}

interface Output {
  language: string;
  format: string;
  download_url: string;
}

export default function JobPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { t } = useTranslation('common');

  const [status, setStatus] = useState<string>('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [outputs, setOutputs] = useState<Output[]>([]);

  // Poll job status every 3s to drive UI state switches
  useEffect(() => {
    if (!id) return;
    const poll = async () => {
      try {
        const { data } = await api.get(`/api/jobs/${id}`);
        setStatus(data.status);
        if (data.status === 'awaiting_speaker_confirmation') {
          const { data: sp } = await api.get(`/api/speakers/job/${id}`);
          setSpeakers(sp);
        }
        if (data.status === 'completed') {
          const { data: outs } = await api.get(`/api/jobs/${id}/outputs`);
          setOutputs(outs);
        }
      } catch {
        // ignore transient errors
      }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!id) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-700">Dubkami</h1>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 space-y-8">
        <h2 className="text-xl font-semibold text-gray-800">{t('job.title')}</h2>
        <p className="text-xs text-gray-400 font-mono break-all">{id}</p>

        {/* Progress bar for all non-terminal states */}
        {status && status !== 'completed' && status !== 'failed' && (
          <JobProgress jobId={id} />
        )}

        {/* Speaker confirmation step */}
        {status === 'awaiting_speaker_confirmation' && speakers.length > 0 && (
          <SpeakerConfirmation
            jobId={id}
            speakers={speakers}
            onConfirmed={() => setStatus('processing')}
          />
        )}

        {/* Completed – show download links */}
        {status === 'completed' && outputs.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">{t('job.downloads')}</h3>
            {outputs.map((o) => (
              <a
                key={o.language}
                href={o.download_url}
                download
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-500 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {o.language.toUpperCase()} &mdash; .{o.format}
                </span>
                <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {t('job.failedMessage')}
          </div>
        )}

        <button
          onClick={() => router.push('/')}
          className="text-sm text-brand-500 hover:underline"
        >
          ← {t('job.newJob')}
        </button>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
