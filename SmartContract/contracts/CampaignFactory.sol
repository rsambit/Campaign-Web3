
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Campaign.sol";

contract CampaignFactory {

    address[] private s_campaigns;
    mapping(address => address[]) private s_userCampaigns;

    event CampaignFactoryCampaignCreated(address campaignAddress, address owner, string description, uint256 target, uint256 deadline);

    function createCampaign(string memory _description, uint256 _target, uint256 _deadline, uint256 _minimumAmount) external {
        Campaign newCampaign = new Campaign(msg.sender, _description, _target, _deadline, _minimumAmount);

        s_campaigns.push(address(newCampaign));
        s_userCampaigns[msg.sender].push(address(newCampaign));

        emit CampaignFactoryCampaignCreated(address(newCampaign), msg.sender, _description, _target, _deadline);
    }

    function getAllCampaigns() external view returns(address[] memory) {
        return s_campaigns;
    }

    function getAllCampaignsForUser(address user) external view returns(address[] memory) {
        return s_userCampaigns[user];
    }
}