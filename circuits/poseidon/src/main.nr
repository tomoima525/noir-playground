use dep::std;

fn main(x : Field, y : Field, h: pub Field) {
    let hash1 = std::hash::poseidon::bn254::hash_2([x, y]);
    constrain hash1 == h;
}

#[test]
fn test_main() {
    main(1, 2, 0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a);    
}
