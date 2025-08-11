import React, { useRef, useEffect } from 'react';

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight?: string;
}

interface Props {
  baseImage: string | null;
  texts: TextLayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  width: number;
  height: number;
}

export function CanvasStage({ baseImage, texts, selectedId, onSelect, onMove, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0,0,width,height);
      if (imgRef.current) ctx.drawImage(imgRef.current, 0,0,width,height);
      texts.forEach(t => {
        ctx.font = `${t.fontWeight || '400'} ${t.fontSize}px ${t.fontFamily}`;
        ctx.fillStyle = t.color; ctx.textAlign = 'left'; ctx.fillText(t.text, t.x, t.y);
        if (t.id === selectedId) {
          const metrics = ctx.measureText(t.text || ' '); const h = t.fontSize; const w = metrics.width; ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 1; ctx.strokeRect(t.x, t.y - h, w, h*1.2);
        }
      });
    };

    if (baseImage) {
      if (!imgRef.current) { imgRef.current = new Image(); imgRef.current.crossOrigin = 'anonymous'; imgRef.current.onload = draw; imgRef.current.src = baseImage; }
      else if (imgRef.current.src !== baseImage) { imgRef.current.onload = draw; imgRef.current.src = baseImage; } else draw();
    } else draw();

    const hitTest = (px: number, py: number): { id: string; offX: number; offY: number } | null => {
      for (let i = texts.length -1; i >=0; i--) {
        const t = texts[i];
        ctx.font = `${t.fontWeight || '400'} ${t.fontSize}px ${t.fontFamily}`;
        const w = ctx.measureText(t.text || ' ').width; const h = t.fontSize;
        const left = t.x; const top = t.y - h;
        if (px>=left && px<=left+w && py>=top && py<= top + h*1.2) {
          return { id: t.id, offX: px - t.x, offY: py - t.y };
        }
      }
      return null;
    };

    let dragging: { id: string; offX: number; offY: number } | null = null;

    const pointerDown = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left; const y = clientY - rect.top;
      const hit = hitTest(x, y);
      if (hit) { dragging = hit; onSelect(hit.id); canvas.style.cursor = 'grabbing'; }
      else { onSelect(''); }
    };

    const pointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left; const y = clientY - rect.top;
      if (dragging) {
        onMove(dragging.id, x - dragging.offX, y - dragging.offY);
      } else {
        const hit = hitTest(x, y);
        canvas.style.cursor = hit ? 'move' : 'default';
      }
    };

    const pointerUp = () => { if (dragging) { dragging = null; canvas.style.cursor = 'default'; draw(); } };

    const mousedown = (e: MouseEvent) => pointerDown(e.clientX, e.clientY);
    const mousemove = (e: MouseEvent) => pointerMove(e.clientX, e.clientY);
    const mouseup = () => pointerUp();

    canvas.addEventListener('mousedown', mousedown);
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    const touchstart = (e: TouchEvent) => { if (e.touches.length>0){ const t = e.touches[0]; pointerDown(t.clientX, t.clientY); } };
    const touchmove = (e: TouchEvent) => { if (e.touches.length>0){ const t = e.touches[0]; pointerMove(t.clientX, t.clientY); } };
    const touchend = () => pointerUp();

    canvas.addEventListener('touchstart', touchstart, { passive: true });
    canvas.addEventListener('touchmove', touchmove, { passive: true });
    canvas.addEventListener('touchend', touchend);

    draw();

    return () => {
      canvas.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      canvas.removeEventListener('touchstart', touchstart);
      canvas.removeEventListener('touchmove', touchmove);
      canvas.removeEventListener('touchend', touchend);
    };
  }, [baseImage, texts, selectedId, width, height, onMove, onSelect]);

  return <canvas id="design-canvas" ref={canvasRef} width={width} height={height} className="w-full max-w-full rounded-lg border border-zinc-300 bg-white shadow dark:border-zinc-700 dark:bg-zinc-800 select-none touch-none" />;
}
