import { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, User, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { createUser } from '@/services/UserService';
import { ApiError } from '@/lib/api';
import { UserRole } from '@/services/enums';
import { login } from '@/services/AuthService';

interface SignupScreenProps {
  onProceedToShelter: (userData: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onGoToLogin: () => void;
  onSignupComplete: () => void;
}

export function SignupScreen({ onProceedToShelter, onGoToLogin, onSignupComplete }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShelter, setIsShelter] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const role: UserRole = isShelter ? 'SHELTER' : 'USER';
    console.log("tentando")
    try {
      setIsSubmitting(true);

      await createUser({ name, email, password, role });
      await login(email, password);
      
      if (isShelter) onProceedToShelter({ name, email, password });
      else onSignupComplete();
    } catch (err) {
      if (err instanceof ApiError) setErrorMsg(err.message);
      else if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg('Falha ao criar conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1700665537604-412e89a285c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwdm9sdW50ZWVycyUyMGRvZ3MlMjBjYXRzfGVufDF8fHx8MTc3MjAyNjkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Voluntários com animais"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-500/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Heart className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" fill="white" />
            <h2 className="text-4xl mb-4">Faça parte da nossa comunidade</h2>
            <p className="text-xl opacity-90">
              Ajude a conectar pets a lares amorosos
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo e Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Heart className="w-10 h-10 text-purple-600" fill="currentColor" />
              <h1 className="text-4xl text-purple-600">PetConnect</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Crie sua conta e comece a ajudar
            </p>
          </div>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>

            <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isShelter}
                  onChange={(e) => setIsShelter(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">Sou um abrigo de animais</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Marque esta opção se você representa uma organização ou abrigo
                  </p>
                </div>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
            >
              Criar conta
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button 
                type="button"
                onClick={onGoToLogin}
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="#" className="underline hover:text-gray-700">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="underline hover:text-gray-700">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}