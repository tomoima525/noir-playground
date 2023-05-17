import path from "path";
import { program } from "./proof_program";

// From https://github.com/signorecello/waldo/blob/main/test/index.ts
const runProgram = async () => {
  const p = path.resolve(__dirname, `../circuits/poseidon/src/main.nr`);
  const abi = {
    x: 1,
    y: 2,
    h: 0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189an,
  };
  await program(p, abi);
};

runProgram().then((v) => {
  process.exit(0);
});
