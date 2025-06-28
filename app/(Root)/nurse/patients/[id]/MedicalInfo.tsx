export default function MedicalInfo() {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-base font-medium mb-4">Medical Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Medication / Dosage / Frequency</p>
          <p className="text-sm font-medium">P-Alaxin / 6 Tablets / Daily</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Any Allergies to Medication or Food (list reactions)?</p>
          <p className="text-sm font-medium">N/A</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Family Medical History</p>
          <p className="text-sm font-medium">High blood pressure</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Hereditary Disease</p>
          <p className="text-sm font-medium">N/A</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Surgery History</p>
          <p className="text-sm font-medium">N/A</p>
        </div>
      </div>
    </div>
  );
}