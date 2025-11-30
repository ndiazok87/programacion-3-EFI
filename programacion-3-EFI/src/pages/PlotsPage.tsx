import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlots } from '@/contexts/PlotsContext';
// PrimeReact native components
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';

export default function PlotsPage() {
  const { profile, loading: authLoading } = useAuth();
  const { plots, loading, createPlot, updatePlot, deletePlot } = usePlots();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    superficie: 0,
    tipo_cultivo: '',
    estado: ''
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCultivo, setFilterCultivo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  const canCreate = profile?.rol === 'admin';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'gestor';
  const canDelete = profile?.rol === 'admin';

  // Dropdown options
  const cultivoOptions = [
    { label: 'Todos los cultivos', value: 'todos' },
    { label: 'Maíz', value: 'maiz' },
    { label: 'Trigo', value: 'trigo' },
    { label: 'Soja', value: 'soja' },
    { label: 'Girasol', value: 'girasol' },
    { label: 'Otro', value: 'otro' }
  ];

  const estadoOptions = [
    { label: 'Todos los estados', value: 'todos' },
    { label: 'En Preparación', value: 'en preparacion' },
    { label: 'Sembrado', value: 'sembrado' },
    { label: 'Cosechado', value: 'cosechado' }
  ];

  const cultivoFormOptions = cultivoOptions.filter(o => o.value !== 'todos');
  const estadoFormOptions = estadoOptions.filter(o => o.value !== 'todos');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlot) {
        await updatePlot(editingPlot.id, {
          nombre: formData.nombre,
          superficie: formData.superficie,
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any
        });
      } else {
        await createPlot({
          nombre: formData.nombre,
          superficie: formData.superficie,
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      superficie: 0,
      tipo_cultivo: '',
      estado: ''
    });
    setEditingPlot(null);
  };

  const handleEdit = (plot: any) => {
    setEditingPlot(plot);
    setFormData({
      nombre: plot.nombre,
      superficie: plot.superficie,
      tipo_cultivo: plot.tipo_cultivo,
      estado: plot.estado
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta parcela?')) {
      await deletePlot(id);
    }
  };

  const filteredPlots = plots.filter(plot => {
    const matchesSearch = plot.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCultivo = filterCultivo === 'todos' || plot.tipo_cultivo === filterCultivo;
    const matchesEstado = filterEstado === 'todos' || plot.estado === filterEstado;
    return matchesSearch && matchesCultivo && matchesEstado;
  });

  if (authLoading || loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        onClick={() => setIsDialogOpen(false)}
        className="p-button-text"
      />
      <Button
        label={editingPlot ? 'Actualizar' : 'Crear'}
        onClick={handleSubmit}
        severity="success"
      />
    </div>
  );

  return (
    <div className="min-h-screen surface-ground">
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <h1 className="text-2xl font-bold text-900 m-0">AgroPrecision - Parcelas</h1>
          <Button
            label="Volver al Dashboard"
            icon="pi pi-arrow-left"
            className="p-button-text"
            onClick={() => navigate('/')}
          />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header con filtros */}
        <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 gap-3">
          <h2 className="text-3xl font-bold text-900 m-0">Gestión de Parcelas</h2>

          <div className="flex flex-column md:flex-row gap-2 w-full md:w-auto">
            <span className="p-input-icon-left w-full md:w-auto">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-15rem"
              />
            </span>

            <Dropdown
              value={filterCultivo}
              options={cultivoOptions}
              onChange={(e) => setFilterCultivo(e.value)}
              placeholder="Tipo de cultivo"
              className="w-full md:w-12rem"
            />

            <Dropdown
              value={filterEstado}
              options={estadoOptions}
              onChange={(e) => setFilterEstado(e.value)}
              placeholder="Estado"
              className="w-full md:w-12rem"
            />

            {canCreate && (
              <Button
                label="Nueva Parcela"
                icon="pi pi-plus"
                onClick={() => setIsDialogOpen(true)}
                severity="success"
                className="w-full md:w-auto"
              />
            )}
          </div>
        </div>

        {/* DIALOG MODAL - Estilo MINIMALISTA */}
        <Dialog
          visible={isDialogOpen}
          onHide={() => { setIsDialogOpen(false); resetForm(); }}
          header="Nueva Parcela"
          footer={dialogFooter}
          style={{ width: '400px' }}
          modal
        >
          <form onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">

            {/* Nombre */}
            <div className="flex flex-column gap-2">
              <label htmlFor="nombre" className="font-medium">Nombre</label>
              <InputText
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            {/* Superficie */}
            <div className="flex flex-column gap-2">
              <label htmlFor="superficie" className="font-medium">Superficie (ha)</label>
              <InputNumber
                id="superficie"
                value={formData.superficie}
                onValueChange={(e) => setFormData({ ...formData, superficie: e.value || 0 })}
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={2}
                min={0}
                suffix=" ha"
                required
              />
            </div>

            {/* Tipo de Cultivo */}
            <div className="flex flex-column gap-2">
              <label htmlFor="tipo_cultivo" className="font-medium">Tipo de Cultivo</label>
              <Dropdown
                id="tipo_cultivo"
                value={formData.tipo_cultivo}
                options={cultivoFormOptions}
                onChange={(e) => setFormData({ ...formData, tipo_cultivo: e.value })}
                placeholder="Maíz"
                required
              />
            </div>

            {/* Estado */}
            <div className="flex flex-column gap-2">
              <label htmlFor="estado" className="font-medium">Estado</label>
              <Dropdown
                id="estado"
                value={formData.estado}
                options={estadoFormOptions}
                onChange={(e) => setFormData({ ...formData, estado: e.value })}
                placeholder="En Preparación"
                required
              />
            </div>

          </form>
        </Dialog>

        {/* Grid de parcelas */}
        <div className="grid">
          {filteredPlots.length === 0 ? (
            <div className="col-12 text-center py-6">
              <i className="pi pi-inbox text-400" style={{ fontSize: '3rem' }}></i>
              <p className="text-600 mt-3">No se encontraron parcelas</p>
            </div>
          ) : (
            filteredPlots.map((plot) => (
              <div key={plot.id} className="col-12 md:col-6 lg:col-4 p-3">
                <Card className="h-full shadow-2">
                  <div className="flex justify-content-between align-items-start mb-3">
                    <h3 className="m-0 text-xl font-bold">{plot.nombre}</h3>
                    <Badge
                      value={plot.estado}
                      severity={
                        plot.estado === 'sembrado' ? 'success' :
                          plot.estado === 'cosechado' ? 'info' :
                            'warning'
                      }
                    />
                  </div>

                  <div className="flex flex-column gap-2 text-600 mb-3">
                    <p><strong>Superficie:</strong> {plot.superficie} ha</p>
                    <p><strong>Cultivo:</strong> {plot.tipo_cultivo}</p>
                  </div>

                  {(canEdit || canDelete) && (
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button
                          icon="pi pi-pencil"
                          label="Editar"
                          className="p-button-sm p-button-outlined flex-1"
                          onClick={() => handleEdit(plot)}
                        />
                      )}
                      {canDelete && (
                        <Button
                          icon="pi pi-trash"
                          className="p-button-sm p-button-outlined p-button-danger"
                          onClick={() => handleDelete(plot.id)}
                        />
                      )}
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
