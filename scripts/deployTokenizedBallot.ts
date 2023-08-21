import * as dotenv from 'dotenv';
import { deployTokenizedBallotContract, getAddressAndBlockNumber, getProposals } from "./common";
dotenv.config();

async function main() {
  console.log("Deploying TokenizedBallot contract");

  const proposals = getProposals();
  const { tokenContractAddress, blockNumber } = await getAddressAndBlockNumber();

  // Set the desired targetBlockNumber here
  const targetBlockNumber = 4119630; // Replace with your desired block number

  const tokenizedBallotContract = await deployTokenizedBallotContract(
    proposals,
    tokenContractAddress,
    targetBlockNumber
  );
  
  const address = await tokenizedBallotContract.getAddress();
  console.log(`Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

