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

//! This module contains the compile service of the backend. It receives a
//! string of Rust source code and returns the result of compiling the code.
//! For security reason we run the compilation inside a Docker container.
//! In order to ease testing, the service is parameterized by a compile
//! strategy. This allows easy mocking.

pub use sandbox::{
    CompilationRequest,
    CompilationResult,
    Sandbox,
};

use actix_web::{
    web::Json,
    HttpResponse,
    Responder,
};

pub use sandbox::{
    RustFormatRequest,
    RustFormatResponse,
};

use sandbox;

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATION
// -------------------------------------------------------------------------------------------------

fn format_code(req: RustFormatRequest) -> sandbox::Result<RustFormatResponse> {
    let sandbox = Sandbox::new()?;

    sandbox.rust_format(&req)
}

pub async fn route_rust_format(req: Json<RustFormatRequest>) -> impl Responder {
    let result = format_code(RustFormatRequest {
        code: req.code.to_string(),
    });

    match result {
        Ok(result) => {
            let format_result = serde_json::to_string(&result).unwrap();
            HttpResponse::Ok().body(format_result)
        }
        Err(err) => {
            eprintln!("{:?}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}
