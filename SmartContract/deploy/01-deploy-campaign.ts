import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { verify } from "../utils/verify";

const deploy = async(hre: HardhatRuntimeEnvironment) => {

    const { deployments } = hre;
    const [deployer] = await ethers.getSigners();
    const chainId = network.config.chainId;

    console.log("Deploying campaignFactory...");

    const factoryDeploymentResult = await deployments.deploy("CampaignFactory", {
        contract: "CampaignFactory",
        from: deployer.address,
        args: []
    });

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(factoryDeploymentResult.address, []);
    }

    console.log("✅ Campaign factory Deployment done!!!");
    console.log(`Factory deployed at ${factoryDeploymentResult.address}`);

    const campaignFactory = await ethers.getContractAt("CampaignFactory", factoryDeploymentResult.address);
    const campaignDeploymentResult = await campaignFactory.createCampaign(
        "This is a sample campaign contract",
        ethers.parseEther("0.2"),
        Date.now() * 2,
        ethers.parseEther("0.01")
    );

    await campaignDeploymentResult.wait();

    console.log("✅Campaign created!!!");
}

const deposit = async(hre: HardhatRuntimeEnvironment) => {

    const { deployments } = hre;
    const [deployer, user1] = await ethers.getSigners();

    const campaignFactoryDeployment = await deployments.get("CampaignFactory");
    const campaignFactory = await ethers.getContractAt("CampaignFactory", campaignFactoryDeployment.address);
    const allCampaigns = await campaignFactory.getAllCampaigns();
    const campaignContract = await ethers.getContractAt("Campaign", allCampaigns[0], user1);

    console.log(`Deposting 1 ETH to contract: ${allCampaigns[0]} from address ${user1.address}`);

    const txResponse = await campaignContract.deposit({value: ethers.parseEther("1")});
    await txResponse.wait(1);

    console.log("✅ Deposit done");

    const contributors = await campaignContract.getContributors();
    console.log(`Updated contributors: ${contributors}`);
}

const deployAndDeposit = async (hre: HardhatRuntimeEnvironment) => {
    await deploy(hre);
    // await deposit(hre);
}

export default deployAndDeposit;