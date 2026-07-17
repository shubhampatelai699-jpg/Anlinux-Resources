import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface Job {
  id: string;
  original_filename: string;
  status: string;
  source_language: string;
  target_languages: string[];
  progress: number;
  created_at: string;
}

interface Props {
  jobs: Job[];
  studioId: string;
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
  queued: 'bg-yellow-100 text-yellow-700',
  uploading: 'bg-purple-100 text-purple-700',
  pending: 'bg-gray-100 text-gray-600',
};

export default function ProjectList({ jobs, studioId }: Props) {
  const { t } = useTranslation('common');

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">{t('studios.projects.noJobs')}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors text-sm"
        >
          {t('studios.projects.startJob')}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
            <th className="py-3 pr-4">{t('studios.projects.file')}</th>
            <th className="py-3 pr-4">{t('studios.projects.status')}</th>
            <th className="py-3 pr-4">{t('studios.projects.languages')}</th>
            <th className="py-3 pr-4">{t('studios.projects.progress')}</th>
            <th className="py-3">{t('studios.projects.created')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <Link
                  href={`/job/${job.id}`}
                  className="text-brand-600 hover:underline font-medium truncate max-w-xs block"
                  title={job.original_filename}
                >
                  {job.original_filename}
                </Link>
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    STATUS_COLORS[job.status] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-600">
                {job.source_language.toUpperCase()} → {job.target_languages.map((l) => l.toUpperCase()).join(', ')}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{job.progress}%</span>
                </div>
              </td>
              <td className="py-3 text-gray-400 text-xs">
                {new Date(job.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
