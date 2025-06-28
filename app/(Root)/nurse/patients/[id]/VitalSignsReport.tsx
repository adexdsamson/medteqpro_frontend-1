export default function VitalSignsReport() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-medium">Vital Signs Report</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
          Add New Record
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body Temp (°C)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pulse Rate (B/M)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Pressure (mm/Hg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oxygen Saturation (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500">10-May-2024 11:40AM</td>
              <td className="px-6 py-4 text-sm text-gray-500">37</td>
              <td className="px-6 py-4 text-sm text-gray-500">74</td>
              <td className="px-6 py-4 text-sm text-gray-500">119/78</td>
              <td className="px-6 py-4 text-sm text-gray-500">94</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <button className="text-blue-500">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}