-- (key: item_name, value: 1, "order_list", user_name)
-- 語法為 lua 語言
local n = tonumber(ARGV[1]);
local order_name =  ARGV[2];
if not n or n == 0 then
    return 0;
end

local vals = redis.call("HMGET", KEYS[1], "Total", "Booked");
-- HMGET 得到某個 hash 內某幾個 key 的 value
local total = vals[1];
local booked = vals[2];
if not total or not booked then
    return 0;
end
if booked + n <= total then 
    redis.call("HINCRBY", KEYS[1], "Booked", n);
    -- 增加某個 field 多少    HINCRBY myhash field 1
    redis.call("LPUSH", order_name, ARGV[3]);
    -- 增加陣列內容  LPUSH mylist "world"

    return n;
end
return 0
