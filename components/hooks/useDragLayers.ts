import { useRef, useCallback } from 'react';
import { TextLayer } from '../CanvasStage';

export function useDragLayers(texts: TextLayer[], scale: number, setTexts: React.Dispatch<React.SetStateAction<TextLayer[]>>, setSelected: (id: string) => void) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const move = useCallback((id: string, x: number, y: number) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  }, [setTexts]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const layer = texts.find(t => t.id === id);
    if (!layer) return;
    dragRef.current = { id, offsetX: x - layer.x, offsetY: y - layer.y };
    setSelected(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const { id, offsetX, offsetY } = dragRef.current;
    move(id, x - offsetX, y - offsetY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return { stageRef, handlePointerDown, handlePointerMove, handlePointerUp, move };
}
