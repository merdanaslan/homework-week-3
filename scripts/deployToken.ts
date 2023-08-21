import * as dotenv from 'dotenv';
import { deployTokenContract } from "./common";
dotenv.config();

async function main() {
  console.log("Deploying Token contract");

  const tokenContract = await deployTokenContract();
  
  const address = await tokenContract.getAddress();
  console.log(`Token Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});