import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import * as authService from '@/services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Introduce tu email');
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      toast.success('Si el email existe, se ha enviado un enlace para restablecer la contraseña');
      navigate('/auth');
    } catch (err: any) {
      console.error('forgotPassword error', err);
      toast.error(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.2), var(--surface-ground), rgba(var(--blue-500-rgb), 0.1))' }}>
      <div className="w-full max-w-30rem">
        <Card>
          <CardHeader>
            <CardTitle>Recuperar contraseña</CardTitle>
            <CardDescription>Introduce el email asociado y te enviaremos un enlace para restablecer la contraseña.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
              <div className="flex flex-column gap-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex justify-content-end">
                <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar enlace'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
