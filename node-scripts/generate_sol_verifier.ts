import { compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";
import { writeFileSync } from "fs";
const program = async () => {
  const circuitPath = process.argv[2];
  const solName = process.argv[3];
  console.log({ circuitPath });
  const compiled_program = compile(
    path.resolve(__dirname, `../${circuitPath}`)
  );

  let acir = compiled_program.circuit;

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
