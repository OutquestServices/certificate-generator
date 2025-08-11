import { useEffect, useState } from 'react';

export function useBaseImage(initialUrl: string) {
  const [baseImageUrl, setBaseImageUrl] = useState(initialUrl);
  const [displayImage, setDisplayImage] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let revoked: string | null = null;
    async function load() {
      setLoading(true); setError(null);
      try {
        if (/^(blob:|data:)/.test(baseImageUrl)) { setDisplayImage(baseImageUrl); return; }
        const res = await fetch(baseImageUrl, { mode: 'cors' });
        if (!res.ok) throw new Error('Fetch failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        revoked = url;
        setDisplayImage(url);
      } catch {
        setDisplayImage(baseImageUrl);
        if (!/^(blob:|data:)/.test(baseImageUrl)) setError('Could not load remote image (CORS or network) – using direct URL');
      } finally { setLoading(false); }
    }
    load();
    return () => { if (revoked) URL.revokeObjectURL(revoked); };
  }, [baseImageUrl]);

  function setFile(file: File) {
    const allowed = ['image/jpeg','image/png','image/webp','image/avif'];
    if (!allowed.includes(file.type)) { setError('Unsupported file type. Use JPG, PNG, WEBP, or AVIF.'); return; }
    setError(null);
    const url = URL.createObjectURL(file);
    setBaseImageUrl(url);
  }

  return { baseImageUrl, displayImage, loading, error, setFile, setBaseImageUrl };
}
