<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h5 text-center pa-4">
            {{ isEdit ? 'Editar Usuario' : 'Agregar Usuario' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
              <v-text-field
                v-model="formData.nombre"
                label="Nombre completo"
                :rules="nombreRules"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="formData.email"
                label="Correo electrónico"
                type="email"
                :rules="emailRules"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="formData.password"
                label="Contraseña"
                type="password"
                :rules="passwordRules"
                :required="!isEdit"
                class="mb-3"
              />
              
              <v-select
                v-model="formData.rol"
                label="Rol"
                :items="roles"
                :rules="rolRules"
                required
                class="mb-3"
              />
              
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
            </v-form>
          </v-card-text>
          
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              color="grey"
              variant="text"
              @click="goBack"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="submitForm"
            >
              {{ isEdit ? 'Actualizar' : 'Crear' }} Usuario
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

type User = {
  id?: number
  nombre: string
  email: string
  password?: string
  rol: 'admin' | 'usuario'
}

const router = useRouter()
const route = useRoute()

const form = ref()
const valid = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref<User>({
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario'
})

const roles = [
  { title: 'Usuario', value: 'usuario' },
  { title: 'Administrador', value: 'admin' }
]

const isEdit = computed(() => !!route.params.id)

// Reglas de validación
const nombreRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
]

const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido'
]

const passwordRules = [
  (v: string) => {
    if (isEdit.value) return true // No requerido en edición
    return !!v || 'La contraseña es requerida'
  },
  (v: string) => {
    if (isEdit.value) return true
    return v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
  }
]

const rolRules = [
  (v: string) => !!v || 'El rol es requerido'
]

// Cargar datos del usuario si estamos editando
onMounted(async () => {
  if (isEdit.value) {
    await loadUser()
  }
})

const loadUser = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/usuarios/getUser/${route.params.id}`)
    formData.value = {
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol
    }
  } catch (error: any) {
    errorMessage.value = 'Error al cargar el usuario: ' + (error.response?.data?.message || error.message)
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  if (!valid.value) return
  
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    const payload = { ...formData.value }
    if (isEdit.value) {
      // En edición, no enviar password vacío
      if (!payload.password) {
        delete payload.password
      }
      await api.put(`/usuarios/updateUser/${route.params.id}`, payload)
      successMessage.value = 'Usuario actualizado correctamente'
    } else {
      await api.post('/usuarios/addUser', payload)
      successMessage.value = 'Usuario creado correctamente'
    }
    
    // Limpiar formulario después de crear
    if (!isEdit.value) {
      formData.value = {
        nombre: '',
        email: '',
        password: '',
        rol: 'usuario'
      }
      form.value?.reset()
    }
    
    // Redirigir después de un breve delay
    setTimeout(() => {
      router.push('/')
    }, 1500)
    
  } catch (error: any) {
    errorMessage.value = 'Error: ' + (error.response?.data?.message || error.message)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>