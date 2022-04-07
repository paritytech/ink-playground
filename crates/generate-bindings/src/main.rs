// Copyright 2018-2021 Parity Technologies (UK) Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

mod cli;

use crate::cli::Opts;
use clap::Clap;
use ts_rs::export_here;

fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();
    let target = opts.target;
    let target = format!("{}/index.d.ts", &target);

    export_here! {
        backend::services::contract::CompilationResult,
        backend::services::contract::CompilationRequest,

        backend::services::contract::TestingResult,
        backend::services::contract::TestingRequest,

        backend::services::gist::common::Gist,

        backend::services::gist::load::GistLoadResponse,
        backend::services::gist::load::GistLoadRequest,

        backend::services::gist::create::GistCreateResponse,
        backend::services::gist::create::GistCreateRequest
       =>
       &target
    };

    Ok(())
}
