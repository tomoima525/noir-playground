use dep::std;

fn main(
  root: Field, 
  leaf: Field, 
  index: Field,
  siblings: [Field; 8],
) -> pub Field {
    
    let new_root = std::merkle::compute_root_from_leaf(leaf, index, siblings);
    constrain new_root == root;
    new_root
}