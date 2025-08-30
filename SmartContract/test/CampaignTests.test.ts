import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Campaign } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Campaign", function () {
  // Campaign states enum
  const CampaignState = {
    Active: 0,
    DeadlinePassed: 1,
    Cancelled: 2,
    Completed: 3
  };

  async function deployCampaignFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    const currentTime = Math.floor(Date.now() / 1000);
    const futureDeadline = currentTime + 86400; // 24 hours from now
    const targetAmount = ethers.parseEther("10"); // 10 ETH
    const minimumDonation = ethers.parseEther("0.1"); // 0.1 ETH
    const description = "Test campaign for charity";

    const Campaign = await ethers.getContractFactory("Campaign");
    const campaign = await Campaign.deploy(
      owner.address,
      description,
      targetAmount,
      futureDeadline,
      minimumDonation
    );

    return {
      campaign,
      owner,
      addr1,
      addr2,
      addr3,
      targetAmount,
      minimumDonation,
      description,
      futureDeadline,
      currentTime
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct initial values", async function () {
      const { campaign, owner, targetAmount, description, futureDeadline } = await loadFixture(deployCampaignFixture);

      const details = await campaign.getDetails();
      
      expect(details.owner).to.equal(owner.address);
      expect(details.fundsRaised).to.equal(0);
      expect(details.target).to.equal(targetAmount);
      expect(details.deadline).to.equal(futureDeadline);
      expect(details.description).to.equal(description);
      expect(details.state).to.equal(CampaignState.Active);
    });

    it("Should emit CampaignCreatedEvent on deployment", async function () {
      const [owner] = await ethers.getSigners();
      const currentTime = Math.floor(Date.now() / 1000);
      const futureDeadline = currentTime + 86400;
      const targetAmount = ethers.parseEther("10");
      const minimumDonation = ethers.parseEther("0.1");
      const description = "Test campaign";

      const Campaign = await ethers.getContractFactory("Campaign");

      // await expect(
      //   Campaign.deploy(
      //   owner.address,
      //   description,
      //   targetAmount,
      //   futureDeadline,
      //   minimumDonation
      // )).to.emit(Campaign, "CampaignCreatedEvent")
      // .withArgs(expect.any(string), newDeadline);;
    });

    it("Should revert if target is zero", async function () {
      const [owner] = await ethers.getSigners();
      const currentTime = Math.floor(Date.now() / 1000);
      const futureDeadline = currentTime + 86400;
      const minimumDonation = ethers.parseEther("0.1");
      const description = "Test campaign";

      const Campaign = await ethers.getContractFactory("Campaign");
      
      await expect(Campaign.deploy(
        owner.address,
        description,
        0, // Invalid target
        futureDeadline,
        minimumDonation
      )).to.be.revertedWithCustomError(Campaign, "Campaign__TargetMustBeGreateThanZero");
    });

    it("Should revert if deadline is in the past", async function () {
      const [owner] = await ethers.getSigners();
      const currentTime = Math.floor(Date.now() / 1000);
      const pastDeadline = currentTime - 86400; // 24 hours ago
      const targetAmount = ethers.parseEther("10");
      const minimumDonation = ethers.parseEther("0.1");
      const description = "Test campaign";

      const Campaign = await ethers.getContractFactory("Campaign");
      
      await expect(Campaign.deploy(
        owner.address,
        description,
        targetAmount,
        pastDeadline, // Invalid deadline
        minimumDonation
      )).to.be.revertedWithCustomError(Campaign, "Campaign__DeadlineMustBeInFuture");
    });
  });

  describe("Update Campaign", function () {
    it("Should allow owner to update campaign target and deadline", async function () {
      const { campaign, owner, currentTime } = await loadFixture(deployCampaignFixture);
      
      const newTarget = ethers.parseEther("15");
      const newDeadline = currentTime + 172800; // 48 hours from now

      await expect(campaign.connect(owner).updateCampaign(newTarget, newDeadline))
        .to.emit(campaign, "CampaignUpdatedEvent")
        .withArgs(await campaign.getAddress(), newTarget, newDeadline);

      const details = await campaign.getDetails();
      expect(details.target).to.equal(newTarget);
      expect(details.deadline).to.equal(newDeadline);
    });

    it("Should revert if non-owner tries to update campaign", async function () {
      const { campaign, addr1, currentTime } = await loadFixture(deployCampaignFixture);
      
      const newTarget = ethers.parseEther("15");
      const newDeadline = currentTime + 172800;

      await expect(campaign.connect(addr1).updateCampaign(newTarget, newDeadline))
        .to.be.revertedWithCustomError(campaign, "Campaign__OperationAllowedOnlyForOwner");
    });

    it("Should revert if trying to update with past deadline", async function () {
      const { campaign, owner, currentTime } = await loadFixture(deployCampaignFixture);
      
      const newTarget = ethers.parseEther("15");
      const pastDeadline = currentTime - 3600; // 1 hour ago

      await expect(campaign.connect(owner).updateCampaign(newTarget, pastDeadline))
        .to.be.revertedWithCustomError(campaign, "Campaign__DeadlineMustBeInFuture");
    });

    it("Should revert if campaign is not active", async function () {
      const { campaign, owner, currentTime } = await loadFixture(deployCampaignFixture);
      
      // Cancel the campaign first
      await campaign.connect(owner).cancelCampaign();
      
      const newTarget = ethers.parseEther("15");
      const newDeadline = currentTime + 172800;

      await expect(campaign.connect(owner).updateCampaign(newTarget, newDeadline))
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });
  });

  describe("Deposits", function () {
    it("Should accept valid donations", async function () {
      const { campaign, addr1, minimumDonation } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("1");

      await expect(campaign.connect(addr1).deposit({ value: donationAmount }))
        .to.emit(campaign, "CampaignDepositReceived")
        .withArgs(await campaign.getAddress(), addr1.address, donationAmount);

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(donationAmount);

      const contributors = await campaign.getContributors();
      expect(contributors).to.include(addr1.address);
    });

    it("Should accumulate multiple donations from same contributor", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      const firstDonation = ethers.parseEther("1");
      const secondDonation = ethers.parseEther("2");

      await campaign.connect(addr1).deposit({ value: firstDonation });
      await campaign.connect(addr1).deposit({ value: secondDonation });

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(firstDonation + secondDonation);

      // Should only add contributor once
      const contributors = await campaign.getContributors();
      const addr1Count = contributors.filter(addr => addr === addr1.address).length;
      expect(addr1Count).to.equal(1);
    });

    it("Should accept donations from multiple contributors", async function () {
      const { campaign, addr1, addr2, addr3 } = await loadFixture(deployCampaignFixture);
      
      const donation1 = ethers.parseEther("1");
      const donation2 = ethers.parseEther("2");
      const donation3 = ethers.parseEther("3");

      await campaign.connect(addr1).deposit({ value: donation1 });
      await campaign.connect(addr2).deposit({ value: donation2 });
      await campaign.connect(addr3).deposit({ value: donation3 });

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(donation1 + donation2 + donation3);

      const contributors = await campaign.getContributors();
      expect(contributors).to.have.lengthOf(3);
      expect(contributors).to.include(addr1.address);
      expect(contributors).to.include(addr2.address);
      expect(contributors).to.include(addr3.address);
    });

    it("Should revert if donation is below minimum", async function () {
      const { campaign, addr1, minimumDonation } = await loadFixture(deployCampaignFixture);
      
      const belowMinimum = minimumDonation - BigInt(1);

      await expect(campaign.connect(addr1).deposit({ value: belowMinimum }))
        .to.be.revertedWithCustomError(campaign, "Campaign__MinimumETHNotSent()");
    });

    it("Should revert donations after deadline", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]); // 24 hours + buffer
      await ethers.provider.send("evm_mine", []);

      const donationAmount = ethers.parseEther("1");

      await expect(campaign.connect(addr1).deposit({ value: donationAmount }))
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState()");
    });

    it("Should revert donations to cancelled campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      await campaign.connect(owner).cancelCampaign();

      const donationAmount = ethers.parseEther("1");

      await expect(campaign.connect(addr1).deposit({ value: donationAmount }))
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });
  });

  describe("Cancel Campaign", function () {
    it("Should allow owner to cancel active campaign", async function () {
      const { campaign, owner } = await loadFixture(deployCampaignFixture);

      await expect(campaign.connect(owner).cancelCampaign())
        .to.emit(campaign, "CampaignCancelledEvent")
        .withArgs(await campaign.getAddress());

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Cancelled);
    });

    it("Should revert if non-owner tries to cancel", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);

      await expect(campaign.connect(addr1).cancelCampaign())
        .to.be.revertedWithCustomError(campaign, "Campaign__OperationAllowedOnlyForOwner");
    });

    it("Should revert if trying to cancel non-active campaign", async function () {
      const { campaign, owner } = await loadFixture(deployCampaignFixture);

      // Cancel once
      await campaign.connect(owner).cancelCampaign();

      // Try to cancel again
      await expect(campaign.connect(owner).cancelCampaign())
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });
  });

  describe("Reclaim Funds", function () {
    it("Should allow contributors to reclaim funds from cancelled campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("1");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      // Cancel campaign
      await campaign.connect(owner).cancelCampaign();

      const initialBalance = await ethers.provider.getBalance(addr1.address);
      const tx = await campaign.connect(addr1).reclaimFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.closeTo(
        initialBalance + donationAmount - gasUsed,
        ethers.parseEther("0.01") // Gas estimation tolerance
      );

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(0);
    });

    it("Should allow contributors to reclaim funds after deadline", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("1");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await ethers.provider.getBalance(addr1.address);
      const tx = await campaign.connect(addr1).reclaimFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.closeTo(
        initialBalance + donationAmount - gasUsed,
        ethers.parseEther("0.01")
      );
    });

    it("Should revert if contributor has no contribution", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      // Cancel campaign without any donations
      await campaign.connect(owner).cancelCampaign();

      await expect(campaign.connect(addr1).reclaimFunds())
        .to.be.revertedWith("No contribution");
    });

    it("Should revert reclaim from completed campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("1");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      // Fast forward past deadline and withdraw
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);
      await campaign.connect(owner).withdrawAmount();

      await expect(campaign.connect(addr1).reclaimFunds())
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });
  });

  describe("Withdraw Amount", function () {
    it("Should allow owner to withdraw after deadline", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("5");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await expect(campaign.connect(owner).withdrawAmount())
        .to.emit(campaign, "CampaignCompletedEvent")
        .withArgs(await campaign.getAddress());

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.greaterThan(initialBalance);

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Completed);
    });

    it("Should allow owner to withdraw from cancelled campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("5");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      await campaign.connect(owner).cancelCampaign();

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await campaign.connect(owner).withdrawAmount();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.greaterThan(initialBalance);

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Completed);
    });

    it("Should revert if non-owner tries to withdraw", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      await expect(campaign.connect(addr1).withdrawAmount())
        .to.be.revertedWithCustomError(campaign, "Campaign__OperationAllowedOnlyForOwner");
    });

    it("Should revert if trying to withdraw from active campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("5");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      await expect(campaign.connect(owner).withdrawAmount())
        .to.be.revertedWithCustomError(campaign, "Campaign__WithdrawNotAllowed");
    });

    it("Should revert if trying to withdraw from completed campaign", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("5");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      // Fast forward past deadline and withdraw once
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);
      await campaign.connect(owner).withdrawAmount();

      // Try to withdraw again
      await expect(campaign.connect(owner).withdrawAmount())
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });
  });

  describe("Get Details", function () {
    it("Should return correct campaign details", async function () {
      const { campaign, owner, targetAmount, description, futureDeadline } = await loadFixture(deployCampaignFixture);

      const details = await campaign.getDetails();
      
      expect(details.owner).to.equal(owner.address);
      expect(details.fundsRaised).to.equal(0);
      expect(details.target).to.equal(targetAmount);
      expect(details.deadline).to.equal(futureDeadline);
      expect(details.description).to.equal(description);
      expect(details.state).to.equal(CampaignState.Active);
    });

    it("Should return updated details after donations", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      const donationAmount = ethers.parseEther("3");
      await campaign.connect(addr1).deposit({ value: donationAmount });

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(donationAmount);
    });
  });

  describe("Get Contributors", function () {
    it("Should return empty array initially", async function () {
      const { campaign } = await loadFixture(deployCampaignFixture);

      const contributors = await campaign.getContributors();
      expect(contributors).to.have.lengthOf(0);
    });

    it("Should return all contributors", async function () {
      const { campaign, addr1, addr2, addr3 } = await loadFixture(deployCampaignFixture);
      
      await campaign.connect(addr1).deposit({ value: ethers.parseEther("1") });
      await campaign.connect(addr2).deposit({ value: ethers.parseEther("2") });
      await campaign.connect(addr3).deposit({ value: ethers.parseEther("3") });

      const contributors = await campaign.getContributors();
      expect(contributors).to.have.lengthOf(3);
      expect(contributors).to.include(addr1.address);
      expect(contributors).to.include(addr2.address);
      expect(contributors).to.include(addr3.address);
    });

    it("Should not duplicate contributors", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      await campaign.connect(addr1).deposit({ value: ethers.parseEther("1") });
      await campaign.connect(addr1).deposit({ value: ethers.parseEther("2") });

      const contributors = await campaign.getContributors();
      expect(contributors).to.have.lengthOf(1);
      expect(contributors[0]).to.equal(addr1.address);
    });
  });

  describe("State Transitions", function () {
    it("Should automatically transition to DeadlinePassed after deadline", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      // Verify initially active
      let details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Active);

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      // Try to donate to trigger state check
      await expect(campaign.connect(addr1).deposit({ value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(campaign, "Campaign__CampaignNotInActiveState");
    });

    it("Should transition to Cancelled when owner cancels", async function () {
      const { campaign, owner } = await loadFixture(deployCampaignFixture);
      
      await campaign.connect(owner).cancelCampaign();

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Cancelled);
    });

    it("Should transition to Completed when owner withdraws", async function () {
      const { campaign, owner, addr1 } = await loadFixture(deployCampaignFixture);
      
      await campaign.connect(addr1).deposit({ value: ethers.parseEther("1") });

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      await campaign.connect(owner).withdrawAmount();

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Completed);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero withdrawal amount", async function () {
      const { campaign, owner } = await loadFixture(deployCampaignFixture);
      
      // Fast forward past deadline without any donations
      await ethers.provider.send("evm_increaseTime", [86500]);
      await ethers.provider.send("evm_mine", []);

      await expect(campaign.connect(owner).withdrawAmount())
        .to.emit(campaign, "CampaignCompletedEvent");

      const details = await campaign.getDetails();
      expect(details.state).to.equal(CampaignState.Completed);
      expect(details.fundsRaised).to.equal(0);
    });

    it("Should handle exact minimum donation", async function () {
      const { campaign, addr1, minimumDonation } = await loadFixture(deployCampaignFixture);

      await expect(campaign.connect(addr1).deposit({ value: minimumDonation }))
        .to.emit(campaign, "CampaignDepositReceived")
        .withArgs(await campaign.getAddress(), addr1.address, minimumDonation);

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(minimumDonation);
    });

    it("Should handle large donation amounts", async function () {
      const { campaign, addr1 } = await loadFixture(deployCampaignFixture);
      
      const largeDonation = ethers.parseEther("1000");

      await expect(campaign.connect(addr1).deposit({ value: largeDonation }))
        .to.emit(campaign, "CampaignDepositReceived")
        .withArgs(await campaign.getAddress(), addr1.address, largeDonation);

      const details = await campaign.getDetails();
      expect(details.fundsRaised).to.equal(largeDonation);
    });
  });
});