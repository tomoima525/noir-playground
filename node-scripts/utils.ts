import { BigNumberish } from "ethers";
import { readFileSync } from "fs";

export function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}

export function generateHashPathInput(hashes: BigNumberish[]) {
  let hash_path_input = [];
  for (var i = 0; i < hashes.length; i++) {
    hash_path_input.push(`0x${hashes[i]}`);
  }
  return hash_path_input;
}

export function toUint8array(circuit: string) {
  return new Uint8Array(Buffer.from(circuit, "hex"));
}
