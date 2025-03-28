'use client';

import { useState } from 'react';

type Share = {
  subject_address: string;
  shares_amount: string;
};

type SharesTableProps = {
  shares: Share[];
  onSell: (share: Share) => void;
};

export default function SharesTable({ shares, onSell }: SharesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4 text-left">Subject Address</th>
            <th className="py-3 px-4 text-left">Shares Balance</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shares.map((share, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 font-mono">
                {share.subject_address}
              </td>
              <td className="py-3 px-4">{share.shares_amount}</td>
              <td className="py-3 px-4 text-right">
                {Number(share.shares_amount) > 0 && (
                  <button
                    onClick={() => onSell(share)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Sell
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 