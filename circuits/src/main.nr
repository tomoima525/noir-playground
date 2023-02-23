use dep::std;

fn main(
    recipient: Field,
    priv_key: Field,
    note_root: pub Field,
    index: Field,
    note_hash_path: [Field; 3],
    secret: Field
) -> pub [Field; 2] {
    let pubkey = std::scalar_mul::fixed_base(priv_key);
    let pubkey_x = pubkey[0];
    let pubkey_y = pubkey[1];
    
    // Compute input note commitment
    let note_commitment = std::hash::pedersen([pubkey_x, pubkey_y, secret]);
    
    // Compute input note nullifier
    let nullifier = std::hash::pedersen([note_commitment[0], index, priv_key]);

    // Check that the input note commitment is in the root
    let is_member = std::merkle::check_membership(note_root, note_commitment[0], index, note_hash_path);
    constrain is_member == 1;
    
    // Cannot have unused variables, return the recipient as public output of the circuit
    [nullifier[0], recipient]
}