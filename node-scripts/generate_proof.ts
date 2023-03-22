// 1_mul.ts
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
  // const circuitPath = process.argv[2];
  // console.log({ circuitPath });
  // const compiled_program = compile(
  //   path.resolve(__dirname, `../${circuitPath}`)
  // );
  // let acir = compiled_program.circuit;
  const acirPath = process.argv[2];
  const p = path.resolve(__dirname, `../${acirPath}`);
  const acirByteArray = path_to_uint8array(p);
  const acir = acir_read_bytes(acirByteArray);
  console.log({ p });
  const abi = {
    x: 3,
    y: 4,
    return: 12,
  };
  console.log({ abi });
  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, abi);
  const verified = await verify_proof(verifier, proof);
  // simple output -> easy to use by ffi
  console.log(proof.toString("hex"));
};

program().then((v) => {
  process.exit(0);
});
