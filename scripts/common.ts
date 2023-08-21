import { ethers } from "ethers";
import { TokenizedBallot, TokenizedBallot__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const loadWallet = (provider: ethers.JsonRpcProvider) => {
  if (process.env.PRIVATE_KEY != undefined) {
    return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }

  if (process.env.MNEMONIC != undefined) {
    if (typeof process.env.MNEMONIC === 'string' && process.env.MNEMONIC.length > 0) {
      const MNEMONIC: string = process.env.MNEMONIC;
      return ethers.Wallet.fromPhrase(MNEMONIC, provider);
    }

  }

  return ethers.Wallet.createRandom(provider);
}

export async function getProvider(){
  return new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);
}

export async function getWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);
  const wallet = loadWallet(provider);
  console.log(`Using address ${wallet.address}`);

  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));

  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {

    throw new Error("Not enough ether");

  }

  return wallet;
}

export function getProposals() {
  const proposals = process.argv.slice(2, process.argv.length - 1);

  if (proposals.length < 2) {

    throw new Error("Need at least 2 proposals.");

  }

  return proposals.map(ethers.encodeBytes32String);
}

export async function getAddressAndBlockNumber() {
  const [tokenContractAddress] = process.argv.slice(process.argv.length - 1);
  const blockNumber = await (await getProvider()).getBlockNumber();

  return { tokenContractAddress, blockNumber };
}

export async function deployTokenContract() {
  const wallet = await getWallet();

  const tokenFactory = new MyToken__factory(wallet);
  const tokenContract = await tokenFactory.deploy();
  await tokenContract.waitForDeployment();
  return tokenContract;
}

export async function getTokenContractAt(contractAddress: string) {
  const wallet = await getWallet();

  const tokenFactory = new MyToken__factory(wallet);
  const tokenContract = tokenFactory.attach(contractAddress) as MyToken;
  return tokenContract;
}

export async function deployTokenizedBallotContract(
  proposals: string[],
  tokenContractAddress: string,
  targetBlockNumber: number // Add this parameter
): Promise<TokenizedBallot> {
  const wallet = await getWallet();

  const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    proposals,
    tokenContractAddress,
    targetBlockNumber
  );

  await tokenizedBallotContract.waitForDeployment();
  return tokenizedBallotContract;
}

export async function getTokenizedBallotContractAt(contractAddress: string) {
  const wallet = await getWallet();

  const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
  const tokenizedBallotContract = tokenizedBallotFactory.attach(contractAddress) as TokenizedBallot;
  return tokenizedBallotContract;
}