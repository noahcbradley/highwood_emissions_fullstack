"use client"

import { fetchSites, Site } from "@/lib/api";
import NewPadForm from "./components/NewPadForm";
import { useState, useEffect } from "react";

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites()
      .then(setSites)
      .catch(() => setError("Could not load sites"));
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emissions Monitoring Dashboard</h1>
        <p className="text-gray-400">Real-time Emissions</p>
      </header>

      <NewPadForm onCreated={(newSite) => setSites([newSite, ...sites])} />

      {error && <div className="bg-red-800 text-red-200 p-4 rounded mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Site</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Total Emissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">{site.name}</td>
                <td className="px-6 py-4">{site.totalEmissionsToDate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
