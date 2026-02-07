import crypto from 'crypto';

export function verifyTelegramInitData(initData: string): boolean {
  if (!process.env.TELEGRAM_BOT_TOKEN) return false;
  
  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  data.delete('hash');
  
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();
    
  const checkString = Array.from(data.entries())
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');
    
  const checkHash = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');
    
  return hash === checkHash;
}
