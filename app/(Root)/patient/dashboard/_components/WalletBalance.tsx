import React from "react";
import { FiCreditCard } from "react-icons/fi";

const WalletBalance = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCreditCard className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">My Wallet Balance</span>
        </div>
        <button className="text-blue-500 text-sm hover:underline font-medium">
          + Add Money
        </button>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-800">N233,879.00</p>
      </div>
    </div>
  );
};

export default WalletBalance; 