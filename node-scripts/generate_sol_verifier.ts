// @ts-ignore
import { initialiseResolver } from "@noir-lang/noir-source-resolver";
import { acir_read_bytes, compile } from "@noir-lang/noir_wasm";
import * as bbjs from "@aztec/bb.js/dest/index.js";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ESM does not have __dirname or __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = async () => {
  const solName = process.argv[3];

  const circuitPath = process.argv[2];
  const p = path.resolve(__dirname, `../${circuitPath}`);
  initialiseResolver(() => {
    try {
      const string = readFileSync(p, { encoding: "utf8" });
      return string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
  const compiled = await compile({});
  console.log(compiled);
  const acirByteArray = compiled.circuit;
  // const acir = acir_read_bytes(acirByteArray);
  const bb = await bbjs.newBarretenbergApiSync();
  // Not generating Solidity file
  const sc = bb.acirGetSolidityVerifier(acirByteArray);
  console.log(sc);
  syncWriteFile(`../src/${solName}_plonk_vk.sol`, sc);
  return true;
};

function syncWriteFile(filename: string, data: any) {
  writeFileSync(path.join(__dirname, filename), data, {
    flag: "w",
  });
}

program().then((v) => {
  process.exit(0);
});
