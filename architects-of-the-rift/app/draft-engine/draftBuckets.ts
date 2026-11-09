// DRAFT_REALISM §4 — bucket-urile scorului de draft și combinarea lor (Σ bucket × pondere).

import type { BanBucketId, BucketId, PickBucketId } from "./draftTypes";

export type BucketWeights = Partial<Record<BucketId, number>>;

export const PICK_BUCKETS: readonly PickBucketId[] = ["power", "comp", "counter", "comfort", "deny", "info", "style"];
export const BAN_BUCKETS: readonly BanBucketId[] = ["power", "target", "protect", "compDeny", "predict", "hygiene"];

export const UNIT_PICK_WEIGHTS: Readonly<Record<PickBucketId, number>> = Object.freeze(
  Object.fromEntries(PICK_BUCKETS.map((bucket) => [bucket, 1])) as Record<PickBucketId, number>
);
export const UNIT_BAN_WEIGHTS: Readonly<Record<BanBucketId, number>> = Object.freeze(
  Object.fromEntries(BAN_BUCKETS.map((bucket) => [bucket, 1])) as Record<BanBucketId, number>
);

/** Σ bucket × pondere (pondere lipsă = 1). `hygiene` e mereu × 1. */
export function sumBuckets(buckets: Partial<Record<BucketId, number>>, weights: BucketWeights): number {
  let total = 0;
  for (const [bucket, value] of Object.entries(buckets) as [BucketId, number][]) {
    total += value * (bucket === "hygiene" ? 1 : weights[bucket] ?? 1);
  }
  return total;
}
