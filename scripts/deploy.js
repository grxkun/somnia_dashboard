const hre = require("hardhat");

async function main() {
  console.log("Deploying MonkOfSomnia contract...");

  // Get the contract factory
  const MonkOfSomnia = await hre.ethers.getContractFactory("MonkOfSomnia");

  // Deploy the contract
  const monk = await MonkOfSomnia.deploy();

  await monk.waitForDeployment();

  const contractAddress = await monk.getAddress();
  
  console.log("MonkOfSomnia deployed to:", contractAddress);
  
  // Save the deployment information
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    networkName: hre.network.name,
    deploymentTime: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    './deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  
  // Verify contract if on a supported network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await monk.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });