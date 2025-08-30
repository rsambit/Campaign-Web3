# contracts

Campaign
    - Create campaign
        - owner
        - target amount
        - target date
        - message
        - state

    - add fund
        - sender
        - amount
    
    - remove fund
        - owner
        - mark campaign state as disabled

    - disable fund


CampaignFactory
    - create campaign

    - delete campaign

    - update campaign
        - new target
        - new deadline
        - new message


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
