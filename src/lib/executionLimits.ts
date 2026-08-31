export const DEFAULT_EXECUTION_LIMITS = {
  developerApi: {
    name: 'Cratera Developer API',
    authType: 'API Key (cr_live_...) or Session Bearer Token',
    languages: ['rust', 'python', 'cpp', 'c', 'go', 'node', 'typescript', 'java', 'csharp'] as const,
    standard: {
      dailyQuota: 250,
      burstPerMin: 30,
      ipBurstPerMin: 60,
      ipDailyShield: 500,
      maxExecutionMs: 10_000,
      maxCodeBytes: 64 * 1024,
      maxHarnessBytes: 256 * 1024,
    },
  },

  websiteExecution: {
    name: 'Cratery Playground & Contest Judge',
    engine: 'Hardware-isolated Linux Firecracker microVM',
    guest: {
      runsPerHour: 100,
      submitsPerHour: 100,
      burstPerMin: 15,
      windowSeconds: 3600,
    },
    registeredUser: {
      hourlyQuota: 250,
      burstRunPerMin: 20,
      burstSubmitPerMin: 15,
      windowSeconds: 3600,
    },
    code: {
      maxCodeBytes: 64 * 1024,
      maxHarnessBytes: 256 * 1024,
    },
    clientCache: {
      enabled: true,
      strategy: 'Content-Hashed Versioned LRU + SessionStorage',
      latency: '0ms on cached re-runs',
    },
  },
} as const

export const EXECUTION_LIMITS = DEFAULT_EXECUTION_LIMITS
