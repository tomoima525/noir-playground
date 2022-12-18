// 1_mul.ts

import { compile, acir_from_bytes } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  create_proof_with_witness,
} from "@noir-lang/barretenberg/dest/client_proofs";
// import {
//   packed_witness_to_witness,
//   serialise_public_inputs,
//   // compute_witnesses,
// } from "@noir-lang/aztec_backend";
import path from "path";

const program = async () => {
  const compiled_program = compile(path.resolve(__dirname, "../src/main.nr"));

  let acir = compiled_program.circuit;
  const abi = compiled_program.abi;
  abi.x = 3;
  abi.y = 4;
  abi.return = 12;

  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  const proof = await create_proof(prover, acir, abi);
  const verified = await verify_proof(verifier, proof);
  console.log({ verified });
};

program();
