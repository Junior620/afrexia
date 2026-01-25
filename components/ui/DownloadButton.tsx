'use client';

import { Download } from 'lucide-react';
import { trackResourceDownload } from '@/lib/analytics';

interface DownloadButtonProps {
  resourceId: string;
  resourceTitle: string;
  resourceCategory?: string;
  fileFormat?: string;
  downloadUrl: string;
  buttonText: string;
  className?: string;
}

/**
 * Download button with analytics tracking
 * Tracks the download event before navigating to the download URL
 */
export function DownloadButton({
  resourceId,
  resourceTitle,
  resourceCategory,
  fileFormat,
  downloadUrl,
  buttonText,
  className = 'flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors',
}: DownloadButtonProps) {
  const handleDownload = () => {
    // Track the download event
    trackResourceDownload({
      resourceId,
      resourceTitle,
      resourceCategory,
      fileFormat,
    });

    // Navigate to download URL
    window.location.href = downloadUrl;
  };

  return (
    <button onClick={handleDownload} className={className}>
      <Download className="w-5 h-5" />
      {buttonText}
    </button>
  );
}
