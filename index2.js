const fs = require("fs");
const { parse } = require("csv-parse");
const Web3 = require('web3');
var HTTPSWEB3 = 'http://localhost:8545'
var web3 = new Web3(Web3.givenProvider || HTTPSWEB3);


// CHANGE VAL
var ELEGIBLE_BLOCK_BASE_FEE = 14
var FILE_TO_READ = "./output/out-1655890182.csv"
// CHANGE VAL

var GASPRICE_TO_CHECK = parseInt(30000000000) + parseInt(ELEGIBLE_BLOCK_BASE_FEE)
var blockMap = new Map()
var nullTx = 0
var notNullTx = 0

const timer = ms => new Promise(res => setTimeout(res, ms))

async function getTransactionBlock(txHash){
    tx = await web3.eth.getTransactionReceipt(txHash)
    if(tx!==null){
        notNullTx++
        if(tx.effectiveGasPrice>=GASPRICE_TO_CHECK){

            let blockNumber =  tx.blockNumber

            if (!blockMap.has(blockNumber)){
                blockMap.set(blockNumber,0)
            }
            console.log(tx.effectiveGasPrice)
            console.log(tx.blockNumber)

            blockMap.set(blockNumber, blockMap.get(blockNumber)+1)

        }
    }else{
      nullTx++
    }
}

fs.createReadStream(FILE_TO_READ)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    await getTransactionBlock(row[1])
    console.log("notNullTx", notNullTx)
    console.log(blockMap)
    console.log("nullTx", nullTx)
  })
  .on("end", function () {
    timer(1500)
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

