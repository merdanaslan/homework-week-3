import * as dotenv from 'dotenv';
import { getTokenizedBallotContractAt } from "./common";
import { ethers } from 'hardhat';
dotenv.config();

async function main() {
  const [contractAddress, proposal, amount] = process.argv.slice(2);

  console.log(`Voting on contract: ${contractAddress} for proposal ${proposal} `);

  const ballotContract = await getTokenizedBallotContractAt(contractAddress);
  
  // Specify the gas limit value you want to use
  const desiredGasLimit = 500000; // Adjust this value as needed
  
  // Construct transaction options with gas limit
  const txOptions = { gasLimit: desiredGasLimit };
  
  // Call the vote function with the specified gas limit
  await ballotContract.vote(proposal, ethers.parseUnits(amount), txOptions);
  
  console.log("Voted!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
