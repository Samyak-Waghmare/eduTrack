import Redis from 'ioredis';

const getRedisClient = () => {
    if (process.env.REDIS_URL) {
        return new Redis(process.env.REDIS_URL);
    }

    const mockStore = new Map();
    return {
        get: async (key) => mockStore.get(key) || null,
        set: async (key, value, mode, duration) => {
            mockStore.set(key, value);
            if (duration) {
                setTimeout(() => mockStore.delete(key), duration * 1000);
            }
            return 'OK';
        },
        del: async (key) => mockStore.delete(key),
    };
};

export const redis = getRedisClient();
