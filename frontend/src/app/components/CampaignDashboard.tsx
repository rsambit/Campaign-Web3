'use client'

import { useAccount, useReadContract } from "wagmi";
import { campaignAbi } from "../helpers/networkMappingHelper";
import { Card } from "./Card";
import { DetailsList, PrimaryButton, ProgressIndicator, Stack, Text, ThemeContext, ThemeProvider, useTheme } from "@fluentui/react";
import { config } from "../../config/wagmi";
import { useMemo, useState } from "react";
// import { darkTheme } from "./AppHeader";
import { TitleDescriptionCard } from "./TitleAndDescription";
import { CampaignStatus } from "../constants/constants";
import { ContributeForm } from "./ContributeForm";
import { TitleDescriptionCardAlternate } from "./TitleAndDescriptionAlternate";

interface IContributor {
    address: string;
}

export function CampaignDashboard({ address }: {address: string}) {


    const { address: userAddress, chainId } = useAccount({
        config: config
    });
    const campaignAddress = address;
    
    const { data: campaignDetails, isLoading: campaignDetailsLoading } = useReadContract({
        address: campaignAddress as `0x${string}`,
        abi: campaignAbi,
        functionName: "getDetails",
        args: []
    });

    const { data: contributorDetails, isLoading: contributorDetailsLoading } = useReadContract({
        address: campaignAddress as `0x${string}`,
        abi: campaignAbi,
        functionName: "getContributors",
        args: []
    });

    const isDataLoading = campaignDetailsLoading || contributorDetailsLoading;

    const [owner, fundsRaised, targetFund, __, description] = (campaignDetails as any) || [0, 0, 0, 0, "", 0];
    const percentComplete = (Number(fundsRaised)/Number(targetFund));
    const contributorLength = (contributorDetails as any)?.length || 0;

    const contributors: IContributor[] = useMemo(() => {
        if (!contributorDetails) {
            return [];
        }
        
        return (contributorDetails as string[]).map((c) => {
            return {
                address: c
            };
        });

    }, [contributorDetails]);

    const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);

    return (
        <>
            {chainId}
            <div style={{ maxWidth: 800, margin: "auto", marginTop: 20 }}>
                <TitleDescriptionCardAlternate
                    title={`Campaign address: ${campaignAddress}`}
                    description={description || ""}
                    status={CampaignStatus.Active}
                    owner={owner}
                    currentAddress={userAddress as string}
                />
            </div>
            <div style={{ maxWidth: "fit-content", margin: "auto" }}>
                <Stack horizontal tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
                    <Card
                        isLoading={isDataLoading}
                        title={"Campaign details"}
                        titleColor="green"
                    >
                        <ProgressIndicator
                            label={<>
                                <span style={{ color: "white" }}>{"Progress"}</span>
                            </>}
                            percentComplete={percentComplete}
                            barHeight={10}
                        />
                    </Card>
                    <Card
                        isLoading={isDataLoading}
                        title={"Total contributors"}
                        titleColor="green"
                    >
                        <span style={{ color: "white", fontWeight: "bold", fontSize: 40 }}>{contributorLength}</span>
                    </Card>
                </Stack>
            </div>
            <div style={{ maxWidth: 800, margin: "auto", marginTop: 20 }}>
                <div style={{ display: "flex", marginBottom: 10 }}>
                    <span style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Contributors</span>
                    <div style={{ marginLeft: "auto" }}>
                        <PrimaryButton
                            text="Contribute"
                            onClick={() => {
                                setIsContributeDialogOpen(true);
                            }}
                        />
                        { isContributeDialogOpen &&
                            <ContributeForm 
                                isOpen={isContributeDialogOpen}
                                onDismiss={() => { setIsContributeDialogOpen(false); }}
                                onContributionDone={() => { setIsContributeDialogOpen(false); }}
                                campaignAddress={campaignAddress}
                            />
                        }
                    </div>
                </div>
                <ThemeProvider>
                    <DetailsList
                        items={contributors}
                    />
                </ThemeProvider>
            </div>
        </>
    );
}