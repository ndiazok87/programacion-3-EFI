// Ejemplo de Formulario PROFESIONAL con PrimeReact
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { Divider } from 'primereact/divider';

export default function ProfessionalActivityForm() {
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: null,
        parcela: null,
        trabajador: null,
        fechaInicio: null,
        fechaFin: null,
        estado: 'pendiente',
        descripcion: ''
    });

    const tipoOptions = [
        { label: 'Siembra', value: 'siembra', icon: 'pi pi-sun' },
        { label: 'Cosecha', value: 'cosecha', icon: 'pi pi-shopping-bag' },
        { label: 'Fertilización', value: 'fertilizacion', icon: 'pi pi-filter' },
        { label: 'Riego', value: 'riego', icon: 'pi pi-cloud' },
        { label: 'Fumigación', value: 'fumigacion', icon: 'pi pi-box' }
    ];

    const estadoOptions = [
        { label: 'Pendiente', value: 'pendiente', severity: 'warning' },
        { label: 'En Progreso', value: 'en progreso', severity: 'info' },
        { label: 'Completada', value: 'completada', severity: 'success' }
    ];

    const parcelaOptions = [
        { label: 'Lote 1', value: 'lote1' },
        { label: 'Lote 2', value: 'lote2' }
    ];

    const trabajadorOptions = [
        { label: 'Juan Pérez', value: 'juan' },
        { label: 'María García', value: 'maria' }
    ];

    // Template para items del dropdown con íconos
    const tipoItemTemplate = (option: any) => {
        return option ? (
            <div className="flex align-items-center gap-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
            </div>
        ) : null;
    };

    const estadoItemTemplate = (option: any) => {
        return option ? (
            <div className="flex align-items-center gap-2">
                <i className={`pi pi-circle-fill text-${option.severity}-500`} style={{ fontSize: '0.5rem' }}></i>
                <span>{option.label}</span>
            </div>
        ) : null;
    };

    const dialogHeader = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-calendar text-2xl text-primary"></i>
            <span className="font-bold text-xl">Nueva Actividad Agrícola</span>
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-content-end gap-2 pt-3">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                severity="secondary"
                outlined
            />
            <Button
                label="Crear Actividad"
                icon="pi pi-check"
                onClick={() => setVisible(false)}
                severity="success"
            />
        </div>
    );

    return (
        <div className="card">
            <Button
                label="Abrir Formulario PRO"
                icon="pi pi-plus"
                onClick={() => setVisible(true)}
                className="mb-3"
            />

            <Dialog
                visible={visible}
                onHide={() => setVisible(false)}
                header={dialogHeader}
                footer={dialogFooter}
                style={{ width: '600px' }}
                modal
                dismissableMask
            >
                <div className="flex flex-column gap-4 p-fluid">

                    {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                    <div className="surface-50 p-4 border-round">
                        <div className="flex align-items-center gap-2 mb-4">
                            <i className="pi pi-info-circle text-primary"></i>
                            <h3 className="m-0 text-primary">Información General</h3>
                        </div>

                        {/* Nombre con FloatLabel */}
                        <FloatLabel className="mb-4">
                            <InputText
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full"
                            />
                            <label htmlFor="nombre">
                                <i className="pi pi-tag mr-2"></i>
                                Nombre de la Actividad
                            </label>
                        </FloatLabel>

                        {/* Grid 2 columnas: Tipo y Parcela */}
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <FloatLabel>
                                    <Dropdown
                                        id="tipo"
                                        value={formData.tipo}
                                        options={tipoOptions}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.value })}
                                        itemTemplate={tipoItemTemplate}
                                        valueTemplate={tipoItemTemplate}
                                        className="w-full"
                                    />
                                    <label htmlFor="tipo">Tipo de Actividad</label>
                                </FloatLabel>
                            </div>

                            <div className="col-12 md:col-6">
                                <FloatLabel>
                                    <Dropdown
                                        id="parcela"
                                        value={formData.parcela}
                                        options={parcelaOptions}
                                        onChange={(e) => setFormData({ ...formData, parcela: e.value })}
                                        className="w-full"
                                    />
                                    <label htmlFor="parcela">Parcela Asignada</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* SECCIÓN 2: ASIGNACIÓN Y PROGRAMACIÓN */}
                    <div className="surface-50 p-4 border-round">
                        <div className="flex align-items-center gap-2 mb-4">
                            <i className="pi pi-users text-primary"></i>
                            <h3 className="m-0 text-primary">Asignación y Programación</h3>
                        </div>

                        {/* Trabajador */}
                        <FloatLabel className="mb-4">
                            <Dropdown
                                id="trabajador"
                                value={formData.trabajador}
                                options={trabajadorOptions}
                                onChange={(e) => setFormData({ ...formData, trabajador: e.value })}
                                className="w-full"
                                showClear
                            />
                            <label htmlFor="trabajador">
                                <i className="pi pi-user mr-2"></i>
                                Trabajador Responsable
                            </label>
                        </FloatLabel>

                        {/* Grid 2 columnas: Fechas con Calendar */}
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <FloatLabel>
                                    <Calendar
                                        id="fechaInicio"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.value as Date })}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className="w-full"
                                    />
                                    <label htmlFor="fechaInicio">Fecha de Inicio</label>
                                </FloatLabel>
                            </div>

                            <div className="col-12 md:col-6">
                                <FloatLabel>
                                    <Calendar
                                        id="fechaFin"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.value as Date })}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className="w-full"
                                    />
                                    <label htmlFor="fechaFin">Fecha de Finalización</label>
                                </FloatLabel>
                            </div>
                        </div>

                        {/* Estado */}
                        <FloatLabel className="mt-4">
                            <Dropdown
                                id="estado"
                                value={formData.estado}
                                options={estadoOptions}
                                onChange={(e) => setFormData({ ...formData, estado: e.value })}
                                itemTemplate={estadoItemTemplate}
                                valueTemplate={estadoItemTemplate}
                                className="w-full"
                            />
                            <label htmlFor="estado">Estado Actual</label>
                        </FloatLabel>
                    </div>

                    <Divider />

                    {/* SECCIÓN 3: NOTAS ADICIONALES */}
                    <div className="surface-50 p-4 border-round">
                        <div className="flex align-items-center gap-2 mb-4">
                            <i className="pi pi-comment text-primary"></i>
                            <h3 className="m-0 text-primary">Notas y Descripción</h3>
                        </div>

                        <FloatLabel>
                            <InputTextarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                rows={4}
                                className="w-full"
                            />
                            <label htmlFor="descripcion">Descripción detallada de la actividad</label>
                        </FloatLabel>

                        <small className="text-500 mt-2 block">
                            <i className="pi pi-info-circle mr-2"></i>
                            Incluya detalles importantes, instrucciones especiales o recomendaciones
                        </small>
                    </div>

                </div>
            </Dialog>
        </div>
    );
}
