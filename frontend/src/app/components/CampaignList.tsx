'use client'

import { useAccount, useReadContract } from "wagmi"
import { Card } from "./Card";
import { DetailsList, IColumn, Pivot, ShimmeredDetailsList, ThemeProvider, PivotItem } from "@fluentui/react";
// import { darkTheme } from "./AppHeader";
import { campaignFactoryAbi, networkMappings } from "../helpers/networkMappingHelper";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCampaigns } from "../data/graphDataHelpers";

interface ICampaign {
    campaignAddress: string;
    owner: string;
}

export const CampaignList = () => {

    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [ownedCampaigns, setOwnedCampaigns] = useState<ICampaign[]>([]);
    const [isCampaignListLoading, setIsCampaignListLoading] = useState(false);

    const { chainId, address } = useAccount();
    const campaignFactoryAddress = chainId ? networkMappings[chainId!]?.campaignFactoryAddress : null;

    // const { data: campaignAddresses, isLoading: isCampaignListLoading } = useReadContract({
    //     abi: campaignFactoryAbi,
    //     address: campaignFactoryAddress,
    //     functionName: "getAllCampaigns"
    // });

    // const { data: ownedCampaignAddresses, isLoading: isOwnedCampaignsLoading } = useReadContract({
    //     abi: campaignFactoryAbi,
    //     address: campaignFactoryAddress,
    //     functionName: "getAllCampaignsForUser",
    //     args: [address]
    // });

    // useEffect(() => {
    //     if (campaignAddresses) {
    //         setCampaigns((campaignAddresses as string[]).map((v) => {
    //             return { address: v };
    //         }));
    //     }

    //     if (ownedCampaignAddresses) {
    //         setOwnedCampaigns((ownedCampaignAddresses as string[]).map((v) => {
    //             return { address: v };
    //         }));
    //     }

    // }, [campaignAddresses, ownedCampaignAddresses]);

    useEffect(() => {
        const fetchData = async () => {
            setIsCampaignListLoading(true);
            const data = await getAllCampaigns();
            setCampaigns(data as ICampaign[]);
            setOwnedCampaigns((data as ICampaign[]).filter((c) => c.owner.toLowerCase() === address?.toLowerCase()));
            setIsCampaignListLoading(false);
        };
        fetchData();
    }, []);

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
            <Pivot>
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
            </Pivot>
            
        </div>
    )
}