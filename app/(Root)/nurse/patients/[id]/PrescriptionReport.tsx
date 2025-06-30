export default function PrescriptionReport() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-medium">Prescription Report</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
          Add Prescription
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No of Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500">10-May-2024 11:40AM</td>
              <td className="px-6 py-4 text-sm text-gray-500">Paracetamol 500mg</td>
              <td className="px-6 py-4 text-sm text-gray-500">2 Tablet</td>
              <td className="px-6 py-4 text-sm text-gray-500">7</td>
              <td className="px-6 py-4 text-sm text-gray-500">2times daily</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}