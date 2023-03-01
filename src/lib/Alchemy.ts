import { AlchemyProvider } from "@ethersproject/providers";

/* ****************************************************************************
 * CACHED AVATAR
 * ****************************************************************************/

type CachedAvatar = {
  address: string;
  avatar: string | null;
  exp: number;
};

const isCachedAvatar = (x: unknown): x is CachedAvatar => {
  if (typeof x !== "object" || x === null) {
    return false;
  } else {
    const obj = x as CachedAvatar;
    if (typeof obj.address !== "string") {
      return false;
    }
    if (typeof obj.avatar !== "string" && obj.avatar !== null) {
      return false;
    }
    if (typeof obj.exp !== "number") {
      return false;
    }
    return true;
  }
};

const getCachedAvatar = (address: string): CachedAvatar | null => {
  const key = `avatar-ens-${address}`;
  const cached = localStorage.getItem(key);
  if (cached === null) {
    return null;
  } else {
    const parsed = JSON.parse(cached);
    if (!isCachedAvatar(parsed)) {
      return null;
    }
    if (parsed.exp < Date.now()) {
      return null;
    }

    return parsed;
  }
};

const setCachedAvatar = (address: string, avatar: string | null): void => {
  const key = `avatar-ens-${address}`;
  const minute = 60 * 1000;
  const day = 24 * 60 * minute;
  const jitter = Math.random() * 10 * minute;
  const exp = Date.now() + day + jitter;
  localStorage.setItem(key, JSON.stringify({ address, avatar, exp }));
};

/* ****************************************************************************
 * CACHED NAME
 * ****************************************************************************/

type CachedName = {
  address: string;
  name: string | null;
  exp: number;
};

const isCachedName = (x: unknown): x is CachedName => {
  if (typeof x !== "object" || x === null) {
    return false;
  } else {
    const obj = x as CachedName;
    if (typeof obj.address !== "string") {
      return false;
    }
    if (typeof obj.name !== "string" && obj.name !== null) {
      return false;
    }
    if (typeof obj.exp !== "number") {
      return false;
    }
    return true;
  }
};

const getCachedName = (address: string): CachedName | null => {
  const key = `name-ens-${address}`;
  const cached = localStorage.getItem(key);
  if (cached === null) {
    return null;
  } else {
    const parsed = JSON.parse(cached);
    if (!isCachedName(parsed)) {
      return null;
    }
    if (parsed.exp < Date.now()) {
      return null;
    }

    return parsed;
  }
};

const setCachedName = (address: string, name: string | null): void => {
  const key = `name-ens-${address}`;
  const minute = 60 * 1000;
  const day = 24 * 60 * minute;
  const jitter = Math.random() * 10 * minute;
  const exp = Date.now() + day + jitter;
  localStorage.setItem(key, JSON.stringify({ address, name, exp }));
};

/* ****************************************************************************
 * ALCHEMY PROVIDER
 * ****************************************************************************/

const Provider = new AlchemyProvider(
  "homestead",
  "kmMb00nhQ0SWModX6lJLjXy_pVtiQnjx"
);

export const Alchemy = {
  getAvatar: async (address: string): Promise<string | null> => {
    const cached = getCachedAvatar(address);
    if (cached !== null) {
      return cached.avatar;
    } else {
      const result = await Provider.getAvatar(address);
      setCachedAvatar(address, result);
      return result;
    }
  },
  lookupAddress: async (address: string): Promise<string | null> => {
    const cached = getCachedName(address);
    if (cached !== null) {
      return cached.name;
    } else {
      const result = await Provider.lookupAddress(address);
      setCachedName(address, result);
      return result;
    }
  },
};
