import { Redis } from "ioredis";
const redisUri =
  "rediss://default:AVNS_5nXm08-yOLYNx7ueW5a@task-autipruthviraj-d03f.g.aivencloud.com:14231";
const redis = new Redis(redisUri);

export { redis };
