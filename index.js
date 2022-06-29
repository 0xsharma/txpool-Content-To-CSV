const axios = require('axios')
const fs = require('fs')

var HTTPSWEB3 = 'http://localhost:8545'

const timer = ms => new Promise(res => setTimeout(res, ms))

async function getTxPoolContent(){
    
    var res 
    await axios.post(HTTPSWEB3 ,{
        jsonrpc: '2.0',
        method: 'txpool_content',
        params: [],
        id: 1
    }, {
        headers: {
        'Content-Type': 'application/json',
        },
    }).then((response) => {
        res = response
    })
    return res.data.result
}

async function main(){
    var lastStartingTime = Math.floor(new Date().getTime() / 1000)
    txpoolContent = await getTxPoolContent()
    pending = txpoolContent.pending
    fs.appendFile(`./output/out-${lastStartingTime}.csv`, 'GasPrice' + '\n', function (err) {
        if (err) throw err;
        console.log('Added');
    });
    for (var [key, value] of Object.entries(pending)) {
            
        // eslint-disable-next-line no-unused-vars
        for (var [nonce, txobject] of Object.entries(value)) {
            txobject.gasPrice = parseInt(txobject.gasPrice,16)
            fs.appendFile(`./output/out-${lastStartingTime}.json`, JSON.stringify(txobject) + '\n', function (err) {
                    if (err) throw err;
                    console.log('Added');
            });

            fs.appendFile(`./output/out-${lastStartingTime}.csv`, JSON.stringify(txobject.gasPrice) + ',' + JSON.stringify(txobject.hash) + '\n', function (err) {
                if (err) throw err;
                console.log('Added');
            });

            break
            
        }
    }

    await timer(2000)

}

main()
