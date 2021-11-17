const Web3 = require('web3');
const main = async () => {
    const contractIsDeployed = (await web3.eth.getCode(myContractAddress)) !== '0x';
  
    if (!contractIsDeployed) {
      throw Error('MyContract is not deployed! Deploy it by running the deploy script.');
    }
  
    await logBalances();
  
    const underlyingAsCollateral = 25;
    const mantissa = (underlyingAsCollateral * Math.pow(10, underlyingDecimals)).toString();
    console.log(`\nSending ${underlyingAsCollateral} ${assetName} to MyContract so it can provide collateral...\n`);
  
    // Send underlying to MyContract before attempting the supply
    await underlying.methods.transfer(myContractAddress, mantissa).send(fromMyWallet);
  
    await logBalances();
  
    console.log(`\nCalling MyContract.borrowEthExample with ${underlyingAsCollateral} ${assetName} as collateral...\n`);
  
    let result = await myContract.methods.borrowEthExample(
      cEthAddress,
      comptrollerAddress,
      cTokenAddress,
      underlyingAddress,
      mantissa
    ).send(fromMyWallet);
  
    // See the solidity functions logs from "MyLog" event
    // console.log(JSON.stringify(result), '\n');
  
    await logBalances();
  
    console.log(`\nNow repaying the borrow...\n`);
    const ethToRepayBorrow = 0.002; // hard coded borrow in contract
    result = await myContract.methods.myEthRepayBorrow(
      cEthAddress,
      web3.utils.toWei(ethToRepayBorrow.toString(), 'ether'),
      300000 // gas for the "cEth.repayBorrow" function
    ).send(fromMyWallet);
  
    await logBalances();
  };
  
  
  main().catch(console.error);

