"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden bg-white">
      <div className="relative hidden lg:flex flex-col justify-between p-16 bg-[#1a0f0d] text-white overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-coco-primary/20 rounded-full blur-[180px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-coco-dark/40 rounded-full blur-[150px] opacity-60" />

        <div className="relative z-10 flex items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase opacity-70">
          <ShieldCheck className="w-5 h-5 text-coco-primary" />
          Coco Bambu Lab
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-150 grayscale">
          <Image
            src="/logo.png"
            alt=""
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-black leading-tight tracking-tighter"
          >
            Grandes parcerias <br /> merecem{" "}
            <span className="text-coco-primary">sabores extraordinários.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg font-medium text-white/60 leading-relaxed max-w-sm"
          >
            A plataforma exclusiva para gerenciar eventos e benefícios
            corporativos no maior restaurante do Brasil.
          </motion.p>
        </div>

        <div className="relative z-10 text-[10px] text-white/30 font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} Coco Bambu LAB
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-[420px] space-y-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative w-48 h-24 mb-4">
              <Image
                src="/logo.png"
                alt="Coco Bambu"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Olá, Bem-vindo(a)
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Insira suas credenciais para continuar
              </p>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
