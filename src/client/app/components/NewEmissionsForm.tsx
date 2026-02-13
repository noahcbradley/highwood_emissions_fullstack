"use client"

import { useState } from "react"
import { createEmissions, SiteEmission, Site } from "@/lib/api"

type Props = {
  sites: Site[]
  onSuccess?: () => void
}

export default function NewEmissionsForm({ sites, onSuccess }: Props) {
  const [csv, setCsv] = useState("")
  const [numRecords, setNumRecords] = useState(10)
  const [numRecordsTouched, setNumRecordsTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isNumRecordsInvalid = numRecords < 1 || numRecords > 100

  const parseCsv = (text: string): SiteEmission[] => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)

    const dataLines = lines[0].toLowerCase().includes("siteid")
      ? lines.slice(1)
      : lines

    return dataLines.map((line, index) => {
      const [siteId, value, timestamp] = line.split(",")

      if (!siteId || !value || !timestamp) {
        throw new Error(`Invalid CSV format on line ${index + 1}`)
      }

      const parsedValue = Number(value)
      if (Number.isNaN(parsedValue)) {
        throw new Error(`Invalid value on line ${index + 1}`)
      }

      return {
        siteId: siteId.trim(),
        value: parsedValue,
        timestamp: timestamp.trim(),
      }
    })
  }

  const handleSubmit = async () => {
    if (isNumRecordsInvalid) return

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const readings = parseCsv(csv)

      if (readings.length === 0) {
        throw new Error("No valid readings found")
      }

      await createEmissions(readings)

      setSuccess(`Successfully ingested ${readings.length} readings`)
      setCsv("")
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const generateRandomData = () => {
    if (isNumRecordsInvalid) return

    if (sites.length === 0) {
      setError("No sites available to generate data")
      return
    }

    const generated: string[] = []
    const count = numRecords

    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000

    for (let i = 0; i < count; i++) {
      const site = sites[Math.floor(Math.random() * sites.length)]
      const value = (Math.random() * 5).toFixed(2)
      const timestamp = new Date(now - Math.random() * oneDayMs).toISOString()

      generated.push(`${site.id},${value},${timestamp}`)
    }

    setCsv(generated.join("\n"))
    setError(null)
    setSuccess(`Generated ${generated.length} random readings`)
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Manual Emissions Ingestion
      </h2>

      <div className="flex items-center space-x-2 mb-1">
        <label className="text-gray-200 text-sm" htmlFor="numRecords">
          # of Records:
        </label>

        <input
          id="numRecords"
          type="number"
          min={1}
          max={100}
          value={numRecords}
          onChange={(e) => setNumRecords(Number(e.target.value))}
          onBlur={() => setNumRecordsTouched(true)}
          className={`w-16 p-1 rounded bg-gray-700 text-white text-sm
            focus:outline-none focus:ring-2
            ${
              numRecordsTouched && isNumRecordsInvalid
                ? "border border-red-500 focus:ring-red-500"
                : "border border-gray-600 focus:ring-green-500"
            }`}
        />

        <button
          type="button"
          onClick={generateRandomData}
          disabled={isNumRecordsInvalid}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded text-white font-medium"
        >
          Generate Data
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || isNumRecordsInvalid}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded text-white font-medium"
        >
          {loading ? "Ingesting..." : "Ingest"}
        </button>
      </div>

      {numRecordsTouched && isNumRecordsInvalid && (
        <p className="text-red-400 text-xs">
          Number of records must be between 1 and 100
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={`siteId,value,timestamp
cmlib2pp30000sss48vppgkz3,1.69,2023-04-12T12:42:02.000Z`}
          rows={8}
          className="w-full p-3 rounded bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}
    </div>
  )
}
