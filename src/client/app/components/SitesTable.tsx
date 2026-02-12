import { Site } from "@/lib/api"

type SitesTableProps = {
  sites: Site[]
}

export default function SitesTable({ sites }: SitesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Site</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              % of Emission Limit
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Total Emissions
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Emission Limit
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {sites.map((site) => (
            <tr key={site.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4">{site.name}</td>
              <td className="px-6 py-4">{site.location}</td>
              <td className="px-6 py-4">
                {((site.totalEmissionsToDate / site.emissionLimit) * 100).toFixed(2)}
              </td>
              <td className="px-6 py-4">{site.totalEmissionsToDate.toFixed(2)}</td>
              <td className="px-6 py-4">{site.emissionLimit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
