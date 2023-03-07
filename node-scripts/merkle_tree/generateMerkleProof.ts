import fs from "fs";
import { genZeroHashes } from "./genZeroHashes";
import { MERKLE_TREE_DEPTH } from "./config";
import { BigNumberish } from "ethers";
// @ts-ignore -- no types
import { SinglePedersen } from "@noir-lang/barretenberg";
// @ts-ignore -- no types
import { BarretenbergWasm } from "@noir-lang/barretenberg";
import { TreeNode } from "./node-utils";

export const generateMerkleProof = async (
  path: string,
  countryCode: string
) => {
  let fd: number = 0;
  try {
    fd = fs.openSync(path, "r");
    const barretenberg = await BarretenbergWasm.new();
    await barretenberg.init();
    const pedersen = new SinglePedersen(barretenberg);
    const zeroes = genZeroHashes(pedersen);
    const str = fs.readFileSync(path, "utf-8");
    const nodes = JSON.parse(str);
    const leafNode = nodes.filter(
      (node: TreeNode) => node.countryCode === countryCode
    )[0];
    const root = nodes.filter(
      (node: TreeNode) => node.level === MERKLE_TREE_DEPTH && node.index === 0
    )[0];
    let index = leafNode.index;

    const pathIndices: number[] = [];
    const siblings: BigNumberish[] = [];
    for (let level = 0; level < MERKLE_TREE_DEPTH; level += 1) {
      const position = index % 2;
      const levelStartIndex = index - position;
      const levelEndIndex = levelStartIndex + 2;

      pathIndices[level] = position;

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i !== index) {
          const length = nodes.filter(
            (node: TreeNode) => node.level === level
          ).length;
          if (i < length) {
            const n = nodes.filter(
              (node: TreeNode) => node.id === `CountryCodeTree_${level}_${i}`
            )[0];
            siblings[n.level] = n.hash;
          } else {
            const zeroHash = zeroes[level];
            siblings[level] = zeroHash;
          }
        }
      }

      index = Math.floor(index / 2);
    }

    const merkleProof = {
      leaf: leafNode.hash,
      root: root.hash,
      pathIndices,
      siblings,
    };
    console.log(merkleProof);
    return merkleProof;
  } catch (error) {
    console.log(error);
    return;
  } finally {
    fs.closeSync(fd);
  }
};
