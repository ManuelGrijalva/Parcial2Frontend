<template>
  <v-container fluid>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-subtitle-1 mb-2">Acciones</div>

          <!-- Navegación -->
          <v-btn
            block color="primary" variant="outlined" class="mb-2"
            @click="goToUsuarios"
          >
            Ver Usuarios
          </v-btn>

          <!-- Agregar tarea -->
          <v-btn
            block color="primary" class="mb-2"
            @click="showForm = !showForm"
          >
            {{ showForm ? 'Ocultar Formulario' : 'Agregar Tarea' }}
          </v-btn>

          <!-- Descargar reporte -->
          <v-btn
            block color="success" variant="outlined" class="mb-3"
            :loading="downloading"
            @click="downloadReport"
          >
            <v-icon start>mdi-download</v-icon>
            Descargar Reporte
          </v-btn>

          <!-- Buscar -->
          <v-text-field
            v-model="search"
            label="Buscar tareas"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            clearable
            class="mb-4"
          />

          <v-btn block color="error" variant="tonal" @click="logout">
            Cerrar sesión
          </v-btn>

          <v-divider class="my-4" />

          <div class="text-caption">
            Sesión: <strong>{{ user?.nombre }}</strong> ({{ user?.rol }})
          </div>
        </v-card>
      </v-col>

      <!-- Contenido principal -->
      <v-col cols="12" md="9">
        <!-- Formulario de tarea -->
        <v-card v-if="showForm" class="pa-4 mb-4">
          <v-card-title class="text-h6 mb-4">
            {{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}
          </v-card-title>
          
          <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.titulo"
                  label="Título"
                  :rules="tituloRules"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.estado"
                  label="Estado"
                  :items="estados"
                  :rules="estadoRules"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.fecha_vencimiento"
                  label="Fecha de Vencimiento"
                  type="date"
                  :rules="fechaRules"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.user_id"
                  label="Usuario Asignado"
                  :items="usuarios"
                  item-title="nombre"
                  item-value="id"
                  :rules="usuarioRules"
                  required
                />
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="formData.descripcion"
                  label="Descripción"
                  rows="3"
                />
              </v-col>
            </v-row>
            
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-3"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
            
            <v-alert
              v-if="successMessage"
              type="success"
              class="mb-3"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </v-alert>
            
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="grey"
                variant="text"
                @click="cancelForm"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="!valid"
                @click="submitForm"
              >
                {{ isEdit ? 'Actualizar' : 'Crear' }} Tarea
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <!-- Tabla de tareas -->
        <v-card class="pa-4">
          <div class="text-h6 mb-4">Tareas</div>
          <TareasList :search-term="search" @edit="editTarea" @delete="deleteTarea" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TareasList from '@/components/TareasList.vue'
import { tareaService } from '@/services/api'

type User = { id:number; nombre:string; email:string; rol:'admin'|'usuario' }
type Usuario = { id:number; nombre:string; email:string }

const router = useRouter()
const search = ref('')
const showForm = ref(false)
const loading = ref(false)
const downloading = ref(false)
const valid = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const user = ref<User | null>(null)
const usuarios = ref<Usuario[]>([])

const formData = ref({
  titulo: '',
  descripcion: '',
  estado: 'pendiente' as 'pendiente' | 'en progreso' | 'completada',
  fecha_vencimiento: '',
  user_id: null as number | null
})

const estados = [
  { title: 'Pendiente', value: 'pendiente' },
  { title: 'En Progreso', value: 'en progreso' },
  { title: 'Completada', value: 'completada' }
]

// Reglas de validación
const tituloRules = [
  (v: string) => !!v || 'El título es requerido',
  (v: string) => v.length >= 3 || 'El título debe tener al menos 3 caracteres'
]

const estadoRules = [
  (v: string) => !!v || 'El estado es requerido'
]

const fechaRules = [
  (v: string) => !!v || 'La fecha de vencimiento es requerida',
  (v: string) => {
    const today = new Date().toISOString().split('T')[0]
    return v >= today || 'La fecha debe ser hoy o posterior'
  }
]

const usuarioRules = [
  (v: number) => !!v || 'Debe seleccionar un usuario'
]

onMounted(async () => {
  const raw = localStorage.getItem('user')
  user.value = raw ? JSON.parse(raw) as User : null
  
  await loadUsuarios()
})

const loadUsuarios = async () => {
  try {
    const { data } = await tareaService.getUsers()
    usuarios.value = data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

const submitForm = async () => {
  if (!valid.value) return
  
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    if (isEdit.value && editingId.value) {
      await tareaService.updateTarea(editingId.value, formData.value)
      successMessage.value = 'Tarea actualizada correctamente'
    } else {
      await tareaService.createTarea(formData.value as any)
      successMessage.value = 'Tarea creada correctamente'
    }
    
    // Limpiar formulario
    resetForm()
    
    // Ocultar formulario después de un breve delay
    setTimeout(() => {
      showForm.value = false
    }, 1500)
    
  } catch (error: any) {
    errorMessage.value = 'Error: ' + (error.response?.data?.message || error.message)
  } finally {
    loading.value = false
  }
}

const editTarea = (tarea: any) => {
  isEdit.value = true
  editingId.value = tarea.id
  formData.value = {
    titulo: tarea.titulo,
    descripcion: tarea.descripcion || '',
    estado: tarea.estado,
    fecha_vencimiento: tarea.fecha_vencimiento,
    user_id: tarea.user_id
  }
  showForm.value = true
}

const deleteTarea = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    try {
      await tareaService.deleteTarea(id)
      successMessage.value = 'Tarea eliminada correctamente'
    } catch (error: any) {
      errorMessage.value = 'Error: ' + (error.response?.data?.message || error.message)
    }
  }
}

const cancelForm = () => {
  resetForm()
  showForm.value = false
}

const resetForm = () => {
  formData.value = {
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    fecha_vencimiento: '',
    user_id: null
  }
  isEdit.value = false
  editingId.value = null
}

const goToUsuarios = () => router.push('/usuarios')

const downloadReport = async () => {
  try {
    downloading.value = true
    const response = await tareaService.downloadPendingReport()
    
    // Crear blob y descargar
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Obtener el nombre del archivo del header Content-Disposition
    const contentDisposition = response.headers['content-disposition']
    let filename = 'tareas_pendientes.xlsx'
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    successMessage.value = 'Reporte descargado correctamente'
  } catch (error: any) {
    errorMessage.value = 'Error al descargar el reporte: ' + (error.response?.data?.message || error.message)
  } finally {
    downloading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
