import React from 'react';
import { TextLayer } from './CanvasStage';

// simple cache to avoid duplicate link tags
const loadedFonts = new Set<string>();
function loadGoogleFont(familyRaw: string) {
  if (!familyRaw) return;
  // Use only first family if user typed a comma separated list
  const family = familyRaw.split(',')[0].trim();
  if (!family || loadedFonts.has(family)) return;
  const id = 'gf-' + family.replace(/\s+/g, '-').toLowerCase();
  if (document.getElementById(id)) { loadedFonts.add(family); return; }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  // Build Google Fonts v2 URL (will silently 404 if font name invalid)
  const gfName = family.replace(/ /g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(gfName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(family);
}

interface Props {
  layer: TextLayer | null;
  onChange: (partial: Partial<TextLayer>) => void;
  onAdd: () => void;
  onDelete: () => void;
  fields: TextLayer[];
  onDownloadSample: () => void | Promise<void>;
}

export function TextControls({ layer, onChange, onAdd, onDelete, fields, onDownloadSample }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white/70 p-4 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Text Layers</h3>
        <button type="button" onClick={onAdd} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-500">Add Text</button>
      </div>
      <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 max-h-32 overflow-auto pr-1">
        {fields.map(f => (
          <li key={f.id} className={`flex items-center justify-between rounded px-2 py-1 ${layer?.id===f.id ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' : ''}`}>{f.text || '(empty)'}<span className="text-[10px] text-zinc-400">#{f.id.slice(0,4)}</span></li>
        ))}
        {fields.length===0 && <li className="italic text-zinc-400">No layers yet.</li>}
      </ul>
      {layer ? (
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium">Text</label>
            <input value={layer.text} onChange={e=>onChange({ text: e.target.value })} className="w-full rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-700" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-medium">Font Size</label>
              <input type="number" min={6} max={240} value={layer.fontSize} onChange={e=>onChange({ fontSize: parseInt(e.target.value)|| layer.fontSize })} className="w-full rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-700" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium">Color</label>
              <input type="color" value={layer.color} onChange={e=>onChange({ color: e.target.value })} className="h-8 w-full cursor-pointer rounded-md border border-zinc-300 bg-white/70 dark:border-zinc-600 dark:bg-zinc-700" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium">Weight</label>
              <select value={layer.fontWeight} onChange={e=>onChange({ fontWeight: e.target.value })} className="w-full rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-700">
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium">Font Family (type any)</label>
            <div className="flex gap-2">
              <input
                value={layer.fontFamily}
                onChange={e=>onChange({ fontFamily: e.target.value })}
                placeholder="e.g. Roboto"
                className="w-full rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs font-mono outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-700"
              />
              <button
                type="button"
                onClick={()=> loadGoogleFont(layer.fontFamily)}
                className="shrink-0 rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-100 dark:border-indigo-600/40 dark:bg-indigo-600/10 dark:text-indigo-300 dark:hover:bg-indigo-600/20"
              >Load</button>
            </div>
            <p className="mt-1 text-[10px] text-zinc-400">Click Load to fetch from Google Fonts (if available). Then the style applies.</p>
          </div>
          <div className="flex justify-between gap-3">
            <button type="button" onClick={onDelete} className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-600/40 dark:bg-rose-600/10 dark:text-rose-300 dark:hover:bg-rose-600/20">Delete</button>
            <button type="button" onClick={onDownloadSample} className="rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-fuchsia-500">Download Sample Certificate</button>
          </div>
        </div>
      ) : (
        <p className="text-xs italic text-zinc-500">Select a text layer to edit its properties.</p>
      )}
    </div>
  );
}
