# Homework week 3

## Token Contract deployment

https://sepolia.etherscan.io/tx/0xf00ba408f02cfbeeaf60859697a697fc603424f1ed648e63c28fb9966b3718ba


## TokenizedBallot contract deployment:

https://sepolia.etherscan.io/tx/0xfd3e81337f1ca682cf0acc5f121bc525af63d83b213209bc3e8711d1c5cc036a


## Token mints

https://sepolia.etherscan.io/tx/0x40cb5bb34c3dfa0d715fe72a374ada279931d6fc1ce5b4771db370d745b202f9


## Delegate votes

https://sepolia.etherscan.io/tx/0x87e60d88f2bba4df0bed646cce6342575435434929825f6872095ac398704985

## Vote

https://sepolia.etherscan.io/tx/0xd8f61bc966d58544a6417996a9239e7afe9c5798c31ccf469a0052ff400b9862

https://sepolia.etherscan.io/tx/0x1c5d2ef29456e9e1de8d77af8b8da5d76f329906cf630081c2661f5dc074870c

## Vote reverted (not more tokens to vote)

https://sepolia.etherscan.io/tx/0xb7f44c306b722dd76e113089e57049c00d7c072dade9db4517c2377ce7aaf52a

## Note

Set the desired targetBlockNumber in deployTokenizedBallot right.

## Commands
```
yarn run deployToken
yarn run mintTokens <tokencontract> <walletaddress> <amount>
yarn run delegate <tokencontract> <walletaddress>
yarn run deployTokenizedBallot <proposal1> <proposal2> ... <walletaddress>
yarn run vote <contractaddress> <proposal> <amount>
yarn run grantRole <contractaddress> <walletaddress>
yarn run checkVotingPower <contractaddress>
yarn run winner:proposal <contract:string>
yarn run winner:name <contract:string> 
```

## Test
```
    Testing ERC20 Ballot
    Deployments
      ✔ myToken deployment
      ✔ TokenizedBallot deployment
    ERC20
      ✔ mint token
      ✔ transfer token
      ✔ delegate votes
      ✔ transfer votes
      ✔ past votes
    tokenized ballot
      ✔ all proposals
      testing votes
        ✔ voting power
        ✔ vote in one propose
        ✔ multiple votes
        ✔ voting power spent
        ✔ vote without token
      winner
        name
          ✔ default
          ✔ after vote
        proposals
          ✔ first proposal
          ✔ after vote
          ✔ random proposal
    access control
      check access
        ✔ minter role
        ✔ admin role
        ✔ has no role
      manege roles
        ✔ grant role
        ✔ revoke role
        ✔ renounce role
        ✔ unauthorized renounce

25 passining
```
