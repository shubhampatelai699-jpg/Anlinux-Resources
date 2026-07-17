import React, { useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import FileUpload from '@/components/FileUpload';
import { SourceLanguageSelector, TargetLanguageSelector } from '@/components/LanguageSelector';
import api from '@/lib/api';

export default function HomePage() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLangs, setTargetLangs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Derive RTL from current locale
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(i18n.language);

  const handleSubmit = async () => {
    if (!file || !sourceLang || targetLangs.length === 0) {
      setError(t('form.incomplete'));
      return;
    }
    setError(null);
    setUploading(true);

    try {
      // 1. Create job and get presigned upload URL
      const { data } = await api.post('/api/jobs/', {
        original_filename: file.name,
        file_type: file.type.startsWith('video') ? 'video' : 'audio',
        file_size_bytes: file.size,
        source_language: sourceLang,
        target_languages: targetLangs,
      });

      const { job_id, upload_url, upload_fields } = data;

      // 2. Upload directly to S3 via presigned POST (chunked via FormData)
      const formData = new FormData();
      Object.entries(upload_fields as Record<string, string>).forEach(([k, v]) =>
        formData.append(k, v)
      );
      formData.append('file', file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error('Upload failed')));
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      // 3. Tell the backend to start processing
      await api.post(`/api/jobs/${job_id}/start`);

      // 4. Navigate to job status page
      router.push(`/job/${job_id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? err.message ?? t('form.error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-700 tracking-tight">Dubkami</h1>
        <p className="mt-2 text-gray-500 text-lg">{t('home.tagline')}</p>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 space-y-8">
        {/* Upload area */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t('home.uploadSection')}
          </h2>
          <FileUpload onFile={setFile} />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              ✓ <strong>{file.name}</strong> ({(file.size / 1_000_000).toFixed(1)} MB)
            </p>
          )}
        </section>

        {/* Language selection */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t('home.languageSection')}
          </h2>
          <SourceLanguageSelector
            value={sourceLang}
            onChange={setSourceLang}
            label={t('language.source')}
          />
          <TargetLanguageSelector
            value={targetLangs}
            onChange={setTargetLangs}
            label={t('language.targets')}
            exclude={sourceLang}
          />
        </section>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Upload progress */}
        {uploading && uploadProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('upload.uploading')}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={uploading || !file}
          className="w-full py-3 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-colors text-lg"
        >
          {uploading ? t('home.processing') : t('home.dubNow')}
        </button>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
