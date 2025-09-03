'use client'
import React from 'react';
import { CampaignStatus } from '../constants/constants';
import { getAddressFormattedText } from '../helpers/UIHelpers';

interface TitleDescriptionCardAlternateProps {
    title: string;
    description: string;
    owner: string;
    status: CampaignStatus;
    currentAddress: string;
}

const getStatusBadgeStyles = (status: CampaignStatus) => {
    switch (status) {
        case CampaignStatus.Active:
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Active'
            };
        case CampaignStatus.Completed:
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                label: 'Completed'
            };
        case CampaignStatus.Cancelled:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                label: 'Cancelled'
            };
        case CampaignStatus.DeadlinePassed:
            return {
                bg: 'bg-red-100',
                text: 'text-red-800',
                label: 'Deadline Passed'
            };
        default:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                label: 'Unknown'
            };
    }
};

export const TitleDescriptionCardAlternate: React.FC<TitleDescriptionCardAlternateProps> = ({ 
    title, 
    description, 
    owner, 
    status, 
    currentAddress 
}) => {
    const statusStyles = getStatusBadgeStyles(status);
    const isOwnedByUser = owner === currentAddress;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${status === CampaignStatus.Active ? 'bg-green-600' : 
                            status === CampaignStatus.Completed ? 'bg-blue-600' :
                            status === CampaignStatus.Cancelled ? 'bg-gray-600' : 'bg-red-600'}`}></div>
                        {statusStyles.label}
                    </span>
                    
                    {/* Owner Badge */}
                    {isOwnedByUser ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Your Campaign
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            Owner: {getAddressFormattedText(owner)}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {title}
                </h2>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            {/* Footer Section */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Campaign Details</span>
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>View Details →</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
