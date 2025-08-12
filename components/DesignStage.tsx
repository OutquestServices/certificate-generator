import React from "react";
import Image from 'next/image';
import { TextLayer } from "./CanvasStage";

interface Props {
  baseImage: string;
  width: number;
  height: number;
  scale: number;
  texts: TextLayer[];
  selectedId: string | null;
  stageRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onSelect: (id: string) => void;
}

export function DesignStage({ baseImage, width, height, scale, texts, selectedId, stageRef, onPointerDown, onPointerMove, onPointerUp }: Props) {
  return (
    <div className="mx-auto inline-block" style={{ padding: 2, background: '#f5f5f5', borderRadius: 4 }}>
      <div
        id="design-stage"
        ref={stageRef}
        className="relative select-none"
        style={{
          width: width * scale,
          height: height * scale,
          border: '1px solid #000',
          boxSizing: 'content-box',
          background: '#fff',
          position: 'relative'
        }}
      >
        <Image
          src={baseImage}
          alt="Base"
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="absolute inset-0 object-contain pointer-events-none select-none"
          draggable={false}
          priority={false}
        />
        {texts.map(t => {
          const isSelected = t.id === selectedId;
          return (
            <div
              key={t.id}
              role="textbox"
              tabIndex={0}
              onPointerDown={e => onPointerDown(e, t.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute cursor-move whitespace-pre"
              style={{
                left: t.x * scale,
                top: t.y * scale,
                fontSize: t.fontSize * scale,
                fontFamily: t.fontFamily,
                fontWeight: t.fontWeight,
                color: t.color,
                lineHeight: 1.1,
                background: 'transparent',
                userSelect: 'none',
                transformOrigin: 'top left',
                outline: isSelected ? '2px solid #6366f1' : 'none',
                boxShadow: isSelected ? '0 0 0 2px #ffffff, 0 0 0 4px #6366f1' : 'none',
                borderRadius: 2,
                padding: 0
              }}
            >
              {t.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
