import { LRUCache } from 'lru-cache';

const container = {
  get LRU(): LRUCache<string, unknown> {
    if (typeof this._lru === 'undefined') {
      this._lru = new LRUCache<string, unknown>({ max: 250 });
    }
    
    return this._lru;
  },
};

export default container;
