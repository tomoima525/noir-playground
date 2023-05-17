import path from "path";
import { program } from "./proof_program";

// From https://github.com/signorecello/waldo/blob/main/test/index.ts
const runProgram = async () => {
  const p = path.resolve(__dirname, `../circuits/simple_circuit/src/main.nr`);
  const abi = {
    x: 3,
    y: 4,
    return: 12,
  };
  await program(p, abi);
};

runProgram().then((v) => {
  process.exit(0);
});
