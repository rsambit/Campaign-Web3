import { CampaignStatus } from "../constants/constants";

export const getTitlebgColorClassName = (state: CampaignStatus) => {

    let className = "bg-white dark:bg-gray-800";

    switch (state) {
        case CampaignStatus.Active:
            className = "bg-blue-900 dark:bg-darkblue-900";
            break;
        case CampaignStatus.Completed:
            className = "bg-green-900 dark:bg-green-900"
            break;
        case CampaignStatus.Cancelled:
            className = "bg-yellow-900 dark:bg-yellow-900"
            break;
        case CampaignStatus.DeadlinePassed:
            className = "bg-red-900 dark:bg-red-900"
            break;
    }


    return className;
}

export const getAddressFormattedText = (address: string) => {
    if (!address || address?.length < 10) {
        return "-";
    }

    return `${address.slice(0, 5)}...${address.slice(address.length - 6, address.length - 1)}`
}