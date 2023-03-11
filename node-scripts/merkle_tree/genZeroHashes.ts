import { MERKLE_TREE_DEPTH } from "./config";
import { createPedersenHash } from "./createPedersenHash";

export const genZeroHashes = (pedersen: any) => {
  let zeroHash = "0";
  // Generate zero hashes for insertion padding
  const zeroes: string[] = [];
  for (let level = 0; level < MERKLE_TREE_DEPTH; level++) {
    zeroHash =
      level === 0 ? zeroHash : createPedersenHash(pedersen, zeroHash, zeroHash);
    zeroes.push(zeroHash);
  }
  return zeroes;
};
