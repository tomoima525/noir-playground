import path from "path";
import fs from "fs";
// @ts-ignore -- no types
import { SinglePedersen } from "@noir-lang/barretenberg";
// @ts-ignore -- no types
import { BarretenbergWasm } from "@noir-lang/barretenberg";
import { appendLeaf } from "./appendLeaf";
import { MERKLE_TREE_DEPTH } from "./config";
import { genZeroHashes } from "./genZeroHashes";
import { TreeNode } from "./node-utils";

const writeFile = (nodes: TreeNode[]) => {
  const outPath = path.join(__dirname, "tree.json");
  let fd: number = 0;
  try {
    if (fs.existsSync(outPath)) {
      fs.rmSync(outPath);
    }
    fd = fs.openSync(outPath, "w");
    fs.writeSync(fd, Buffer.from(JSON.stringify(nodes)));
  } catch (err) {
    console.error(err);
  } finally {
    fs.closeSync(fd);
  }
};
/**
 * Seeding country code hashes for each level.
 * Data structure:
 *   id: CountryCodeTree_{level}_{id}
 *   hash
 *   level
 *   siblinghash
 *   parent
 *   createdAt
 */
async function main() {
  const barretenberg = await BarretenbergWasm.new();
  await barretenberg.init();
  const pedersen = new SinglePedersen(barretenberg);
  // Generate zero hashes for insertion padding
  const zeroes: string[] = genZeroHashes(pedersen);
  try {
    // insert from file
    const filePath = path.join(__dirname, "country.csv");
    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.split(/\r?\n/);
    const regex = /\"(.+),(.+)\"/;
    const storage = new Map();
    // start appending to DB
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const simplified = line.replace(regex, "$1"); // "Saint Helena, Ascension and Tristan da Cunha" => "SaintHelena"
      const arr = simplified.split(",");
      console.log("Inserting ", arr[0], arr[1]);
      // encode ISO Country code
      const hash = (
        pedersen.compressInputs([Buffer.from(arr[1], "hex")]) as Buffer
      ).toString("hex");
      appendLeaf({
        storage,
        countryCode: arr[1],
        depth: MERKLE_TREE_DEPTH,
        hash,
        index,
        pedersen,
        zeroes,
      });
    }
    console.log("====== inserted Size", storage.size);
    const nodes = [...storage.values()].map((v) => JSON.parse(v)) as TreeNode[];
    writeFile(nodes);
    // Write to json file
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
