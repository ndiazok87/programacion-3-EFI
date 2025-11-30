import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !profile) {
      navigate("/auth");
    }
  }, [profile, loading, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-5 surface-0 border-bottom-1 surface-border shadow-1">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-2">
            <h1 className="text-xl font-bold text-900">AgroPrecision</h1>
          </div>
          <div className="flex align-items-center gap-3">
            <span className="text-sm text-600 hidden md:inline">{profile?.nombre || profile?.correo}</span>
            <span className="text-xs px-2 py-1 border-round bg-primary-50 text-primary-700 font-medium uppercase">{profile?.rol}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="p-button-sm">
              <i className="pi pi-sign-out mr-2"></i>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>
      <div className="pt-6 mt-6">
        <Hero />

        {/* Quick Access Cards */}
        <section className="py-6 surface-50">
          <div className="w-full max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-5 text-center text-900">Acceso Rápido</h2>
            <div className="grid">
              <div className="col-12 md:col-6 lg:col-3 p-3">
                <Card className="cursor-pointer hover:shadow-4 transition-duration-200 h-full" onClick={() => navigate('/parcelas')}>
                  <CardHeader>
                    <CardTitle className="flex align-items-center gap-2">
                      <i className="pi pi-map-marker text-primary text-xl"></i>
                      Parcelas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-600 m-0">Gestiona tus parcelas y cultivos</p>
                  </CardContent>
                </Card>
              </div>

              <div className="col-12 md:col-6 lg:col-3 p-3">
                <Card className="cursor-pointer hover:shadow-4 transition-duration-200 h-full" onClick={() => navigate('/actividades')}>
                  <CardHeader>
                    <CardTitle className="flex align-items-center gap-2">
                      <i className="pi pi-calendar text-primary text-xl"></i>
                      Actividades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-600 m-0">Programa y monitorea actividades</p>
                  </CardContent>
                </Card>
              </div>

              <div className="col-12 md:col-6 lg:col-3 p-3">
                <Card className="cursor-pointer hover:shadow-4 transition-duration-200 h-full" onClick={() => navigate('/recursos')}>
                  <CardHeader>
                    <CardTitle className="flex align-items-center gap-2">
                      <i className="pi pi-box text-primary text-xl"></i>
                      Recursos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-600 m-0">Administra recursos y equipamiento</p>
                  </CardContent>
                </Card>
              </div>

              {profile?.rol === 'admin' && (
                <div className="col-12 md:col-6 lg:col-3 p-3">
                  <Card className="cursor-pointer hover:shadow-4 transition-duration-200 h-full" onClick={() => navigate('/trabajadores')}>
                    <CardHeader>
                      <CardTitle className="flex align-items-center gap-2">
                        <i className="pi pi-users text-primary text-xl"></i>
                        Trabajadores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-600 m-0">Gestiona tu equipo de trabajo</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        <Dashboard />
        <Features />
      </div>
    </div>
  );
};

export default Index;
