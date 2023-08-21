import * as dotenv from 'dotenv';
import { getTokenContractAt } from "./common";
dotenv.config();

async function main() {
  const [contractAddress, recipient] = process.argv.slice(2);
  console.log("Delegating votes...");

  const tokenContract = await getTokenContractAt(contractAddress);
  const delegateTx = await tokenContract.delegate(recipient);
  await delegateTx.wait();

  console.log("Delegated tx done...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});