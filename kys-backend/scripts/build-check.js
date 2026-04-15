#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = process.cwd()

const ROOT_FILES = ['server.js']
const SOURCE_DIRS = [
  'config',
  'controllers',
  'middleware',
  'migrations',
  'models',
  'routes',
  'services',
  'utils',
]

function collectJsFiles(startPath, files = []) {
  const entries = fs.readdirSync(startPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(startPath, entry.name)
    if (entry.isDirectory()) {
      collectJsFiles(fullPath, files)
      continue
    }
    if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

const filesToCheck = []

for (const file of ROOT_FILES) {
  const fullPath = path.join(ROOT, file)
  if (fs.existsSync(fullPath)) {
    filesToCheck.push(fullPath)
  }
}

for (const dir of SOURCE_DIRS) {
  const fullPath = path.join(ROOT, dir)
  if (fs.existsSync(fullPath)) {
    collectJsFiles(fullPath, filesToCheck)
  }
}

const uniqueFiles = [...new Set(filesToCheck)].sort()

if (uniqueFiles.length === 0) {
  console.error('No backend JavaScript files found for build validation.')
  process.exit(1)
}

const errors = []
for (const filePath of uniqueFiles) {
  try {
    execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' })
  } catch (error) {
    errors.push({
      filePath,
      output: String(error.stderr || error.stdout || error.message || ''),
    })
  }
}

if (errors.length > 0) {
  console.error(`Build check failed: ${errors.length} file(s) have syntax errors.`)
  for (const err of errors) {
    console.error(`\n${path.relative(ROOT, err.filePath)}\n${err.output}`)
  }
  process.exit(1)
}

console.log(`Build check passed for ${uniqueFiles.length} JavaScript file(s).`)
