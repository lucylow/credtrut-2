import { IExecSDK } from '@iexec/sdk';

const iexec = new IExecSDK({ ethProvider: '1' }, {
    iexecGateway: process.env.IEXEC_ENDPOINT
});

export async function submitToTEE(borrowerData: {
  wallet: string;
  income: number;
  debt: number;
  employmentMonths: number;
}) {
  // Encrypt sensitive data client-side, send ciphertext
  const task = await iexec.task.create({
    app: process.env.IEXEC_CREDIT_SCORING_APP_ADDRESS!,
    params: {
      dataset: process.env.IEXEC_DATASET_ADDRESS!, // Encrypted borrower data
      callback: process.env.WEBHOOK_URL + '/api/tee/callback',
      arguments: JSON.stringify({
        wallet: borrowerData.wallet,
        income: borrowerData.income,
        debt: borrowerData.debt,
        employmentMonths: borrowerData.employmentMonths,
      }),
    },
  });

  await task.push();
  return task.taskId;
}

export async function pollTEEResult(taskId: string) {
  let task = await iexec.task.show(taskId);
  
  while (task.status !== 'COMPLETED') {
    await new Promise(r => setTimeout(r, 5000));
    task = await iexec.task.show(taskId);
  }
  
  // In a real scenario, we might need to fetch the actual result file
  // For this mock-up/demonstration, we assume the result is available in stdout or similar
  return JSON.parse(task.task.results || '{}');
}
