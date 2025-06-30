#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256,
};

#[derive(Contract)]
struct DiceRouter<SDK> {
    sdk: SDK,
}

pub trait DiceAPI {
    fn validate_roll(&self, random_number: U256) -> U256;
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> DiceAPI for DiceRouter<SDK> {
    #[function_id("validateRoll(uint256)")]
    fn validate_roll(&self, random_number: U256) -> U256 {
        let number = random_number.as_limbs()[0] % 6 + 1;
        U256::from(number)
    }
}

impl<SDK: SharedAPI> DiceRouter<SDK> {
    fn deploy(&mut self) {
        // Required by Fluent SDK - even if empty
    }
}

basic_entrypoint!(DiceRouter);
