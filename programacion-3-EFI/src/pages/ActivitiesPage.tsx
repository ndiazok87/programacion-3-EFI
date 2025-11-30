import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { usePlots } from '@/contexts/PlotsContext';
// PrimeReact native components
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ActivitiesPage() {
  const { profile, userId, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, createActivity, updateActivity, deleteActivity } = useActivities();
  const { plots } = usePlots();

  const [workers, setWorkers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    id_parcela: '',
    id_trabajador: '',
    fecha_inicio: null as Date | null,
    fecha_fin: null as Date | null,
    estado: '',
    descripcion: ''
  });

  const canManage = profile?.rol === 'admin' || profile?.rol === 'gestor';

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${base}/api/profiles`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWorkers((data || []).filter((p: any) => p.rol === 'trabajador'));
      } catch (err) {
        console.error('Error fetching workers', err);
      }
    };
    if (canManage) fetchWorkers();
  }, [profile, canManage]);

  // Dropdown options
  const tipoOptions = [
    { label: 'Siembra', value: 'siembra' },
    { label: 'Cosecha', value: 'cosecha' },
    { label: 'Fertilización', value: 'fertilizacion' },
    { label: 'Riego', value: 'riego' },
    { label: 'Fumigación', value: 'fumigacion' }
  ];

  const estadoOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en progreso' },
    { label: 'Completada', value: 'completada' }
  ];

  const parcelaOptions = plots.map(p => ({ label: p.nombre, value: p.id }));

  const trabajadorOptions = [
    { label: 'Sin asignar', value: '' },
    ...workers.map(w => ({ label: `${w.nombre} (${w.correo})`, value: w.id }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        nombre: formData.nombre,
        tipo: formData.tipo as any,
        id_parcela: formData.id_parcela,
        id_trabajador: formData.id_trabajador || undefined,
        fecha_inicio: formData.fecha_inicio?.toISOString().split('T')[0],
        fecha_fin: formData.fecha_fin?.toISOString().split('T')[0],
        estado: formData.estado as any,
        descripcion: formData.descripcion
      };

      if (editingActivity) {
        await updateActivity(editingActivity.id, activityData);
      } else {
        await createActivity(activityData);
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
      tipo: '',
      id_parcela: '',
      id_trabajador: '',
      fecha_inicio: null,
      fecha_fin: null,
      estado: '',
      descripcion: ''
    });
    setEditingActivity(null);
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setFormData({
      nombre: activity.nombre,
      tipo: activity.tipo,
      id_parcela: activity.id_parcela,
      id_trabajador: activity.id_trabajador || '',
      fecha_inicio: activity.fecha_inicio ? new Date(activity.fecha_inicio) : null,
      fecha_fin: activity.fecha_fin ? new Date(activity.fecha_fin) : null,
      estado: activity.estado,
      descripcion: activity.descripcion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      await deleteActivity(id);
    }
  };

  const handleStatusUpdate = async (activityId: string, newStatus: string) => {
    try {
      await updateActivity(activityId, { estado: newStatus as any });
    } catch (error) {
      console.error(error);
    }
  };

  const generatePDF = (activity: any) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Parte de Trabajo - AgroPrecision', 14, 22);
    doc.setFontSize(12);
    doc.text(`Actividad: ${activity.nombre}`, 14, 35);
    doc.text(`Tipo: ${activity.tipo}`, 14, 42);
    doc.text(`Parcela: ${activity.plots?.nombre || 'N/A'}`, 14, 49);
    doc.text(`Fecha: ${activity.fecha_inicio} - ${activity.fecha_fin}`, 14, 56);
    doc.text(`Estado: ${activity.estado}`, 14, 63);
    if (activity.descripcion) {
      doc.text(`Descripción: ${activity.descripcion}`, 14, 70);
    }
    doc.save(`actividad_${activity.nombre}.pdf`);
  };

  // Filter activities for workers
  const filteredActivities = activities.filter(activity => {
    if (profile?.rol === 'trabajador') {
      return activity.id_trabajador === userId;
    }
    return true;
  });

  if (authLoading || activitiesLoading) {
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
        label={editingActivity ? 'Actualizar' : 'Crear'}
        onClick={handleSubmit}
        severity="success"
      />
    </div>
  );

  return (
    <div className="min-h-screen surface-ground">
      <nav className="app-navbar">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-content-between align-items-center">
          <h1 className="text-2xl font-bold text-900 m-0">AgroPrecision - Actividades</h1>
          <Button
            label="Volver al Dashboard"
            icon="pi pi-arrow-left"
            className="p-button-text"
            onClick={() => navigate('/')}
          />
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-content-between align-items-center mb-5">
          <h2 className="text-3xl font-bold text-900 m-0">Gestión de Actividades</h2>
          {canManage && (
            <Button
              label="Nueva Actividad"
              icon="pi pi-plus"
              onClick={() => setIsDialogOpen(true)}
              severity="success"
            />
          )}
        </div>

        {/* DIALOG MODAL - Estilo MINIMALISTA */}
        <Dialog
          visible={isDialogOpen}
          onHide={() => { setIsDialogOpen(false); resetForm(); }}
          header="Nueva Actividad"
          footer={dialogFooter}
          style={{ width: '500px' }}
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

            {/* Tipo y Parcela - Grid 2 columnas */}
            <div className="grid">
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="tipo" className="font-medium">Tipo</label>
                  <Dropdown
                    id="tipo"
                    value={formData.tipo}
                    options={tipoOptions}
                    onChange={(e) => setFormData({ ...formData, tipo: e.value })}
                    placeholder="Siembra"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="parcela" className="font-medium">Parcela</label>
                  <Dropdown
                    id="parcela"
                    value={formData.id_parcela}
                    options={parcelaOptions}
                    onChange={(e) => setFormData({ ...formData, id_parcela: e.value })}
                    placeholder="Seleccionar parcela"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Trabajador (solo para admin/gestor) */}
            {canManage && (
              <div className="flex flex-column gap-2">
                <label htmlFor="trabajador" className="font-medium">Asignar Trabajador</label>
                <Dropdown
                  id="trabajador"
                  value={formData.id_trabajador}
                  options={trabajadorOptions}
                  onChange={(e) => setFormData({ ...formData, id_trabajador: e.value })}
                  placeholder="Sin asignar"
                />
              </div>
            )}

            {/* Fecha Inicio y Fecha Fin - Grid 2 columnas */}
            <div className="grid">
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="fechaInicio" className="font-medium">Fecha Inicio</label>
                  <Calendar
                    id="fechaInicio"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.value as Date })}
                    dateFormat="dd/mm/yy"
                    showIcon
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="flex flex-column gap-2">
                  <label htmlFor="fechaFin" className="font-medium">Fecha Fin</label>
                  <Calendar
                    id="fechaFin"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.value as Date })}
                    dateFormat="dd/mm/yy"
                    showIcon
                    required
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="flex flex-column gap-2">
              <label htmlFor="estado" className="font-medium">Estado</label>
              <Dropdown
                id="estado"
                value={formData.estado}
                options={estadoOptions}
                onChange={(e) => setFormData({ ...formData, estado: e.value })}
                placeholder="Pendiente"
                required
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-column gap-2">
              <label htmlFor="descripcion" className="font-medium">Descripción</label>
              <InputTextarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
              />
            </div>

          </form>
        </Dialog>

        {/* Grid de actividades */}
        <div className="grid">
          {filteredActivities.length === 0 ? (
            <div className="col-12 text-center py-6">
              <i className="pi pi-inbox text-400" style={{ fontSize: '3rem' }}></i>
              <p className="text-600 mt-3">No hay actividades registradas</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="col-12 md:col-6 lg:col-4 p-3">
                <Card className="h-full shadow-2">
                  <div className="flex justify-content-between align-items-start mb-3">
                    <h3 className="m-0 text-xl font-bold">{activity.nombre}</h3>
                    <Badge
                      value={activity.estado}
                      severity={
                        activity.estado === 'completada' ? 'success' :
                          activity.estado === 'en progreso' ? 'info' :
                            'warning'
                      }
                    />
                  </div>

                  <div className="flex flex-column gap-2 text-600 mb-3">
                    <p><strong>Tipo:</strong> {activity.tipo}</p>
                    <p><strong>Parcela:</strong> {activity.plots?.nombre || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {activity.fecha_inicio} - {activity.fecha_fin}</p>
                    {activity.profiles && <p><strong>Asignado a:</strong> {activity.profiles.nombre}</p>}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      label="Descargar Parte"
                      icon="pi pi-file-pdf"
                      className="p-button-sm p-button-outlined"
                      onClick={() => generatePDF(activity)}
                    />

                    {profile?.rol === 'trabajador' && activity.estado !== 'completada' && (
                      <Button
                        label="Marcar Completada"
                        icon="pi pi-check"
                        className="p-button-sm"
                        severity="success"
                        onClick={() => handleStatusUpdate(activity.id, 'completada')}
                      />
                    )}

                    {canManage && (
                      <>
                        <Button
                          icon="pi pi-pencil"
                          className="p-button-sm p-button-outlined"
                          onClick={() => handleEdit(activity)}
                        />
                        <Button
                          icon="pi pi-trash"
                          className="p-button-sm p-button-outlined p-button-danger"
                          onClick={() => handleDelete(activity.id)}
                        />
                      </>
                    )}
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
