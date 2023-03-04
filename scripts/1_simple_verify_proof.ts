// 1_mul.ts
import { compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";

const program = async () => {
  const compiled_program = compile(
    path.resolve(__dirname, "../circuits/src/main.nr")
  );

  let acir = compiled_program.circuit;
  const abi = compiled_program.abi;
  abi.x = 3;
  abi.y = 4;
  abi.return = 12;
  const { parameters, ...proofInput } = abi;
  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, proofInput);
  const verified = await verify_proof(verifier, proof);
  console.log({ verified });
  return true;
};

program().then((v) => {
  process.exit(0);
});
