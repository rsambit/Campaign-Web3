import { ReactNode } from 'react';

export default function CampaignsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Campaign Management
        </h1>
        <p className="text-gray-600">
          Manage your Web3 campaigns and view funding details
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
