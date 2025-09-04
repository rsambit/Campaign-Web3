'use client'
import React from 'react';
import { CampaignStatus } from '../constants/constants';
import { getAddressFormattedText } from '../helpers/UIHelpers';
import { useRouter } from 'next/navigation';

interface TitleDescriptionCardCompactProps {
    title: string;
    description: string;
    owner: string;
    status: CampaignStatus;
    campaignAddress: string;
    userAddress: string;
}

const getStatusColor = (status: CampaignStatus): string => {
    switch (status) {
        case CampaignStatus.Active:
            return 'border-l-green-500 bg-green-50';
        case CampaignStatus.Completed:
            return 'border-l-blue-500 bg-blue-50';
        case CampaignStatus.Cancelled:
            return 'border-l-gray-500 bg-gray-50';
        case CampaignStatus.DeadlinePassed:
            return 'border-l-red-500 bg-red-50';
        default:
            return 'border-l-gray-500 bg-gray-50';
    }
};

const getStatusText = (status: CampaignStatus): string => {
    switch (status) {
        case CampaignStatus.Active:
            return 'Active';
        case CampaignStatus.Completed:
            return 'Completed';
        case CampaignStatus.Cancelled:
            return 'Cancelled';
        case CampaignStatus.DeadlinePassed:
            return 'Deadline Passed';
        default:
            return 'Unknown';
    }
};

export const TitleDescriptionCardCompact: React.FC<TitleDescriptionCardCompactProps> = ({ 
    title, 
    description, 
    owner, 
    status, 
    campaignAddress,
    userAddress 
}) => {
    const statusColorClass = getStatusColor(status);
    const statusText = getStatusText(status);
    const isOwnedByUser = owner === userAddress;

    const router = useRouter();

    return (
        <div
            className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${statusColorClass}`}
            onClick={(ev) => {
                ev.stopPropagation();
                router.push(`/campaigns/${campaignAddress}`);
            }}
        >
            <div className="p-5">
                {/* Header with title and status */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                        {title}
                    </h3>
                    <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 whitespace-nowrap">
                        {statusText}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {description}
                </p>

                {/* Owner info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {isOwnedByUser ? (
                            <span className="font-medium text-purple-600">You</span>
                        ) : (
                            <span>{getAddressFormattedText(owner)}</span>
                        )}
                    </div>
                    
                    {/* Action indicator */}
                    <div className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
