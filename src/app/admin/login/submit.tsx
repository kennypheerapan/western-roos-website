'use client';
import { useFormStatus } from 'react-dom';
export function LoginButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={disabled || pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}
