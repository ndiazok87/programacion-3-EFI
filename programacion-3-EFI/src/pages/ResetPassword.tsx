import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { apiJson } from '@/lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const validate = () => {
    if (!token) return 'Token requerido';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
    if (password !== confirm) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    try {
      setLoading(true);
      await apiJson('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
      toast.success('Contraseña restablecida correctamente. Inicia sesión.');
      navigate('/auth');
    } catch (e: any) {
      toast.error(e.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.2), var(--surface-ground), rgba(var(--blue-500-rgb), 0.1))' }}>
      <div className="w-full max-w-30rem">
        <Card>
          <CardHeader>
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>Introduce el token recibido por email y tu nueva contraseña.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
              <div className="flex flex-column gap-2">
                <Label htmlFor="token">Token</Label>
                <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
              </div>
              <div className="flex flex-column gap-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex flex-column gap-2">
                <Label htmlFor="confirm">Confirmar contraseña</Label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <div className="flex justify-content-end gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Restablecer'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
