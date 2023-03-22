// 1_mul.ts
import { compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";

// From https://github.com/whitenois3/nplate/blob/main/test/utils/ffiProof.ts#L11
const program = async () => {
  const circuitPath = process.argv[2];
  console.log({ circuitPath });
  const compiled_program = compile(
    path.resolve(__dirname, `../${circuitPath}`)
  );

  let acir = compiled_program.circuit;
  const abi = compiled_program.abi;
  abi.x = 3;
  abi.y = 1;
  abi.return = 4;
  const { parameters, ...proofInput } = abi;
  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, proofInput);
  const verified = await verify_proof(verifier, proof);
  // simple output -> easy to use by ffi
  console.log(proof.toString("hex"));
  console.log("Is the proof valid : ", verified);
};

program().then((v) => {
  process.exit(0);
});
