// @ts-ignore -- no types
import { SinglePedersen } from "@noir-lang/barretenberg";

export function createPedersenHash(
  pedersen: any,
  left: string,
  right: string
): string {
  let leftBuffer = Buffer.from(left, "hex");
  let rightBuffer = Buffer.from(right, "hex");
  let hashRes = pedersen.compress(leftBuffer, rightBuffer);
  return hashRes.toString("hex");
}
