"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrlFromParams = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const desiredCallbackUrl =
      callbackUrlFromParams ||
      (email.trim().toLowerCase() === "executivo@siloferr.com.br"
        ? "/executive"
        : "/admin");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: desiredCallbackUrl,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      router.push(desiredCallbackUrl);
      router.refresh();
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            E-mail Corporativo
          </label>
          <input
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="seu@siloferr.com.br"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Senha
          </label>
          <input
            type="password"
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary justify-center"
        >
          {loading ? "Autenticando..." : "Entrar no Sistema"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-alt px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-nobg.png"
            alt="Siloferr Logo"
            width={180}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </div>

        <h2 className="text-2xl font-heading font-bold text-center text-primary-dark mb-6">
          Acesso Restrito
        </h2>

        <Suspense
          fallback={
            <div className="text-center text-sm text-text-muted">
              Carregando formulário...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
