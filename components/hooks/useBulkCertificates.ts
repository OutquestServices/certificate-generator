import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { generateToken } from "@/lib/jwttoken";
import { TextLayer } from "@/components/CanvasStage";

interface SendResult { email: string; result: boolean }

export function useBulkCertificates(params: {
  texts: TextLayer[];
  setTexts: React.Dispatch<React.SetStateAction<TextLayer[]>>;
  stageRef: React.RefObject<HTMLDivElement>;
  sessionEmail?: string | null;
}) {
  const { texts, setTexts, stageRef, sessionEmail } = params;
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

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
      const expected = ["email", ...texts.map((_, i) => `field_${i + 1}`)];
      if (texts.length === 0) {
        setCsvError("Define at least one text layer before uploading CSV");
        return;
      }
      const mismatch = headers.length !== expected.length || headers.some((h, i) => h !== expected[i]);
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
      setTexts((prev) => prev.map((t, idx) => ({ ...t, text: row[idx + 1] || "" })));
      await new Promise((r) => setTimeout(r, 30));
      const canvas = await html2canvas(stageEl, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const data = canvas.toDataURL("image/png");
      const base64 = data.split("base64,")[1];
      const filename = (row[1] || row[0] || `certificate_${i + 1}`).replace(/[^a-z0-9-_]+/gi, "_") + ".png";
      zip.file(filename, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "certificates.zip");
    setGenerating(false);
  }

  function generateTemplate() {
    const headers = ["email", ...texts.map((_, i) => `field_${i + 1}`)];
    const csv = headers.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "certificate_template_fields.csv";
    a.click();
  }

  async function downloadSample(stageRefLocal?: React.RefObject<HTMLDivElement>) {
    const ref = stageRefLocal || stageRef;
    if (!ref.current) return;
    const stageEl = ref.current;
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
    canvas.toBlob((blob) => { if (blob) saveAs(blob, "sample_certificate.png"); });
  }

  async function sendEmails(payload: { from: string; subject: string; body: string }): Promise<{ ok: boolean; message: string; results?: SendResult[] }> {
    if (!csvFile) return { ok: false, message: "Upload CSV first." };
    if (!payload.from || !payload.subject || !payload.body) return { ok: false, message: "All fields required." };
    const token = generateToken({ email: sessionEmail }, 60);
    if (!token) return { ok: false, message: "Not authenticated." };
    try {
      const fd = new FormData();
      fd.append("from", payload.from.trim());
      fd.append("subject", payload.subject.trim());
      fd.append("body", payload.body);
      fd.append("file", csvFile, csvFile.name);
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const j: any = await res.json().catch(() => ({}));
      return { ok: res.ok, message: j.message || (res.ok ? "Emails sent." : "Failed to send emails."), results: Array.isArray(j.results) ? j.results : undefined };
    } catch {
      return { ok: false, message: "Network error." };
    }
  }

  return {
    csvHeaders,
    csvRows,
    csvError,
    generating,
    handleCSVUpload,
    generateZip,
    generateTemplate,
    downloadSample,
    sendEmails,
  };
}
