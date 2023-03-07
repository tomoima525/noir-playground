import { BigNumberish } from "ethers";
import { createPedersenHash } from "./createPedersenHash";
import { nodeCreate, nodeGet, nodeUpdate, TreeNode } from "./node-utils";

export const appendLeaf = async ({
  storage,
  countryCode,
  depth,
  index,
  hash,
  pedersen,
  zeroes,
}: {
  storage: Map<string, string>;
  countryCode: string;
  depth: number;
  index: number;
  hash: BigNumberish;
  pedersen: any;
  zeroes: any[];
}) => {
  let currentIndex = index;
  // internal id should be easy to query by level and index
  let node: TreeNode = {
    hash,
    id: `CountryCodeTree_0_${index}`,
    countryCode,
    index,
    level: 0,
    siblinghash: null,
    parent: null,
    createdAt: new Date().toISOString(),
  };

  nodeCreate({
    storage,
    item: node,
  });
  // // For Querying with hash, just for leaves
  // nodeCreate({
  //   storage,
  //   item: {
  //     hash,
  //     id: `CountryCodeTree_0_${index}`,
  //     createdAt: new Date().toISOString(),
  //   },
  // });

  for (let level = 0; level < depth; level++) {
    if (currentIndex % 2 === 0) {
      node.siblinghash = zeroes[level];
      let parentNode: TreeNode | undefined;
      try {
        const id = `CountryCodeTree_${level + 1}_${Math.floor(
          currentIndex / 2
        )}`;
        parentNode = nodeGet({
          id,
          storage,
        });
      } catch {}

      if (parentNode) {
        parentNode.hash = createPedersenHash(
          pedersen,
          node.hash as string,
          node?.siblinghash as string
        );

        nodeUpdate({
          storage,
          id: parentNode.id,
          newNode: { hash: parentNode.hash },
        });
      } else {
        const parentLevel = level + 1;
        const parentIndex = Math.floor(currentIndex / 2);
        const parentHash = createPedersenHash(
          pedersen,
          node.hash as string,
          node?.siblinghash as string
        );
        parentNode = {
          countryCode: null,
          hash: parentHash,
          id: `CountryCodeTree_${parentLevel}_${parentIndex}`,
          index: parentIndex,
          level: parentLevel,
          siblinghash: null,
          parent: null,
          createdAt: new Date().toISOString(),
        };
        nodeCreate({
          storage,
          item: parentNode,
        });
      }
      nodeUpdate({
        storage,
        id: node.id,
        newNode: {
          parent: parentNode,
        },
      });
      node = parentNode;
    } else {
      const siblingId = `CountryCodeTree_${level}_${currentIndex - 1}`;
      const siblingNode = nodeGet({
        storage,
        id: siblingId,
      });
      if (!siblingNode) {
        throw new Error("No siblign");
      }

      node.siblinghash = siblingNode.hash;

      const parentId = `CountryCodeTree_${level + 1}_${Math.floor(
        currentIndex / 2
      )}`;
      const parentNode = nodeGet({
        storage,
        id: parentId,
      });

      if (!parentNode) {
        throw new Error("No siblign");
      }
      const newParentNode = {
        ...parentNode,
        hash: createPedersenHash(
          pedersen,
          siblingNode.hash as string,
          node.hash as string
        ),
      };

      node.parent = newParentNode;

      // update node's parent and sibling
      nodeUpdate({
        storage,
        id: node.id,
        newNode: {
          parent: newParentNode,
          siblinghash: siblingNode.hash,
        },
      });

      // Update sibling's parent and sibling(= node)
      nodeUpdate({
        storage,
        id: siblingId,
        newNode: {
          parent: newParentNode,
          siblinghash: node.hash,
        },
      });
      // update parent's hash
      nodeUpdate({
        storage,
        id: parentId,
        newNode: {
          hash: newParentNode.hash,
        },
      });

      node = newParentNode;
    }

    currentIndex = Math.floor(currentIndex / 2);
  }
};
