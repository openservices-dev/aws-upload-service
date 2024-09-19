import { LRUCache } from 'lru-cache';
import CacheRepository from '../CacheRepository';

describe('CacheRepository', () => {
  describe('get', () => {
    test('If file does not exist in cache, return undefined', async () => {
      const cacheRepository = new CacheRepository(new LRUCache({ max: 10 }));

      await expect(cacheRepository.get('00000000-0000-0000-0000-000000000000')).resolves.toBeUndefined();
    });

    test('If file is cacheable, return it', async () => {
      const cacheRepository = new CacheRepository(new LRUCache({ max: 10 }));

      await cacheRepository.create({
        id: '00000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: true,
      });

      await expect(cacheRepository.get('00000000-0000-0000-0000-000000000000')).resolves.toEqual({
        id: '00000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: true,
      });
    });

    test('If file is not cacheable, return undefined', async () => {
      const cacheRepository = new CacheRepository(new LRUCache({ max: 10 }));

      await cacheRepository.create({
        id: '00000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: false,
      });

      await expect(cacheRepository.get('00000000-0000-0000-0000-000000000000')).resolves.toBeUndefined();
    });
  });
  describe('find', () => {
    test('Find multiple files', async () => {
      const cacheRepository = new CacheRepository(new LRUCache({ max: 10 }));

      await cacheRepository.create({
        id: '00000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: true,
      });

      await cacheRepository.create({
        id: '10000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: true,
      });

      await cacheRepository.create({
        id: '20000000-0000-0000-0000-000000000000',
        path: '/folder/image.jpg',
        mimetype: 'image/jpeg',
        size: 100,
        cacheable: true,
      });

      await expect(cacheRepository.find({ ids: ['00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000'] })).resolves.toHaveLength(2);
    });
  });
});
