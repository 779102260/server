#!/usr/bin/env node

const { run } = require('../dist/cli/index.js')
const { name, description, version } = require('../package.json')

run({ name, description, version })
