import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { ACCEPTED_MIME, MAX_UPLOAD_BYTES } from '@/lib/constants';

interface Props {
  onFile: (file: File) => void;
}

export default function FileUpload({ onFile }: Props) {
  const { t } = useTranslation('common');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        setError(t('upload.rejected'));
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(t('upload.tooLarge'));
        return;
      }
      onFile(file);
    },
    [onFile, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={[
          'flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors',
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-brand-500 hover:bg-brand-50',
        ].join(' ')}
      >
        <input {...getInputProps()} />
        <svg
          className="w-12 h-12 text-brand-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        {isDragActive ? (
          <p className="text-brand-700 font-semibold">{t('upload.dropHere')}</p>
        ) : (
          <>
            <p className="font-semibold text-gray-700">{t('upload.clickOrDrag')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('upload.hint')}</p>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
