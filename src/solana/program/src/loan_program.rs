use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_instruction,
};
use borsh::{BorshDeserialize, BorshSerialize};

// Define the loan state that will be stored on-chain
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct LoanAccount {
    pub is_initialized: bool,
    pub borrower: Pubkey,
    pub lender: Pubkey,
    pub amount: u64,          // In lamports (1 SOL = 1_000_000_000 lamports)
    pub term_days: u16,       // Loan duration
    pub interest_rate: u16,   // Interest rate basis points (e.g., 500 = 5%)
    pub start_time: i64,      // Unix timestamp when loan was issued
    pub end_time: i64,        // Unix timestamp when loan is due
    pub is_repaid: bool,      // Whether the loan has been repaid
    pub credit_score: u16,    // Borrower's credit score, managed by AI scoring system
}

// Define program instructions
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum LoanInstruction {
    // Initialize a new loan application
    Initialize {
        amount: u64,
        term_days: u16,
        credit_score: u16,
    },
    // Approve and fund a loan
    ApproveLoan {},
    // Repay a loan
    RepayLoan {},
    // Update the credit score (from AI system)
    UpdateCreditScore { new_score: u16 },
    // Fund the program account
    FundProgram { amount: u64 },
}

// Program logic
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Deserialize instruction data
    let instruction = LoanInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        LoanInstruction::Initialize { amount, term_days, credit_score } => {
            msg!("Instruction: Initialize Loan");
            process_initialize_loan(program_id, accounts, amount, term_days, credit_score)
        },
        LoanInstruction::ApproveLoan {} => {
            msg!("Instruction: Approve Loan");
            process_approve_loan(program_id, accounts)
        },
        LoanInstruction::RepayLoan {} => {
            msg!("Instruction: Repay Loan");
            process_repay_loan(program_id, accounts)
        },
        LoanInstruction::UpdateCreditScore { new_score } => {
            msg!("Instruction: Update Credit Score");
            process_update_credit_score(program_id, accounts, new_score)
        },
        LoanInstruction::FundProgram { amount } => {
            msg!("Instruction: Fund Program");
            process_fund_program(program_id, accounts, amount)
        },
    }
}

