import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private buildKey(key: string, namespace?: string): string {
    if (!namespace) return key;
    return `${namespace}:${key}`;
  }

  async get<T>(key: string, namespace?: string): Promise<T | undefined> {
    const namespacedKey = this.buildKey(key, namespace);
    const result = await this.cacheManager.get<T>(namespacedKey);
    return result ?? undefined;
  }

  async set<T>(
    key: string,
    value: T,
    ttlMs = 600000,
    namespace?: string,
  ): Promise<void> {
    const namespacedKey = this.buildKey(key, namespace);
    await this.cacheManager.set(namespacedKey, value, ttlMs);
  }

  async del(key: string, namespace?: string): Promise<void> {
    const namespacedKey = this.buildKey(key, namespace);
    await this.cacheManager.del(namespacedKey);
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs = 600000,
    namespace?: string,
  ): Promise<T> {
    const cached = await this.get<T>(key, namespace);
    if (cached !== undefined && cached !== null) {
      return cached;
    }
    const data = await fetcher();
    if (data !== null && data !== undefined) {
      await this.set<T>(key, data, ttlMs, namespace);
    }
    return data;
  }

  async clearNamespace(namespace: string): Promise<void> {
    const store: any = (this.cacheManager as any).store;
    const client: any = store?.client || store?.redis || store?._redisClient;
    if (!client) return;

    const pattern = `${namespace}:*`;
    if (typeof client.scanIterator === 'function') {
      for await (const key of client.scanIterator({ MATCH: pattern })) {
        await client.del(key);
      }
      return;
    }

    const keys = await client.keys(pattern);
    if (keys && keys.length) {
      await client.del(keys);
    }
  }
}
