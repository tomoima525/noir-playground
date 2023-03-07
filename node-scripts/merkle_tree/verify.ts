import { acir_read_bytes } from "@noir-lang/noir_wasm";
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  // @ts-ignore -- no types
} from "@noir-lang/barretenberg";
import path from "path";
import { generateHashPathInput, path_to_uint8array } from "../utils";
import { generateMerkleProof } from "./generateMerkleProof";

const program = async () => {
  // Load program
  const acirPath = process.argv[2];
  console.log({ acirPath });
  const acirByteArray = path_to_uint8array(
    path.resolve(__dirname, `../../${acirPath}`)
  );
  const acir = acir_read_bytes(acirByteArray);
  console.log("read in acir");

  const [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  // MerkleProof
  const merkleProof = await generateMerkleProof(
    path.resolve(__dirname, `./tree.json`),
    "AX" // index 0
  );

  // Verify that the index 0 exists in the merkle tree
  const proofInput = {
    root: `0x` + merkleProof?.root,
    index: 0,
    leaf: `0x` + merkleProof?.leaf,
    siblings: generateHashPathInput(merkleProof?.siblings || []),
  };

  const proof = await create_proof(prover, acir, proofInput);
  const verified = await verify_proof(verifier, proof);
  console.log({ verified });
};

program().then((v) => {
  process.exit(0);
});
