import { BigNumberish } from "ethers";

export type TreeNode = {
  countryCode?: string | null;
  hash: BigNumberish;
  id: string;
  index?: number;
  level?: number;
  parent?: TreeNode | null;
  siblinghash?: BigNumberish | null;
  createdAt: string;
};

export const nodeCreate = ({
  storage,
  item,
}: {
  storage: Map<string, string>;
  item: TreeNode;
}) => {
  storage.set(item.id, JSON.stringify(item));
};

export const nodeGet = ({
  id,
  storage,
}: {
  storage: Map<string, string>;
  id: string;
}): TreeNode | undefined => {
  const node = storage.get(id);
  if (!node) {
    return undefined;
  }
  return JSON.parse(node) as TreeNode;
};

export const nodeUpdate = ({
  storage,
  id,
  newNode,
}: {
  storage: Map<string, string>;
  id: string;
  newNode: {
    hash?: string;
    parent?: TreeNode;
    siblinghash?: BigNumberish;
  };
}) => {
  const n = storage.get(id);
  if (!n) {
    return undefined;
  }
  const node = JSON.parse(n) as TreeNode;
  const updatedNode = { ...node, ...newNode };
  storage.set(id, JSON.stringify(updatedNode));
  return updatedNode;
};
