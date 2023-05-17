const fs = require('fs');
const Redis = require('ioredis');
const redis = new Redis({
    host: "127.0.0.1", // Redis host
    port: 6379, // Redis port
    password: '',
});

redis.on('error', function(error){
    console.log(error);
})

async function prepare(item_name){
    await redis.hmset(item_name, "Total", 100, 'Booked', 0);
    // item_name = {
    //  Total: 100,
    //  Booked: 0
    // }
    // key = {
    //  field: value
    // }
}

const secKillScript = fs.readFileSync('./secKill.lua');

async function secKill(item_name, user_name){
    const sha1 = await redis.script("load", secKillScript);
    redis.evalsha(sha1, 1, item_name, 1, "order_list", user_name);
    // 放進去的參數 (程式，幾個key，key，argv）
}

async function main(){
    console.time('secKill');
    const item_name = 'item_name';
    prepare(item_name);
    for(var i=0; i<10000, i++;){
        const user_name = "baobao" + i;
        secKill(item_name, user_name);
    }
    console.timeEnd('secKill');
}

main();