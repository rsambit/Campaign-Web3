
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;


error Campaign__TargetMustBeGreateThanZero();
error Campaign__DeadlineMustBeInFuture();
error Campaign__MinimumETHNotSent();
error Campaign__CampaignNotAcceptingDonation();
error Campaign__CampaignNotInActiveState();
error Campaign__OperationAllowedOnlyForOwner();
error Campaign__RefundNotAllowed();
error Campaign__RefundFailed();
error Campaign__WithdrawNotAllowed();
error Campaign__WithdrawFundsFailed();

contract Campaign {

    enum CampaignState {
        Active,
        DeadlinePassed,
        Cancelled,
        Completed
    }

    uint256 private s_fundsRaised;
    uint256 private s_targetFund;
    uint256 private s_deadline;
    mapping(address => uint256) private s_contributorToAmountMapping;
    address[] private s_contributors;
    CampaignState private s_campaignState;
    address private immutable i_owner;
    string public s_description;
    uint256 private immutable s_minimumDonation;

    event CampaignCreatedEvent(address indexed campaignAddress, address indexed owner, uint256 targetFund, uint256 deadline, string description);
    event CampaignUpdatedEvent(address indexed campaignAddress, uint256 target, uint256 deadline);
    event CampaignCancelledEvent(address indexed campaignAddress);
    event CampaignDepositReceived(address indexed campaignAddress, address indexed sender, uint256 amount);
    event CampaignRefundSucceededEvent(address indexed campaignAddress);
    event CampaignCompletedEvent(address indexed campaignAddress);

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Campaign__OperationAllowedOnlyForOwner();
        }

        _;
    }

    modifier isCampaignActive() {
        if (s_campaignState != CampaignState.Active) {
            revert Campaign__CampaignNotInActiveState();
        }

        _;
    }

    modifier isCampaignNotCompleted() {
        if (s_campaignState == CampaignState.Completed) {
            revert Campaign__CampaignNotInActiveState();
        }

        _;
    }

    modifier checkDeadline() {
        CampaignState currentState = s_campaignState;

        if (currentState == CampaignState.Active) {
            if (block.timestamp >= s_deadline) {
                s_campaignState = CampaignState.DeadlinePassed;
            }
        }

        _;
    }

    constructor(address _owner, string memory _description, uint256 _target, uint256 _deadline, uint256 _minimumAmount) {
        if (_target <= 0) {
            revert Campaign__TargetMustBeGreateThanZero();
        }

        if (block.timestamp >= _deadline) {
            revert Campaign__DeadlineMustBeInFuture();
        }

        i_owner = _owner;
        s_description = _description;
        s_targetFund = _target;
        s_minimumDonation = _minimumAmount;
        s_campaignState = CampaignState.Active;
        s_deadline = _deadline;

        emit CampaignCreatedEvent(address(this), _owner, _target, _deadline, _description);
    }

    function updateCampaign(uint256 _target, uint256 _deadline) external onlyOwner checkDeadline isCampaignActive  {

        if (_target > 0) {
            s_targetFund = _target;
        }

        if (block.timestamp < _deadline) {
            s_deadline = _deadline;
        } else {
            revert Campaign__DeadlineMustBeInFuture();
        }

        emit CampaignUpdatedEvent(address(this), _target, _deadline);
    }

    function deposit() external payable checkDeadline isCampaignActive {

        if (msg.value < s_minimumDonation) {
            revert Campaign__MinimumETHNotSent();
        }

        CampaignState currentState = s_campaignState;

        if (currentState == CampaignState.DeadlinePassed) {
            revert Campaign__CampaignNotAcceptingDonation();
        }

        if (s_contributorToAmountMapping[msg.sender] == 0) {
            s_contributors.push(msg.sender);
        }

        s_contributorToAmountMapping[msg.sender] += msg.value;
        s_fundsRaised += msg.value;
        
        emit CampaignDepositReceived(address(this), msg.sender, msg.value);
    }

    function cancelCampaign() external onlyOwner isCampaignActive {
        s_campaignState = CampaignState.Cancelled;

        emit CampaignCancelledEvent(address(this));
    }

    function reclaimFunds() external payable isCampaignNotCompleted {
        uint256 amount = s_contributorToAmountMapping[msg.sender];
        require(amount > 0, "No contribution");

        s_contributorToAmountMapping[msg.sender] = 0;

        uint16 index = 0;
        for (uint16 i = 0; i < s_contributors.length; i++) {
            if (s_contributors[i] == msg.sender) {
                index = i;
                break;
            }
        }

        s_fundsRaised -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert Campaign__RefundFailed();
        }

        delete s_contributors[index];
    }

    function withdrawAmount() external onlyOwner checkDeadline isCampaignNotCompleted {

        CampaignState currentState = s_campaignState;
        if (currentState == CampaignState.Active) {
            revert Campaign__WithdrawNotAllowed();
        }

        s_campaignState = CampaignState.Completed;
        uint256 raisedAmount = s_fundsRaised;

        (bool success, ) = payable(msg.sender).call{value: raisedAmount}("");
        if (!success) {
            revert Campaign__WithdrawFundsFailed();
        }

        emit CampaignCompletedEvent(address(this));
    }

    function getDetails() external view returns (
        address owner,
        uint256 fundsRaised,
        uint256 target,
        uint256 deadline,
        string memory description,
        CampaignState state
    ) {
        return (i_owner, s_fundsRaised, s_targetFund, s_deadline, s_description, s_campaignState);
    }

    function getContributors() external view returns (address[] memory) {
        return s_contributors;
    }
}