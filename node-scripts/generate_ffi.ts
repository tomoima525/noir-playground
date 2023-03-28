// @ts-ignore
import { initialiseResolver } from "@noir-lang/noir-source-resolver";
import { acir_read_bytes, compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";
import { readFileSync } from "fs";

function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}
// From https://github.com/whitenois3/nplate/blob/main/test/utils/ffiProof.ts#L11
const program = async () => {
  const p = path.resolve(__dirname, `../circuits/simple_circuit/src/main.nr`);
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
  const acir = acir_read_bytes(compiled.circuit);
  const abi = {
    x: 3,
    y: 4,
    return: 12,
  };
  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, abi);
  const verified = await verify_proof(verifier, proof);
  // simple output -> easy to use by ffi
  console.log(proof.toString("hex"));
};

program().then((v) => {
  process.exit(0);
});
