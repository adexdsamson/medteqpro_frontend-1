import Image from "next/image";

export default function PersonalInformation() {
  return (
    <div className="space-y-4 flex flex-col gap-10 md:flex-row-reverse">
      <div className="bg-[white] rounded-lg p-2.5 h-max">
        <div className="bg-[#F1F4F8] rounded-lg p-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100">
              <Image
                src="/avatar.png"
                alt="Patient"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Patient Contact</p>
              <p className="text-sm font-medium">Oluwatosin Chidimma Aminah</p>
            </div>
          </div>
          <p className="text-sm font-medium text-text-primary ml-2">09078764478</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 flex-1">
        <h2 className="text-base font-medium text-gray-900 mb-6">
          Personal Information
        </h2>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Search Patient ID</p>
            <p className="text-sm font-medium">Patient - 5560</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Patient Name</p>
            <p className="text-sm font-medium">Oluwatosin Chidimma Aminah</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Gender</p>
            <p className="text-sm font-medium">Female</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
            <p className="text-sm font-medium">22-03-1980 (44years)</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Marital Status</p>
            <p className="text-sm font-medium">Married</p>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Address</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Street</p>
                <p className="text-sm font-medium">No 2 Asuga street, Badore</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">City</p>
                <p className="text-sm font-medium">Lagos</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">State</p>
                <p className="text-sm font-medium">Lagos</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Emergency Contact
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Emergency Contact Name
                </p>
                <p className="text-sm font-medium">Kure Fadola James</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Emergency Contact Phone Number
                </p>
                <p className="text-sm font-medium">09000000000</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Emergency Contact Address
                </p>
                <p className="text-sm font-medium">No 2 Asuga street, Badore</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}