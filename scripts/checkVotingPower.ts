import * as dotenv from 'dotenv';
import { getWallet, getTokenizedBallotContractAt } from "./common";
dotenv.config();

async function main() {
  const [contractAddress] = process.argv.slice(2);

  console.log(`Checking voting power on contract: ${contractAddress}`);

  const ballotContract = await getTokenizedBallotContractAt(contractAddress);
  const wallet = await getWallet();
  const votes = await ballotContract.votingPower(wallet.address);
  
  console.log("Voting power: ", votes.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});