"use strict";
// 1_mul.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const noir_wasm_1 = require("@noir-lang/noir_wasm");
const client_proofs_1 = require("@noir-lang/barretenberg/dest/client_proofs");
// import {
//   packed_witness_to_witness,
//   serialise_public_inputs,
//   // compute_witnesses,
// } from "@noir-lang/aztec_backend";
const path_1 = __importDefault(require("path"));
const program = async () => {
    const compiled_program = (0, noir_wasm_1.compile)(path_1.default.resolve(__dirname, "../src/main.nr"));
    let acir = compiled_program.circuit;
    const abi = compiled_program.abi;
    abi.x = 3;
    abi.y = 4;
    abi.return = 12;
    let [prover, verifier] = await (0, client_proofs_1.setup_generic_prover_and_verifier)(acir);
    const proof = await (0, client_proofs_1.create_proof)(prover, acir, abi);
    const verified = await (0, client_proofs_1.verify_proof)(verifier, proof);
    console.log({ verified });
};
program();
