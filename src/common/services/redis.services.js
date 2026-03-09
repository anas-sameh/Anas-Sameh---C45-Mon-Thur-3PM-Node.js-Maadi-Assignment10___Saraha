import {client} from "../../DB/index.js"
export const revokedSessionKey = ({ sid }) => {
  return `RevokeSession::${sid}`
}

export const logoutAllKey = ({ sub }) => {
  return `logoutAllKey::${sub}`
}

export const set = async ({ key, value, ttl = null, NX = false } = {}) => {
  try {
    const data =
      typeof value === "string" ? value : JSON.stringify(value);

    const options = {};

    if (ttl) options.EX = ttl;
    if (NX) options.NX = true;

    return await client.set(key, data, options);
  } catch (error) {
    console.error("Redis SET error:", error);
    return false;
  }
};

export const get = async ({key}) => {
    try {
        const data = await client.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    } catch (error) {
        console.error("Redis GET error:", error);
        return null;
    }
}


export const update = async ({key, value, ttl = null}={}) => {
    try {
        const exists = await client.exists(key);
        if (!exists) return false;
        return await client.set(key, value, ttl);
    } catch (error) {
        console.error("Redis UPDATE error:", error);
        return false;
    }
}

export const deleteKey = async ({key}) => {
    try {
        const result = await client.del(key);
        return result === 1;
    } catch (error) {
        console.error("Redis DELETE error:", error);
        return false;
    }
}


export const expire = async ({key, ttl}) => {
    try {
        const result = await client.expire(key, ttl);
        return result === 1;
    } catch (error) {
        console.error("Redis EXPIRE error:", error);
        return false;
    }
}


export const ttl = async ({key}) => {
    try {
        return await client.ttl(key);
    } catch (error) {
        console.error("Redis TTL error:", error);
        return -2;
    }
}


export const exist = async ({key}) => {
    try {
        const data = await client.exists(key);
        return data === 1 ;
    } catch (error) {
        console.error("Redis TTL error:", error);
        return false;
    }
}

export const allKeysByPrefix = async (baseKey) => {
    return await client.keys(baseKey);
}

export const mget = async (keys=[]) => {
    
    try {
        if (keys.length) {
            return  await client.mGet(keys);
        }
    } catch (error) {
        console.error("Redis TTL error:", error);
        return 0 ;
    }
}