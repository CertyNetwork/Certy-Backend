import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Model } from 'sequelize-typescript';
import { BuildOptions } from 'sequelize';

const CACHE_EXPIRE_TIME = 60;
const defaultOptions = {
  raw: true,
  nest: true,
};
type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Model;
};

@Injectable()
export class DatabaseCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async findOne(key: string, model: ModelStatic, options: any, ttl?: number) {
    const rawValue = await this.cacheService.get(key);
    let result = JSON.parse(rawValue);
    if (!result || Object.keys(result).length === 0) {
      const data = await model.findOne({
        ...options,
        defaultOptions,
      });
      if (data) {
        await this.cacheService.set(
          key,
          JSON.stringify(data),
          ttl ? ttl : CACHE_EXPIRE_TIME,
        );
        result = data;
      }
    }
    return result;
  }
}
