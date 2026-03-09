import {createClient} from "redis"
import { DB_REDIS } from "../../config/env.services.js"

export const client = createClient({
    url:DB_REDIS
})



export const createRedisConnection = async ()=>{
    try {
    await client.connect()
    console.log("Redis connected Succ ✅");
    
    } catch (error) {
    console.log("Redis connected faild ✅" , {error});
    }
    
}
