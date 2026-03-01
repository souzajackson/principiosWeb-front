import { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { login } from '@/services/AuthService';
import { ApiError } from '@/lib/api';

interface LoginScreenProps {
  onGoToSignup: () => void;
  onLogin: () => void;
}

export function LoginScreen({ onGoToSignup, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setIsSubmitting(true);
      await login({ email, password }); // salva token no localStorage
      onLogin();
    } catch (err) {
      if (err instanceof ApiError) setErrorMsg(err.message);
      else if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg('Falha ao fazer login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1509205477838-a534e43a849f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGNhdCUyMHRvZ2V0aGVyJTIwcGV0JTIwYWRvcHRpb258ZW58MXx8fHwxNzcyMDI2MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cachorro e gato juntos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-500/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Heart className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" fill="white" />
            <h2 className="text-4xl mb-4">Encontre seu melhor amigo</h2>
            <p className="text-xl opacity-90">
              Milhares de pets esperando por um lar cheio de amor
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
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-6">
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-600">Lembrar de mim</span>
              </label>
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
            >
              Entrar
            </Button>

            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button 
                type="button"
                onClick={onGoToSignup}
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Cadastre-se gratuitamente
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Ao continuar, você concorda com nossos{' '}
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