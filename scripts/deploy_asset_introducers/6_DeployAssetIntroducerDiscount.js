const {throwError} = require('../GeneralUtils');
const provider = process.env.PROVIDER ? process.env.PROVIDER : throwError('No PROVIDER specified!');
const environment = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : throwError('No ENVIRONMENT specified!');
const Web3 = require('web3');
const {BN} = require('ethereumjs-util');
const {setupLoader} = require('@openzeppelin/contract-loader');
const {deployContract, linkContract} = require('../ContractUtils');
const {
  defaultGasPrice,
} = require('./index');

const web3 = new Web3(provider);

exports.defaultGasPrice = defaultGasPrice;
exports.web3 = web3;

const main = async () => {
  let deployer;
  if (process.env.DEPLOYER) {
    const privateKey = process.env.DEPLOYER;
    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    deployer = account.address;
  } else {
    throw Error("Invalid deployer, found nothing");
  }

  const loader = setupLoader({provider: web3, defaultSender: deployer, defaultGasPrice: 8e9});

  const AssetIntroducerDiscountV1 = loader.truffle.fromArtifact('AssetIntroducerDiscountV1');
  await deployContract(
    AssetIntroducerDiscountV1,
    [],
    deployer,
    1e6,
    web3,
    defaultGasPrice,
  );
};

main()
  .then(() => {
    console.log("Finished successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Could not deploy due to error: ", error);
    process.exit(-1);
  });