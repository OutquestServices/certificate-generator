import React, { useState } from 'react';

interface Props {
  expectedHeaders: string[];
  csvHeaders: string[];
  csvRows: string[][];
  csvError: string | null;
  generating: boolean;
  onDownloadTemplate: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  onSendEmails?: (payload: { from: string; subject: string; body: string }) => Promise<{ ok: boolean; message: string; results?: { email: string; result: boolean }[] }>;
}

export function BulkGenerator({ expectedHeaders, csvHeaders, csvRows, csvError, generating, onDownloadTemplate, onUpload, onGenerate, onSendEmails }: Props) {
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<string | null>(null);
  const [results, setResults] = useState<{ email: string; result: boolean }[] | null>(null);

  async function handleSend() {
    if (!onSendEmails) return;
    setSending(true);
    setSendMsg(null);
    setResults(null);
    const res = await onSendEmails({ from, subject, body });
    setSendMsg(res.message);
    if (res.results) setResults(res.results as any);
    setSending(false);
  }

  function downloadResultsCsv() {
    if (!results) return;
    const header = 'email,status';
    const rows = results.map(r => `${r.email},${r.result ? 'Success' : 'Failed'}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'email_send_results.csv';
    a.click();
  }

  return (
    <div className="mt-6 space-y-3 rounded-lg border border-zinc-200 bg-white/70 p-4 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Bulk Certificates</h3>
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-100 dark:border-indigo-600/40 dark:bg-indigo-600/10 dark:text-indigo-300 dark:hover:bg-indigo-600/20"
        >Download Template</button>
      </div>
      <p className="text-[11px] text-zinc-500">1. Create text layers (field_1..n). 2. Download template. 3. Fill CSV. 4. Upload to generate ZIP.</p>
      <input
        type="file"
        accept=".csv"
        onChange={onUpload}
        className="w-full cursor-pointer rounded-md border border-dashed border-zinc-300 bg-white/60 px-2 py-2 text-[11px] dark:border-zinc-600 dark:bg-zinc-700"
      />
      {csvError && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{csvError}</p>}
      {csvHeaders.length>0 && (
        <div className="rounded bg-zinc-100 p-2 text-[10px] dark:bg-zinc-700/50">
          <p className="font-medium">Headers OK:</p>
          <p className="break-all">{csvHeaders.join(', ')}</p>
          <p className="mt-1">Rows: {csvRows.length}</p>
        </div>
      )}
      <button
        type="button"
        disabled={generating || csvRows.length===0}
        onClick={onGenerate}
        className={`w-full rounded-md px-3 py-2 text-[11px] font-medium text-white shadow ${generating || csvRows.length===0 ? 'bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
      >{generating ? 'Generating...' : 'Generate ZIP'}</button>
      {expectedHeaders.length>0 && (
        <p className="text-[10px] text-zinc-400">Expected headers: {expectedHeaders.join(', ')}</p>
      )}
      <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700" />
      <h4 className="text-sm font-semibold">Send Emails</h4>
      <p className="text-[10px] text-zinc-500">Provide a verified From email, subject and message body, then send certificates to emails in the uploaded CSV.</p>
      <input
        type="email"
        placeholder="From (verified email)"
        value={from}
        onChange={e=>setFrom(e.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white/60 px-2 py-2 text-[11px] outline-none focus:ring focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-700"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e=>setSubject(e.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white/60 px-2 py-2 text-[11px] outline-none focus:ring focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-700"
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={e=>setBody(e.target.value)}
        rows={4}
        className="w-full resize-y rounded-md border border-zinc-300 bg-white/60 px-2 py-2 text-[11px] outline-none focus:ring focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-700"
      />
      <button
        type="button"
        disabled={sending || !onSendEmails || csvRows.length===0}
        onClick={handleSend}
        className={`w-full rounded-md px-3 py-2 text-[11px] font-medium text-white shadow ${sending || csvRows.length===0 || !onSendEmails ? 'bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
      >{sending ? 'Sending...' : 'Send Emails'}</button>
      {sendMsg && (<p className="text-[11px] mt-1 font-medium text-zinc-600 dark:text-zinc-300">{sendMsg}</p>)}
      {results && results.length > 0 && (
        <button
          type="button"
          onClick={downloadResultsCsv}
          className="w-full rounded-md mt-2 px-3 py-2 text-[11px] font-medium text-white shadow bg-blue-600 hover:bg-blue-500"
        >Download Results CSV</button>
      )}
    </div>
  );
}
