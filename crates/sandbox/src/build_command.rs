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

use crate::docker_command;
use std::{
    path::Path,
    time::Duration,
};
use tokio::process::Command;

const DOCKER_PROCESS_TIMEOUT_SOFT: Duration = Duration::from_secs(20);

const DOCKER_CONTAINER_NAME: &str = "ink-backend";

const DOCKER_WORKDIR: &str = "/builds/contract/";

const DOCKER_OUTPUT: &str = "/playground-result";

pub fn build_format_command(input_file: &Path, output_dir: &Path) -> Command {
    let mut cmd = build_docker_command(input_file, output_dir);

    cmd.arg("rustfmt").args(&["cargo", "fmt"]);

    log::debug!("Formatting command is {:?}", cmd);

    cmd
}

pub fn build_compile_command(input_file: &Path, output_dir: &Path) -> Command {
    let mut cmd = build_docker_command(input_file, output_dir);

    let execution_cmd = build_execution_command();

    cmd.arg(&DOCKER_CONTAINER_NAME).args(&execution_cmd);

    log::debug!("Compilation command is {:?}", cmd);

    cmd
}

fn build_docker_command(input_file: &Path, output_dir: &Path) -> Command {
    let file_name = "lib.rs";

    let mut mount_input_file = input_file.as_os_str().to_os_string();
    mount_input_file.push(":");
    mount_input_file.push(DOCKER_WORKDIR);
    mount_input_file.push(file_name);

    let mut mount_output_dir = output_dir.as_os_str().to_os_string();
    mount_output_dir.push(":");
    mount_output_dir.push(DOCKER_OUTPUT);

    let mut cmd = build_basic_secure_docker_command();

    cmd.arg("--volume")
        .arg(&mount_input_file)
        .arg("--volume")
        .arg(&mount_output_dir);

    cmd
}

fn build_basic_secure_docker_command() -> Command {
    let mut cmd = docker_command!(
        "run",
        "--detach",
        "--cap-drop=ALL",
        // Needed to allow overwriting the file
        "--cap-add=DAC_OVERRIDE",
        "--security-opt=no-new-privileges",
        "--workdir",
        DOCKER_WORKDIR,
        "--net",
        "none",
        "--memory",
        "1024m",
        "--memory-swap",
        "1200m",
        "--env",
        format!(
            "PLAYGROUND_TIMEOUT={}",
            DOCKER_PROCESS_TIMEOUT_SOFT.as_secs()
        ),
    );

    if cfg!(feature = "fork-bomb-prevention") {
        cmd.args(&["--pids-limit", "512"]);
    }

    cmd.kill_on_drop(true);

    cmd
}

fn build_execution_command() -> Vec<String> {
    let target_dir = "/target/ink";

    let clean_cmd = format!(
        "rm -rf {}/contract.* {}/metadata.json",
        target_dir, target_dir
    );
    let build_cmd = "cargo contract build --offline 2>&1".to_string();
    let move_cmd = format!("mv {}/contract.contract {}", target_dir, DOCKER_OUTPUT);

    let command = format!("{} && {} && {}", clean_cmd, build_cmd, move_cmd);

    let cmd = vec!["/bin/bash".to_string(), "-c".to_string(), command];

    cmd
}
