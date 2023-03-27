// @ts-ignore
import { initialiseResolver } from "@noir-lang/noir-source-resolver";
import { acir_read_bytes, compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { toUint8array } from "./utils";

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
  let acirByteArray = toUint8array(compiled.circuit);
  let acir = acir_read_bytes(acirByteArray);

  const [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  const sc = verifier.SmartContract();

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
