// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/plonk_vk.sol";

contract PlonkVkTest is Test {
    TurboVerifier public verifier;

    function setUp() public {
        verifier = new TurboVerifier();
    }

    function getBasicProofRequest() public pure returns (string[] memory) {
        string[] memory inputs = new string[](3);
        inputs[0] = "yarn";
        inputs[1] = "ts-node";
        inputs[2] = "node-scripts/generate_simple_proof.ts";
        return inputs;
    }

    function testVerify() public {
        string[] memory inputs = getBasicProofRequest();

        bytes memory proof = vm.ffi(inputs);
        assertEq(verifier.verify(proof), true);
    }
}
