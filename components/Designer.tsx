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
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/jwttoken";

interface Props {
  searchParamImage?: string;
  baseImageInline?: string;
}

export function Designer({ searchParamImage, baseImageInline }: Props) {
  const initialBaseImageUrl =
    baseImageInline ||
    searchParamImage ||
    "https://res.cloudinary.com/certifier/image/upload/v1730217504/blank_certificate_templates_Certifier_blog_5_2b8da760be.png";
  const {
    displayImage,
    loading: imageLoading,
    error: imageError,
    setFile: setImageFile,
  } = useBaseImage(initialBaseImageUrl);

  const [width] = useState(1200);
  const [height] = useState(675);
  const [texts, setTexts] = useState<TextLayer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const stageContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [mappings, setMappings] = useState<{ email: string; file: File }[]>([]);

  const { stageRef, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragLayers(texts, scale, setTexts, (id) => setSelected(id));

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
    setTexts((p) =>
      p.map((t) => (t.id === selected ? { ...t, ...partial } : t))
    );
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
    setCsvFile(file);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvError("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      const { headers, rows } = parseCSV(content);
      // include email as first expected header
      const expected = ["email", ...texts.map((_, i) => `field_${i + 1}`)];
      if (texts.length === 0) {
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
      // row[0] is email (reference) so shift by 1 for text layers
      setTexts((prev) =>
        prev.map((t, idx) => ({ ...t, text: row[idx + 1] || "" }))
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
        (row[1] || row[0] || `certificate_${i + 1}`).replace(
          /[^a-z0-9-_]+/gi,
          "_"
        ) + ".png";
      zip.file(filename, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "certificates.zip");
    setGenerating(false);
  }

  async function saveCertificates(): Promise<
    { email: string; file: File }[] | null
  > {
    if (!stageRef.current) return null;
    if (csvRows.length === 0) {
      setCsvError("No data rows to generate");
      return null;
    }
    setSaving(true);
    const stageEl = stageRef.current;
    const imgEl = stageEl.querySelector("img");
    if (imgEl && !imgEl.complete) {
      await new Promise((r) => {
        imgEl.onload = () => r(null);
        imgEl.onerror = () => r(null);
      });
    }

    const newMappings: { email: string; file: File }[] = [];

    try {
      for (let i = 0; i < csvRows.length; i++) {
        const row = csvRows[i];
        // row[0] = email; shift by 1 for text layers
        setTexts((prev) =>
          prev.map((t, idx) => ({ ...t, text: row[idx + 1] || "" }))
        );
        // allow React to paint updated texts
        await new Promise((r) => setTimeout(r, 30));

        const canvas = await html2canvas(stageEl, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const blob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Blob failed"))),
            "image/png"
          )
        );

        const uuid = crypto.randomUUID();
        const file = new File([blob], `${uuid}.png`, { type: "image/png" });

        newMappings.push({ email: row[0], file });
      }

      setMappings(newMappings);
      return newMappings;
    } catch (e) {
      console.error(e);
      setCsvError("Failed during upload.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  function generateExcelTemplate() {
    const headers = ["email", ...texts.map((_, i) => `field_${i + 1}`)];
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

  async function sendEmails(payload: {
    from: string;
    subject: string;
    body: string;
  }): Promise<{
    ok: boolean;
    message: string;
    results?: { email: string; result: boolean }[];
  }> {
    if (!csvFile) return { ok: false, message: "Upload CSV first." };
    if (!payload.from || !payload.subject || !payload.body)
      return { ok: false, message: "All fields required." };
    const token = generateToken({ email: session?.user?.email }, 60);
    if (!token) return { ok: false, message: "Not authenticated." };

    const emails = csvRows.map((row) => row[0]);
    try {
      const fd = new FormData();
      fd.append("from", payload.from.trim());
      fd.append("subject", payload.subject.trim());
      fd.append("body", payload.body);
      // Send files + separate JSON metadata (cannot JSON.stringify File objects)
      mappings.forEach((m, i) => {
        fd.append("files", m.file, m.file.name); // backend can read all under 'files'
      });

      // Metadata without the File object
      fd.append(
        "mappings",
        JSON.stringify(
          mappings.map((m, i) => ({
            index: i,
            email: m.email,
            fileName: m.file.name,
          }))
        )
      );
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const j: any = await res.json().catch(() => ({}));
      return {
        ok: res.ok,
        message:
          j.message || (res.ok ? "Emails sent." : "Failed to send emails."),
        results: Array.isArray(j.results) ? j.results : undefined,
      };
    } catch {
      return { ok: false, message: "Network error." };
    }
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
            expectedHeaders={[
              "email",
              ...texts.map((_, i) => `field_${i + 1}`),
            ]}
            csvHeaders={csvHeaders}
            csvRows={csvRows}
            csvError={csvError}
            generating={generating}
            saving={saving}
            onDownloadTemplate={generateExcelTemplate}
            onUpload={handleCSVUpload}
            onGenerate={generateZip}
            onSendEmails={sendEmails}
            onSaveCertificates={saveCertificates}
          />
        </div>
      </div>
    </div>
  );
}
