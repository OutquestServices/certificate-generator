import React, { useState, useEffect } from "react";
import { TextLayer } from "./CanvasStage";
import { TextControls } from "./TextControls";
import { DesignStage } from "./DesignStage";
import { BulkGenerator } from "./BulkGenerator";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { ImageUploader } from "./ImageUploader";
import { useBaseImage } from "./hooks/useBaseImage";
import { useDragLayers } from "./hooks/useDragLayers";

interface Props {
  searchParamImage?: string;
  baseImageInline?: string;
}

export function Designer({ searchParamImage, baseImageInline }: Props) {
  const initialBaseImageUrl =
    baseImageInline ||
    searchParamImage ||
    "https://res.cloudinary.com/certifier/image/upload/v1730217504/blank_certificate_templates_Certifier_blog_5_2b8da760be.png";
  const { displayImage, loading: imageLoading, error: imageError, setFile: setImageFile } =
    useBaseImage(initialBaseImageUrl);

  const [width] = useState(1200);
  const [height] = useState(675);
  const [texts, setTexts] = useState<TextLayer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const stageContainerRef = React.useRef<HTMLDivElement | null>(null);

  const { stageRef, handlePointerDown, handlePointerMove, handlePointerUp } = useDragLayers(
    texts,
    scale,
    setTexts,
    (id) => setSelected(id)
  );

  const selectedLayer = texts.find((t) => t.id === selected) || null;

  function addText() {
    const id = crypto.randomUUID();
    setTexts((p) => [
      ...p,
      {
        id,
        text: "Sample Text",
        x: 100,
        y: 100,
        fontSize: 48,
        fontFamily: "Arial",
        color: "#111827",
        fontWeight: "600",
      },
    ]);
    setSelected(id);
  }
  function updateLayer(partial: Partial<TextLayer>) {
    setTexts((p) => p.map((t) => (t.id === selected ? { ...t, ...partial } : t)));
  }
  function deleteLayer() {
    if (!selected) return;
    setTexts((p) => p.filter((t) => t.id !== selected));
    setSelected(null);
  }

  function parseCSV(text: string): { headers: string[]; rows: string[][] } {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
    if (!lines.length) return { headers: [], rows: [] };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split(",").map((v) => v.trim()));
    return { headers, rows };
  }
  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvError("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      const { headers, rows } = parseCSV(content);
      const expected = texts.map((_, i) => `field_${i + 1}`);
      if (expected.length === 0) {
        setCsvError("Define at least one text layer before uploading CSV");
        return;
      }
      const mismatch =
        headers.length !== expected.length ||
        headers.some((h, i) => h !== expected[i]);
      if (mismatch) {
        setCsvError(`Header mismatch. Expected: ${expected.join(",")}`);
        setCsvHeaders([]);
        setCsvRows([]);
        return;
      }
      setCsvHeaders(headers);
      setCsvRows(rows);
      setCsvError(null);
    };
    reader.readAsText(file);
  }

  async function generateZip() {
    if (!stageRef.current) return;
    if (csvRows.length === 0) {
      setCsvError("No data rows to generate");
      return;
    }
    setGenerating(true);
    const zip = new JSZip();
    const stageEl = stageRef.current;
    const imgEl = stageEl.querySelector("img");
    if (imgEl && !imgEl.complete)
      await new Promise((r) => {
        imgEl.onload = () => r(null);
        imgEl.onerror = () => r(null);
      });
    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i];
      setTexts((prev) =>
        prev.map((t, idx) => ({ ...t, text: row[idx] || "" }))
      );
      await new Promise((r) => setTimeout(r, 30));
      const canvas = await html2canvas(stageEl, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const data = canvas.toDataURL("image/png");
      const base64 = data.split("base64,")[1];
      const filename =
        (row[0] || `certificate_${i + 1}`).replace(/[^a-z0-9-_]+/gi, "_") +
        ".png";
      zip.file(filename, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "certificates.zip");
    setGenerating(false);
  }

  function generateExcelTemplate() {
    const headers = texts.map((_, i) => `field_${i + 1}`);
    const csv = headers.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "certificate_template_fields.csv";
    a.click();
  }
  async function downloadSampleCertificate() {
    if (!stageRef.current) return;
    const stageEl = stageRef.current;
    const imgEl = stageEl.querySelector("img");
    if (imgEl && !imgEl.complete)
      await new Promise((r) => {
        imgEl.onload = () => r(null);
        imgEl.onerror = () => r(null);
      });
    const canvas = await html2canvas(stageEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, "sample_certificate.png");
    });
  }

  useEffect(() => {
    function compute() {
      if (!stageContainerRef.current) return;
      const aw = stageContainerRef.current.clientWidth;
      const ah =
        window.innerHeight -
        stageContainerRef.current.getBoundingClientRect().top -
        40;
      const s = Math.min(aw / width, ah / height, 1);
      setScale(s <= 0 ? 1 : s);
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [width, height]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 overflow-hidden">
      <h1 className="text-2xl font-semibold tracking-tight">Design Editor</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Add and position dynamic text layers. Drag on the canvas to move a
        layer.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-12 overflow-hidden">
        <div className="lg:col-span-8" ref={stageContainerRef}>
          <ImageUploader
            onFile={setImageFile}
            loading={imageLoading}
            error={imageError}
            width={width}
            height={height}
          />
          <div className="rounded-lg border border-zinc-200 bg-white/70 p-4 dark:border-zinc-700 dark:bg-zinc-800/70 overflow-hidden">
            <DesignStage
              baseImage={displayImage}
              width={width}
              height={height}
              scale={scale}
              texts={texts}
              selectedId={selected}
              stageRef={stageRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onSelect={(id) => setSelected(id)}
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <TextControls
            layer={selectedLayer}
            onChange={updateLayer}
            onAdd={addText}
            onDelete={deleteLayer}
            fields={texts}
            onDownloadSample={downloadSampleCertificate}
          />
          <BulkGenerator
            expectedHeaders={texts.map((_, i) => `field_${i + 1}`)}
            csvHeaders={csvHeaders}
            csvRows={csvRows}
            csvError={csvError}
            generating={generating}
            onDownloadTemplate={generateExcelTemplate}
            onUpload={handleCSVUpload}
            onGenerate={generateZip}
          />
        </div>
      </div>
    </div>
  );
}
