import { LoginForm } from './LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex">
      <div className="hidden lg:flex w-1/2 bg-[var(--color-primary)] flex-col justify-between p-12 relative overflow-hidden">
        {/* Dynamic Gradient / Signature Graphic */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-ink)] to-[var(--color-primary-glow)] opacity-90"></div>
        
        {/* Giant Typographic Element */}
        <div className="absolute -bottom-24 -left-12 text-[22rem] font-extrabold text-white/5 leading-none select-none tracking-tighter mix-blend-overlay">
          KTU
        </div>

        <div className="relative z-10">
          <div className="bg-white rounded-2xl p-2 w-16 h-16 flex items-center justify-center shadow-lg">
            <Image src="/logo.png" alt="KTU Logo" width={48} height={48} className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 text-white max-w-lg mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your Academic <br/> Universe.
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed">
            Access your grades, schedules, and notifications in one unified portal designed for clarity and speed.
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[var(--color-bg)] p-8">
        <LoginForm />
      </div>
    </main>
  )
}
