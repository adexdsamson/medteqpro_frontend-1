export default function MedicalTest() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-medium">Medical Test</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500">Blood Test</td>
              <td className="px-6 py-4 text-sm text-gray-500">10-May-2024</td>
              <td className="px-6 py-4 text-sm text-gray-500">Normal</td>
              <td className="px-6 py-4 text-sm text-gray-500">Completed</td>
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