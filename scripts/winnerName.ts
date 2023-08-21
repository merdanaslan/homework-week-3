import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { getTokenizedBallotContractAt } from "./common";
dotenv.config();

async function main() {
  const [contractAddress] = process.argv.slice(2);

  console.log(`Getting the winner name of ${contractAddress}`);

  const ballotContract = await getTokenizedBallotContractAt(contractAddress);
  const winnerName = await ballotContract.winnerName();

  console.log(`Winner: ${ethers.decodeBytes32String(winnerName)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});