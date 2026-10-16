import { submit } from '@/lib/backend/http';
export const runtime = 'nodejs';
export async function POST(request:Request) { return submit(request,'order'); }
