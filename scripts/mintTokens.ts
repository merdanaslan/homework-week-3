import * as dotenv from 'dotenv';
import { getTokenContractAt } from "./common";
import { ethers } from "hardhat"
dotenv.config();

async function main() {
  const [contractAddress, recipient, amount] = process.argv.slice(2);
  console.log("Minting tokens...");

  const tokenContract = await getTokenContractAt(contractAddress);
  const mintTx = await tokenContract.mint(recipient, ethers.parseUnits(amount));
  await mintTx.wait();

  console.log("Tokens already minted.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});