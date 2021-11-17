const Web3 = require ('web3');
// const Router = require('@koa/router');
const express = require('express')
const config = require('./config.json');

const web3 = new Web3(process.env.INFURA_URL);
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
const adminAddress = web3.eth.accounts.wallet[0];
const router = express.Router();

const cTokens = {
    cBat: new web3.eth.Contract(
        config.cTokenAbi,
        config.cBatAddress
    ),
    cDai: new web3.eth.Contract(
        config.cTokenAbi,
        config.cDaiAddress
    ),
    cComp: new web3.eth.Contract(
        config.cTokenAbi,
        config.cCompAddress
    ),
    cAave: new web3.eth.Contract(
        config.cTokenAbi,
        config.cAaveAddress
    ),
    cEth: new web3.eth.Contract(
        config.cTokenAbi,
        config.cEthAddress
    ),
    cLink: new web3.eth.Contract(
        config.cTokenAbi,
        config.cLinkAddress
    ),
    cMkr: new web3.eth.Contract(
        config.cTokenAbi,
        config.cMkrAddress
    ),
    cRep: new web3.eth.Contract(
        config.cTokenAbi,
        config.cRepAddress
    ),
    cSai: new web3.eth.Contract(
        config.cTokenAbi,
        config.cSaiAddress
    ),
    cSushi: new web3.eth.Contract(
        config.cTokenAbi,
        config.cSushiAddress
    ),
    cTusd: new web3.eth.Contract(
        config.cTokenAbi,
        config.cTusdAddress
    ),
    cUni: new web3.eth.Contract(
        config.cTokenAbi,
        config.cUniAddress
    ),
    cUsdc: new web3.eth.Contract(
        config.cTokenAbi,
        config.cUsdcAddress
    ),
    cUsdt: new web3.eth.Contract(
        config.cTokenAbi,
        config.cUsdtAddress
    ),
    cWbtc: new web3.eth.Contract(
        config.cTokenAbi,
        config.cWbtcAddress
    ),
    cWbtc2: new web3.eth.Contract(
        config.cTokenAbi,
        config.cWbtc2Address
    ),
    cYfi: new web3.eth.Contract(
        config.cTokenAbi,
        config.cYfiAddress
    ),
    cZrx: new web3.eth.Contract(
        config.cTokenAbi,
        config.cZrxAddress
    ),
};

router.get('/tokenBalance/:cToken/:address', async (req, res) => {
    const cToken = cTokens[req.params.cToken];
    if(typeof cToken === 'undefined') {
        res.status(404);
        res.send({
            error: 'cToken ${req.params.cToken} does not exist'
            
        });
        return;
    }

    try{
        const tokenBalance = await cToken
            .methods
            .balanceOfUnderlying(req.params.address)
            .call();

            res.send({
              cToken: req.params.cToken,
              address: req.params.address,
              tokenBalance
            });

    }catch(e){
        res.status(500);
        res.send({
            error: 'internal server error'
            
        });
    }
});



router.get('/cTokenBalance/:cToken/:address', async (req, res) => {
    const cToken = cTokens[req.params.cToken];
    console.log("CToken: %s", cToken);
    if(typeof cToken === 'undefined') {
      res.status = 400;
      res.body = {
            error: 'cToken ${req.params.cToken} does not exist'
            
        };
        return;
    }

    try{
        const cTokenBalance = await cToken
            .methods
            .balanceOf(req.params.address)
            .call();

            res.body = { 
            cToken: req.params.cToken,
            address: req.params.address,
            cTokenBalance
        }
        res.status = 200;

    }catch(e){
        Console.log(e);
        res.status = 500;
        res.body = {
            error: 'internal server error'
            
        }
    }
});



router.post('/mint/:cToken/:amount', async req =>{
    const cToken = cTokens[req.params.cToken];
    if(typeof cToken === 'undefined') {
        req.status = 400;
        req.body = {
            error: 'cToken ${req.params.cToken} does not exist'
            
        };
        return;
    }

    const tokenAddress = await cToken
        .methods
        .underlying()
        .call();
    const token = new web3.eth.Contract(
        config.ERC20Abi,
        tokenAddress
    );

    try{
         await cToken
            .methods
            .mint(req.params.amount)
            .send({from: adminAddress});

        req.body = {
            cToken: req.params.cToken,
            address: adminAddress,
            amountMinted: req.params.amount
        };

    }catch(e){
        Console.log(e);
        req.status = 500;
        req.body = {
            error: 'internal server error'
            
        }
    }
});



router.post('/redeem/:cToken/:amount', async req =>{
    const cToken = cTokens[req.params.cToken];
    if(typeof cToken === 'undefined') {
        req.status = 400;
        req.body = {
            error: 'cToken ${req.params.cToken} does not exist'
            
        };
        return;
    }


    try{
         await cToken
            .methods
            .redeem(req.params.amount)
            .send({from: adminAddress});

        req.body = {
            cToken: req.params.cToken,
            address: adminAddress,
            amountReedemed: req.params.amount
        };

    }catch(e){
        Console.log(e);
        req.status = 500;
        req.body = {
            error: 'internal server error'
            
        }
    }
});



module.exports = router;


