'use client'

import "dotenv/config";
import { gql, request } from 'graphql-request'

const apiKey = process.env.GRAPH_API_KEY || "f4adc0bee84f76f0a6fd4596e010f91f";

const query = gql`{
  campaignFactoryCampaignCreateds(first:10) {
    id
    campaignAddress
    owner
    description
    deadline
    target
  }
}`

export const getAllCampaigns = async () => {
    const url = 'https://api.studio.thegraph.com/query/119820/campaign/version/latest'
    const headers = { Authorization: `Bearer ${apiKey}` }

    try {
        const response = await request(url, query, {}, headers);
        return (response as any)?.campaignFactoryCampaignCreateds || [];
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
}