'use client'
import React from 'react';
import { CampaignStatus } from '../constants/constants';
import { getAddressFormattedText, getTitlebgColorClassName } from '../helpers/UIHelpers';

interface TitleDescriptionCardProps {
    title: string;
    description: string;
    owner: string;
    status: CampaignStatus;
    currentAddress: string;
}

export const TitleDescriptionCard: React.FC<TitleDescriptionCardProps> = ({ title, description, owner, status, currentAddress }) => {

    const bgClassName = getTitlebgColorClassName(status);

    const ownedByText = (owner === currentAddress) ? "#Owned by you" : `#Owned by ${getAddressFormattedText(owner)}`;

    return (
        <div className={`${bgClassName} border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <div style={{ marginTop: 5, marginRight: 5, display: "flex" }}>
                <div style={{ marginLeft: "auto" }}>
                    <div>
                        <span style={{ fontSize: 12, fontStyle: "italic" }}>{ownedByText}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                {description}
            </p>
        </div>
    );
};

