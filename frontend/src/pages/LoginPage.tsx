import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert(t('login_details.pleaseFillFields'));
      return;
    }
    await login(email, password);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center bg-background text-foreground p-4"
      style={{ minHeight: 'calc(100vh - 140px)' }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('loginPageTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('login_form_message')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-8 shadow-lg rounded-lg bg-card">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('login_details.emailLabel')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={t('login_details.emailPlaceholder')}
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('login_details.passwordLabel')}</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder={t('login_details.passwordPlaceholder')}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('login_details.loading')}</>
            ) : (
              t('login_details.loginButton')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 