// Implementation of loan initialization
fn process_initialize_loan(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
    term_days: u16,
    credit_score: u16,
) -> ProgramResult {
    // Get account iterator
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let borrower_account = next_account_info(account_info_iter)?;
    let loan_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    
    // Verify borrower signed the transaction
    if !borrower_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify system program
    if system_program.key != &solana_program::system_program::id() {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Calculate rent-exempt balance
    let rent = Rent::get()?;
    let space = std::mem::size_of::<LoanAccount>();
    let rent_exempt_balance = rent.minimum_balance(space);
    
    // Create loan account
    solana_program::program::invoke(
        &solana_program::system_instruction::create_account(
            borrower_account.key,
            loan_account.key,
            rent_exempt_balance,
            space as u64,
            program_id,
        ),
        &[borrower_account.clone(), loan_account.clone(), system_program.clone()],
    )?;
    
    // Initialize loan account data
    let loan_data = LoanAccount {
        is_initialized: true,
        borrower: *borrower_account.key,
        lender: Pubkey::default(), // Will be set when loan is approved
        amount,
        term_days,
        interest_rate: 500, // 5% default interest rate
        start_time: 0, // Will be set when loan is approved
        end_time: 0, // Will be set when loan is approved
        is_repaid: false,
        credit_score,
    };
    
    // Serialize and save loan data
    loan_data.serialize(&mut *loan_account.data.borrow_mut())?;
    
    msg!("Loan application created successfully");
    Ok(())
}

// Implementation of loan approval
fn process_approve_loan(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    // Get account iterator
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let lender_account = next_account_info(account_info_iter)?;
    let loan_account = next_account_info(account_info_iter)?;
    let borrower_account = next_account_info(account_info_iter)?;
    let program_fund_account = next_account_info(account_info_iter)?;
    
    // Verify lender signed the transaction
    if !lender_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify program fund account is owned by the program
    if program_fund_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Deserialize loan account data
    let mut loan_data = LoanAccount::try_from_slice(&loan_account.data.borrow())?;
    
    // Verify loan is initialized but not yet approved
    if !loan_data.is_initialized || loan_data.lender != Pubkey::default() {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Verify program has enough funds
    if program_fund_account.lamports() < loan_data.amount {
        return Err(ProgramError::InsufficientFunds);
    }
    
    // Update loan data
    loan_data.lender = *lender_account.key;
    loan_data.start_time = solana_program::clock::Clock::get()?.unix_timestamp;
    loan_data.end_time = loan_data.start_time + (loan_data.term_days as i64 * 24 * 60 * 60);
    
    // Serialize and save updated loan data
    loan_data.serialize(&mut *loan_account.data.borrow_mut())?;
    
    // Transfer funds from program to borrower
    let transfer_instruction = system_instruction::transfer(
        program_fund_account.key,
        borrower_account.key,
        loan_data.amount,
    );
    
    solana_program::program::invoke(
        &transfer_instruction,
        &[program_fund_account.clone(), borrower_account.clone()],
    )?;
    
    msg!("Loan approved and funded successfully");
    Ok(())
}

// Implementation of loan repayment
fn process_repay_loan(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    // Get account iterator
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let borrower_account = next_account_info(account_info_iter)?;
    let loan_account = next_account_info(account_info_iter)?;
    let program_fund_account = next_account_info(account_info_iter)?;
    
    // Verify borrower signed the transaction
    if !borrower_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify program fund account is owned by the program
    if program_fund_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Deserialize loan account data
    let mut loan_data = LoanAccount::try_from_slice(&loan_account.data.borrow())?;
    
    // Verify loan is approved but not yet repaid
    if !loan_data.is_initialized || loan_data.lender == Pubkey::default() || loan_data.is_repaid {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Calculate repayment amount (principal + interest)
    let interest_amount = (loan_data.amount as u128)
        .checked_mul(loan_data.interest_rate as u128)
        .ok_or(ProgramError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(ProgramError::ArithmeticOverflow)? as u64;
    
    let repayment_amount = loan_data.amount.checked_add(interest_amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    
    // Transfer funds from borrower to program
    let transfer_instruction = system_instruction::transfer(
        borrower_account.key,
        program_fund_account.key,
        repayment_amount,
    );
    
    solana_program::program::invoke(
        &transfer_instruction,
        &[borrower_account.clone(), program_fund_account.clone()],
    )?;
    
    // Update loan status
    loan_data.is_repaid = true;
    loan_data.serialize(&mut *loan_account.data.borrow_mut())?;
    
    msg!("Loan repaid successfully");
    Ok(())
}

// Implementation of credit score update
fn process_update_credit_score(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    new_score: u16,
) -> ProgramResult {
    // Get account iterator
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let admin_account = next_account_info(account_info_iter)?;
    let loan_account = next_account_info(account_info_iter)?;
    
    // Verify admin signed the transaction
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize loan account data
    let mut loan_data = LoanAccount::try_from_slice(&loan_account.data.borrow())?;
    
    // Update credit score
    loan_data.credit_score = new_score;
    loan_data.serialize(&mut *loan_account.data.borrow_mut())?;
    
    msg!("Credit score updated successfully");
    Ok(())
}

// Implementation of program funding
fn process_fund_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    // Get account iterator
    let account_info_iter = &mut accounts.iter();
    
    // Get accounts
    let funder_account = next_account_info(account_info_iter)?;
    let program_fund_account = next_account_info(account_info_iter)?;
    
    // Verify funder signed the transaction
    if !funder_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify program fund account is owned by the program
    if program_fund_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Transfer funds from funder to program
    let transfer_instruction = system_instruction::transfer(
        funder_account.key,
        program_fund_account.key,
        amount,
    );
    
    solana_program::program::invoke(
        &transfer_instruction,
        &[funder_account.clone(), program_fund_account.clone()],
    )?;
    
    msg!("Program funded successfully");
    Ok(())
}
