"use client";

import { useState } from "react";
import { createEmissions, SiteEmission } from "@/lib/api";

export default function NewEmissionsForm() {
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parseCsv = (text: string): SiteEmission[] => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const dataLines =
      lines[0].toLowerCase().includes("siteid") ? lines.slice(1) : lines;

    return dataLines.map((line, index) => {
      const [siteId, value, timestamp] = line.split(",");

      if (!siteId || !value || !timestamp) {
        throw new Error(`Invalid CSV format on line ${index + 1}`);
      }

      const parsedValue = Number(value);
      if (Number.isNaN(parsedValue)) {
        throw new Error(`Invalid value on line ${index + 1}`);
      }

      return {
        siteId: siteId.trim(),
        value: parsedValue,
        timestamp: timestamp.trim(),
      };
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const readings = parseCsv(csv);

      if (readings.length === 0) {
        throw new Error("No valid readings found");
      }

      await createEmissions(readings);

      setSuccess(`Successfully ingested ${readings.length} readings`);
      setCsv("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Manual Emissions Ingestion
      </h2>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder={`siteId,value,timestamp
cmlib2pp30000sss48vppgkz3,1.69,2023-04-12 12:42:02.000`}
        rows={8}
        className="w-full p-3 rounded bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded text-white font-medium"
      >
        {loading ? "Ingesting..." : "Ingest"}
      </button>
    </div>
  );
}
