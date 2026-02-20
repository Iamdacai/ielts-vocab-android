/**
 * Performance optimization configuration
 */

export const PERFORMANCE_CONFIG = {
  // Database optimization
  DATABASE: {
    BATCH_SIZE: 50,
    CACHE_SIZE: 100,
    MAX_CONNECTIONS: 1
  },
  
  // UI/UX optimization
  UI: {
    LIST_ITEM_LIMIT: 20,
    SCROLL_THRESHOLD: 0.8,
    ANIMATION_DURATION: 200
  },
  
  // Network optimization (for future cloud sync)
  NETWORK: {
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    CACHE_TTL: 3600000 // 1 hour
  },
  
  // Audio optimization
  AUDIO: {
    BUFFER_SIZE: 1024,
    SAMPLE_RATE: 16000,
    CHANNELS: 1
  }
};

export default PERFORMANCE_CONFIG;