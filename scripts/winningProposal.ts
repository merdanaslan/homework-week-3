import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { getTokenizedBallotContractAt } from "./common";
dotenv.config();

async function main() {
  const [contractAddress] = process.argv.slice(2);

  console.log(`Getting the winning proposal for ${contractAddress}`);

  const ballotContract = await getTokenizedBallotContractAt(contractAddress);
  const index = await ballotContract.winningProposal();
  const proposal = await ballotContract.proposals(index);
  const proposalName = ethers.decodeBytes32String(proposal.name);

  console.log(`Winning proposal is proposal ${index}: ${proposalName} with ${proposal.voteCount} votes`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});