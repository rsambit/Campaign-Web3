'use client'

import { useAccount, useReadContract } from "wagmi"
import { Card } from "./Card";
import { DetailsList, IColumn, Pivot, ShimmeredDetailsList, ThemeProvider, PivotItem, Stack, PrimaryButton, DefaultButton } from "@fluentui/react";
// import { darkTheme } from "./AppHeader";
import { campaignFactoryAbi, networkMappings } from "../helpers/networkMappingHelper";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCampaigns } from "../data/graphDataHelpers";
import { TitleDescriptionCardCompact } from "./TitleAndDescriptionCompact";
import { CampaignStatus } from "../constants/constants";
import { useRouter } from "next/navigation";

interface ICampaign {
    campaignAddress: string;
    owner: string;
    description: string;
    deadline: Date;
    target: BigInt;
}

export const CampaignList = () => {

    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [ownedCampaigns, setOwnedCampaigns] = useState<ICampaign[]>([]);
    const [isCampaignListLoading, setIsCampaignListLoading] = useState(false);

    const { chainId, address } = useAccount();
    const router = useRouter();
    const campaignFactoryAddress = chainId ? networkMappings[chainId!]?.campaignFactoryAddress : null;

    const fetchCampaigns = async () => {
        setIsCampaignListLoading(true);
        const data = await getAllCampaigns();
        setCampaigns(data as ICampaign[]);
        setOwnedCampaigns((data as ICampaign[]).filter((c) => c.owner.toLowerCase() === address?.toLowerCase()));
        setIsCampaignListLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleRefresh = () => {
        fetchCampaigns();
    };

    const handleCreateCampaign = () => {
        // Navigate to create campaign page or show create campaign modal
        // For now, we'll navigate to a create campaign route
        router.push('/createnew');
    };

    if (!chainId) {
        return (
            <>
                <span>Please connect to a walet to continue</span>
            </>
        )
    }

    const columns: IColumn[] = [
        {
            key: "address",
            minWidth: 200,
            maxWidth: 500,
            name: "Campaign",
            fieldName: "campaignAddress",
            onRender: (item: ICampaign) => {
                return <Link href={`/campaigns/${item.campaignAddress}`}> {item.campaignAddress} </Link>
            }
        }
    ]

    return (
        <div style={{ maxWidth: 800, margin: "auto", marginTop: 20 }}>
            <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Card
                    width={800}
                    title="Welcome to Mega campaigns"
                    isLoading={false}
                    titleColor="white"
                >
                    <span>{"Create a new campaign or monitor your previous campaigns. All in a single place using decentralized wallets."}</span>
                </Card>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: 20 }}>
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                    <PrimaryButton
                        text="Add New Campaign"
                        iconProps={{ iconName: 'Add' }}
                        onClick={handleCreateCampaign}
                        disabled={!chainId || !address}
                        styles={{
                            root: {
                                backgroundColor: '#0078d4',
                                borderColor: '#0078d4',
                            }
                        }}
                    />
                    <DefaultButton
                        text="Refresh"
                        iconProps={{ iconName: 'Refresh' }}
                        onClick={handleRefresh}
                        disabled={isCampaignListLoading}
                        styles={{
                            root: {
                                borderColor: '#0078d4',
                                color: '#0078d4'
                            }
                        }}
                    />
                </Stack>
            </div>
            {<></>/* <Pivot>
                <PivotItem
                    itemKey="yourown"
                    headerText="Your campaigns"
                >
                    <ThemeProvider>
                        <ShimmeredDetailsList
                            enableShimmer={isCampaignListLoading}
                            items={ownedCampaigns}
                            columns={columns}
                        />
                    </ThemeProvider>
                </PivotItem>
                <PivotItem
                    itemKey="all"
                    headerText="All campaigns"
                >
                    <ThemeProvider>
                        <ShimmeredDetailsList
                            enableShimmer={isCampaignListLoading}
                            items={campaigns}
                            columns={columns}
                        />
                    </ThemeProvider>
                </PivotItem>
            </Pivot> */}
            {
                <Stack tokens={{ childrenGap: 20 }}>
                    {campaigns.map((campaign) => {
                        return (
                            <TitleDescriptionCardCompact
                                key={campaign.campaignAddress}
                                title={campaign.description}
                                description={campaign.description}
                                owner={campaign.owner}
                                status={CampaignStatus.Active}
                                campaignAddress={campaign.campaignAddress as string}
                                userAddress={address as string}
                            />
                        );
                    })}
                </Stack>
            }
            
        </div>
    )
}