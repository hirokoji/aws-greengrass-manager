#!/usr/bin/env node

import {Cli} from "./Cli";

const cli = new Cli();
cli.cli(process.argv);
