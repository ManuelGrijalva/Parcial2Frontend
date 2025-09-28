import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use((config) => {
  // rutas que no deben llevar token
  const noAuthEndpoints = ['/login', '/register']

  if (!noAuthEndpoints.includes(config.url || '')) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Funciones específicas para usuarios
export const userService = {
  // Obtener lista de usuarios
  getUsers: () => api.get('/usuarios/listUsers'),
  
  // Obtener un usuario por ID
  getUser: (id: number) => api.get(`/usuarios/getUser/${id}`),
  
  // Crear nuevo usuario
  createUser: (userData: {
    nombre: string
    email: string
    password: string
    rol: 'admin' | 'usuario'
  }) => api.post('/usuarios/addUser', userData),
  
  // Actualizar usuario
  updateUser: (id: number, userData: {
    nombre: string
    email: string
    password?: string
    rol: 'admin' | 'usuario'
  }) => api.put(`/usuarios/updateUser/${id}`, userData),
  
  // Eliminar usuario
  deleteUser: (id: number) => api.delete(`/usuarios/deleteUser/${id}`)
}

// Funciones específicas para tareas
export const tareaService = {
  // Obtener lista de tareas
  getTareas: () => api.get('/tareas'),
  
  // Obtener una tarea por ID
  getTarea: (id: number) => api.get(`/tareas/${id}`),
  
  // Crear nueva tarea
  createTarea: (tareaData: {
    titulo: string
    descripcion?: string
    estado: 'pendiente' | 'en progreso' | 'completada'
    fecha_vencimiento: string
    user_id: number
  }) => api.post('/tareas', tareaData),
  
  // Actualizar tarea
  updateTarea: (id: number, tareaData: {
    titulo?: string
    descripcion?: string
    estado?: 'pendiente' | 'en progreso' | 'completada'
    fecha_vencimiento?: string
    user_id?: number
  }) => api.put(`/tareas/${id}`, tareaData),
  
  // Eliminar tarea
  deleteTarea: (id: number) => api.delete(`/tareas/${id}`),
  
  // Obtener usuarios para el selector
  getUsers: () => api.get('/tareas/usuarios'),
  
  // Descargar reporte de tareas pendientes
  downloadPendingReport: () => api.get('/tareas/report-pendientes', { responseType: 'blob' })
}

export default api
