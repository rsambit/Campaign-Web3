'use client'

import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { campaignFactoryAbi, networkMappings } from "../helpers/networkMappingHelper";
import { parseEther } from "viem";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export interface ICreateCampaignFormProps {
    campaignFactoryAddress?: string;
}

interface FormData {
    description: string;
    minimumContribution: string;
    targetFunds: string;
    deadline: string;
}

interface FormErrors {
    description?: string;
    minimumContribution?: string;
    targetFunds?: string;
    deadline?: string;
}

export const CreateCampaignForm = (props: ICreateCampaignFormProps) => {
    const { campaignFactoryAddress } = props;
    const { isConnected, chainId } = useAccount();
    const router = useRouter();

    const { writeContractAsync: createNewCampaign } = useWriteContract();

    // Form state
    const [formData, setFormData] = useState<FormData>({
        description: '',
        minimumContribution: '',
        targetFunds: '',
        deadline: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isCreating, setIsCreating] = useState(false);

    // Get campaign factory address from network mapping if not provided
    const factoryAddress = campaignFactoryAddress || 
        (chainId ? networkMappings[chainId]?.campaignFactoryAddress : undefined);

    // Input change handler
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Campaign description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }

        // Minimum contribution validation
        if (!formData.minimumContribution.trim()) {
            newErrors.minimumContribution = 'Minimum contribution is required';
        } else {
            const minContrib = parseFloat(formData.minimumContribution);
            if (isNaN(minContrib) || minContrib <= 0) {
                newErrors.minimumContribution = 'Minimum contribution must be a positive number';
            } else if (minContrib < 0.001) {
                newErrors.minimumContribution = 'Minimum contribution must be at least 0.001 ETH';
            }
        }

        // Target funds validation
        if (!formData.targetFunds.trim()) {
            newErrors.targetFunds = 'Target funds is required';
        } else {
            const target = parseFloat(formData.targetFunds);
            if (isNaN(target) || target <= 0) {
                newErrors.targetFunds = 'Target funds must be a positive number';
            } else if (target < 0.01) {
                newErrors.targetFunds = 'Target funds must be at least 0.01 ETH';
            } else if (formData.minimumContribution && !isNaN(parseFloat(formData.minimumContribution))) {
                const minContrib = parseFloat(formData.minimumContribution);
                if (target < minContrib) {
                    newErrors.targetFunds = 'Target funds must be greater than minimum contribution';
                }
            }
        }

        // Deadline validation
        if (!formData.deadline.trim()) {
            newErrors.deadline = 'Campaign deadline is required';
        } else {
            const deadlineDate = new Date(formData.deadline);
            const now = new Date();
            const minDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
            
            if (deadlineDate <= now) {
                newErrors.deadline = 'Deadline must be in the future';
            } else if (deadlineDate < minDeadline) {
                newErrors.deadline = 'Deadline must be at least 24 hours from now';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!isConnected) {
            toast.error('Please connect your wallet to create a campaign');
            return;
        }

        if (!factoryAddress) {
            toast.error('Campaign factory address not found for this network');
            return;
        }

        setIsCreating(true);
        toast.info('Creating campaign...', { autoClose: false, toastId: 'creating-campaign' });

        try {
            // Convert deadline to Unix timestamp
            const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
            
            // Convert ETH values to Wei
            const targetInWei = parseEther(formData.targetFunds);
            const minimumInWei = parseEther(formData.minimumContribution);
            
            await createNewCampaign({
                abi: campaignFactoryAbi,
                address: factoryAddress as `0x${string}`,
                functionName: "createCampaign",
                args: [
                    formData.description,
                    targetInWei,
                    deadlineTimestamp,
                    minimumInWei
                ]
            });
            
            toast.dismiss('creating-campaign');
            toast.success('Campaign created successfully!');
            
            // Navigate back after successful creation
            router.back();
            
        } catch (error: any) {
            console.error('Error creating campaign:', error);
            toast.dismiss('creating-campaign');
            toast.error(error?.message || 'Failed to create campaign. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    // If user is not connected, show error message
    if (!isConnected) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                >
                    Please connect your Web3 wallet to create a campaign.
                </MessageBar>
            </div>
        );
    }

    // Get tomorrow's date as minimum deadline
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().slice(0, 16);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
                
                <form onSubmit={handleSubmit}>
                    <Stack tokens={{ childrenGap: 20 }}>
                        {/* Description Field */}
                        <TextField
                            label="Campaign Description"
                            placeholder="Describe your campaign and what you're raising funds for..."
                            multiline
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(_, newValue) => handleInputChange('description', newValue || '')}
                            errorMessage={errors.description}
                            disabled={isCreating}
                        />

                        {/* Minimum Contribution Field */}
                        <TextField
                            label="Minimum Contribution (ETH)"
                            placeholder="0.001"
                            type="number"
                            step="0.001"
                            min="0.001"
                            required
                            value={formData.minimumContribution}
                            onChange={(_, newValue) => handleInputChange('minimumContribution', newValue || '')}
                            errorMessage={errors.minimumContribution}
                            disabled={isCreating}
                            description="The minimum amount contributors must send"
                        />

                        {/* Target Funds Field */}
                        <TextField
                            label="Target Funds (ETH)"
                            placeholder="1.0"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            value={formData.targetFunds}
                            onChange={(_, newValue) => handleInputChange('targetFunds', newValue || '')}
                            errorMessage={errors.targetFunds}
                            disabled={isCreating}
                            description="The total amount you want to raise"
                        />

                        {/* Deadline Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campaign Deadline *
                            </label>
                            <input
                                type="datetime-local"
                                min={minDate}
                                required
                                value={formData.deadline}
                                onChange={(e) => handleInputChange('deadline', e.target.value)}
                                disabled={isCreating}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.deadline ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.deadline && (
                                <div className="text-red-500 text-sm mt-1">{errors.deadline}</div>
                            )}
                            <div className="text-gray-500 text-sm mt-1">
                                When the campaign should end
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <Stack horizontal tokens={{ childrenGap: 10 }} className="mt-6">
                            <PrimaryButton
                                type="submit"
                                disabled={isCreating}
                                className="flex-1"
                            >
                                {isCreating ? 'Creating Campaign...' : 'Create Campaign'}
                            </PrimaryButton>
                            
                            <DefaultButton
                                type="button"
                                onClick={() => router.back()}
                                disabled={isCreating}
                            >
                                Cancel
                            </DefaultButton>
                        </Stack>
                    </Stack>
                </form>
            </div>
        </div>
    );
};