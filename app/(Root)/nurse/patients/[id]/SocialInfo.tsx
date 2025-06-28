export default function SocialInfo() {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-base font-medium mb-4">Social Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Do you smoke?</p>
          <p className="text-sm font-medium">No</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Do you drink alcohol?</p>
          <p className="text-sm font-medium">No</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Any history of illegal drug?</p>
          <p className="text-sm font-medium">No</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Do you exercise?</p>
          <p className="text-sm font-medium">No</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Are you on any special diet?</p>
          <p className="text-sm font-medium">No</p>
        </div>
      </div>
    </div>
  );
}