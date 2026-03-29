import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "purge stale checkout drafts",
  { hours: 24 },
  internal.orders.purgeStalePendingOrders,
  {},
);

export default crons;
