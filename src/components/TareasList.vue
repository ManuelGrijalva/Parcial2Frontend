<template>
  <v-data-table
    :items="filtered"
    :headers="headers"
    :loading="loading"
    class="elevation-1"
  >
    <template #item.estado="{ item }">
      <v-chip
        :color="getEstadoColor(item.estado)"
        size="small"
      >
        {{ getEstadoText(item.estado) }}
      </v-chip>
    </template>
    
    <template #item.fecha_vencimiento="{ item }">
      {{ formatDate(item.fecha_vencimiento) }}
    </template>
    
    <template #item.user="{ item }">
      {{ item.user?.nombre || 'Sin asignar' }}
    </template>
    
    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        size="small"
        color="primary"
        @click="$emit('edit', item)"
      />
      <v-btn
        icon="mdi-delete"
        size="small"
        color="error"
        @click="$emit('delete', item.id)"
      />
    </template>
    
    <template #no-data>
      <div class="pa-6 text-center">No hay tareas para mostrar.</div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { tareaService } from '@/services/api'

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  estado: 'pendiente' | 'en progreso' | 'completada'
  fecha_vencimiento: string
  user_id: number
  user?: { id: number; nombre: string; email: string }
  created_at: string
}

const props = defineProps<{ searchTerm?: string }>()

const emit = defineEmits<{
  edit: [tarea: Tarea]
  delete: [id: number]
}>()

const items = ref<Tarea[]>([])
const loading = ref(false)

const headers = [
  { title: 'Título', value: 'titulo' },
  { title: 'Estado', value: 'estado' },
  { title: 'Fecha Vencimiento', value: 'fecha_vencimiento', sortable: true },
  { title: 'Usuario Asignado', value: 'user' },
  { title: 'Acciones', value: 'actions', sortable: false },
]

// Cargar tareas desde la API
const fetchTareas = async () => {
  loading.value = true
  try {
    const { data } = await tareaService.getTareas()
    items.value = data
  } finally {
    loading.value = false
  }
}

onMounted(fetchTareas)

const filtered = computed(() => {
  const q = (props.searchTerm || '').toLowerCase().trim()
  if (!q) return items.value
  return items.value.filter(t =>
    t.titulo.toLowerCase().includes(q) ||
    t.descripcion?.toLowerCase().includes(q) ||
    t.estado.toLowerCase().includes(q) ||
    t.user?.nombre.toLowerCase().includes(q)
  )
})

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Función para obtener el color del estado
const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'orange'
    case 'en progreso': return 'blue'
    case 'completada': return 'green'
    default: return 'grey'
  }
}

// Función para obtener el texto del estado
const getEstadoText = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'Pendiente'
    case 'en progreso': return 'En Progreso'
    case 'completada': return 'Completada'
    default: return estado
  }
}

// Exponer función para recargar
defineExpose({ fetchTareas })
</script>
