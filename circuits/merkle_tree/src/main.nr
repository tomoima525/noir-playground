use dep::std;
use dep::noir_merkleroot;

fn main(
  root: Field, 
  leaf: Field, 
  path_indices: [Field; 8],
  siblings: [Field; 8],
) -> pub Field {
    
    let new_root = noir_merkleroot::compute_merkle_root(leaf, path_indices, siblings);
    assert(new_root == root);
    new_root
}