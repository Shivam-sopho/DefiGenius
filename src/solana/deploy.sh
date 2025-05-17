#!/bin/bash

# Exit on error
set -e

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "Solana CLI not found. Please install it first:"
    echo "sh -c \"\$(curl -sSfL https://release.solana.com/v1.17.0/install)\""
    exit 1
fi

# Check if program binary exists
if [ ! -f "program/target/deploy/loan_program.so" ]; then
    echo "Program binary not found. Please build the program first:"
    echo "./build.sh"
    exit 1
fi

# Deploy to devnet
echo "Deploying to devnet..."
solana program deploy \
    --program-id program/target/deploy/loan_program-keypair.json \
    program/target/deploy/loan_program.so

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "Deployment successful!"
    echo "Program ID: $(solana address -k program/target/deploy/loan_program-keypair.json)"
else
    echo "Deployment failed!"
    exit 1
fi 