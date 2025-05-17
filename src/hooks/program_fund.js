import { PublicKey } from '@solana/web3.js';

const programId = new PublicKey('Dtj6mjrmMLFEywJ3D1qyMsLR1ibbruQdoPcWB25x57Jy');
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from('program_fund')],
  programId
);

console.log('Program Fund PDA:', pda.toBase58())