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

// From https://github.com/signorecello/waldo/blob/main/test/index.ts
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
  console.log("========compiled=========\n", compiled);
  const acirByteArray = compiled.circuit;
  const acir = acir_read_bytes(acirByteArray);
  const abi = {
    x: 3,
    y: 4,
    return: 12,
  };
  let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  console.log("===== prover, verifier ready =====\n");
  const proof = await create_proof(prover, acir, abi);
  const verified = await verify_proof(verifier, proof);
  console.log(proof.toString("hex"));
  console.log("verified: ", verified);
};

program().then((v) => {
  process.exit(0);
});
