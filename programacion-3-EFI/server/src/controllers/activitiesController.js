import { Activity, Plot } from '../models/index.js';

export const listActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      order: [['fecha_inicio', 'DESC']],
      include: [{ model: Plot, as: 'plots' }]
    });
    res.json(activities);
  } catch (err) {
    console.error('listActivities error:', err);
    res.status(500).json({ message: 'Error al obtener actividades' });
  }
};

export const createActivity = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Activity.create(payload);
    // Volver a consultar con el Plot incluido
    const activity = await Activity.findByPk(created.id, {
      include: [{ model: Plot, as: 'plots' }]
    });
    res.status(201).json(activity);
  } catch (err) {
    console.error('createActivity error:', err);
    res.status(500).json({ message: 'Error al crear actividad' });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const [updated] = await Activity.update({ ...payload, updated_at: new Date() }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Actividad no encontrada' });
    const activity = await Activity.findByPk(id, {
      include: [{ model: Plot, as: 'plots' }]
    });
    res.json(activity);
  } catch (err) {
    console.error('updateActivity error:', err);
    res.status(500).json({ message: 'Error al actualizar actividad' });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteActivity error:', err);
    res.status(500).json({ message: 'Error al eliminar actividad' });
  }
};
