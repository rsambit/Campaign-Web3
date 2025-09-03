'use client'

import { DefaultButton, MessageBar, MessageBarType, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { campaignAbi, networkMappings } from "../helpers/networkMappingHelper";
import { etherUnits } from "viem";
import { ethers } from "ethers";

export interface IContributeFormProps {
    campaignAddress: string;
    isOpen: boolean;
    onDismiss: () => void;
    onContributionDone: () => void;
}

export const CreateCampaignForm = (props: IContributeFormProps) => {

    const { isOpen, onDismiss, onContributionDone, campaignAddress } = props;

    const [amount, setAmount] = useState("0");
    const [errorMessage, setErrorMessage] = useState("");
    const { writeContractAsync: depositAmountCall } = useWriteContract();

    const validateAmount = (value: string) => {
        if (!value) {
            return "Amount should be valid";
        }

        if (!value.match("^(\d+(\.\d*)?|\.\d+)$")) {
            return "Please enter a valid ETH amount";
        }

        return "";
    }

    const depositAmount = async () => {
        try {

            await depositAmountCall({
                abi: campaignAbi,
                address: campaignAddress as `0x${string}`,
                functionName: "deposit",
                args: [],
                value: ethers.parseEther(amount)
            });

            onContributionDone();

        } catch (e) {
            setErrorMessage(JSON.stringify(e));
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
            >

                <div className="relative h-64 bg-gray-800 rounded-lg p-4">

                    {
                        errorMessage != "" &&
                        <MessageBar messageBarType={MessageBarType.error}>
                            {errorMessage}
                        </MessageBar>
                    }
                    <div>
                        <TextField
                            label="Amount (in ETH)"
                            value={amount}
                            onChange={(_, newValue) => {
                                setAmount(newValue || "");
                            }}
                            required
                            onGetErrorMessage={validateAmount}
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gray-700 text-white">
                        <Stack horizontal tokens={{ childrenGap: 8 }}>
                            <PrimaryButton
                                text="OK"
                                onClick={depositAmount}
                            />
                            <DefaultButton
                                text="Cancel"
                                onClick={onDismiss}
                            />
                        </Stack>
                    </div>
                </div>
            </Modal>
        </>
    )
}