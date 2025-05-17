#!/bin/bash

# Exit on error
set -e

# Build the program
echo "Building the loan program..."
cd program
cargo build-sbf

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Program binary is located at: target/deploy/loan_program.so"
else
    echo "Build failed!"
    exit 1
fi 