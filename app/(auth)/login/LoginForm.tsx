'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <div className="w-full max-w-sm space-y-8 animate-fade-up">
      <div className="space-y-3 text-center lg:text-left">
        <div className="lg:hidden flex justify-center mb-8">
           <div className="bg-[var(--color-primary)] rounded-full p-0.5 h-14 w-14 flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 overflow-hidden">
             <Image src="/logo.png" alt="KTU Logo" width={56} height={56} className="object-cover h-full w-full brightness-0 invert" />
           </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Welcome back
        </h2>
        <p className="text-[var(--color-muted)] font-medium">
          Enter your register number and password to sign in to the portal.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="student-id" className="text-xs uppercase tracking-widest font-semibold text-[var(--color-muted)]">Register Number</Label>
          <Input
            id="student-id"
            name="studentId"
            placeholder="e.g. TVE22CS001"
            required
            className="rounded-xl h-12 px-4 bg-[var(--color-surface)] border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:border-transparent uppercase transition-all shadow-none text-base font-medium placeholder:normal-case placeholder:font-normal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs uppercase tracking-widest font-semibold text-[var(--color-muted)]">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-xl h-12 px-4 bg-[var(--color-surface)] border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:border-transparent transition-all shadow-none text-base"
          />
        </div>
        
        {state?.error && (
          <div className="p-3 bg-red-50 text-[var(--color-destructive)] text-sm font-semibold rounded-xl text-center border border-red-100">
            {state.error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 rounded-xl text-base font-semibold bg-[var(--color-primary)] hover:opacity-90 hover:bg-[var(--color-primary)] transition-all shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer mt-2"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
