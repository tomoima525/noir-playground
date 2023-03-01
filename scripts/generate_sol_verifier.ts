import { compile } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  // create_proof_with_witness,
} from "@noir-lang/barretenberg/dest/client_proofs";
import path from "path";
import { writeFileSync } from "fs";
const program = async () => {
  const compiled_program = compile(
    path.resolve(__dirname, "../circuits/src/main.nr")
  );

  let acir = compiled_program.circuit;
  const abi = compiled_program.abi;
  abi.x = 3;
  abi.y = 4;
  abi.return = 12;

  const [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  const sc = verifier.SmartContract();

  syncWriteFile("../circuits/contract/plonk_vk.sol", sc);
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
