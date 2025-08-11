import React from 'react';

interface Props {
  expectedHeaders: string[];
  csvHeaders: string[];
  csvRows: string[][];
  csvError: string | null;
  generating: boolean;
  onDownloadTemplate: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}

export function BulkGenerator({ expectedHeaders, csvHeaders, csvRows, csvError, generating, onDownloadTemplate, onUpload, onGenerate }: Props) {
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
    </div>
  );
}
