import { acir_read_bytes } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}

const program = async () => {
  const solName = process.argv[3];
  // const circuitPath = process.argv[2];
  // const p = path.resolve(__dirname, `../${circuitPath}`);
  // Doesn't work somehow
  // const compiled_program = compile(p);
  // let acir = compiled_program.circuit;

  const acirPath = process.argv[2];
  const p = path.resolve(__dirname, `../${acirPath}`);
  console.log({ p });
  let acirByteArray = path_to_uint8array(p);
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
