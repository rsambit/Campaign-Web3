import { CampaignDashboard } from "@/app/components/CampaignDashboard";

interface CampaignProps {
    params: { address: string };
}

export default function Campaign({ params }: CampaignProps) {
    const { address } = params;

    return (
        <>  
            <CampaignDashboard address={address} />
        </>
    );
}
