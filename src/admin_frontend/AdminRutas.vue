<template>
  <div class="container py-4">
    <h2 class="mb-3">Rutas</h2>
    <form @submit.prevent="guardar" class="row g-2 mb-3">
      <div class="col-md-2"><input v-model="form.nombre" class="form-control" placeholder="Nombre" required /></div>
      <div class="col-md-2">
        <select v-model="form.chofer_id" class="form-select" required>
          <option value="" disabled>Chofer</option>
          <option v-for="c in choferes" :key="c.id" :value="c.id">{{ c.nombre }} {{ c.apellidos }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select v-model="form.unidad_id" class="form-select" required>
          <option value="" disabled>Unidad</option>
          <option v-for="u in unidades" :key="u.id" :value="u.id">{{ u.matricula }}</option>
        </select>
      </div>
      <div class="col-md-2"><input v-model="form.horario" class="form-control" placeholder="Horario" /></div>
      <div class="col-md-1"><input v-model="form.inicio" class="form-control" placeholder="Inicio" /></div>
      <div class="col-md-1"><input v-model="form.fin" class="form-control" placeholder="Fin" /></div>
      <div class="col-md-1"><input v-model.number="form.rango" type="number" min="0" class="form-control" placeholder="Rango" required /></div>
      <div class="col-md-1">
        <select v-model="form.estado" class="form-select">
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
          <option value="completada">Completada</option>
        </select>
      </div>
      <div class="col-md-12">
        <button class="btn btn-primary">{{ form.id? 'Actualizar':'Crear' }}</button>
        <button type="button" v-if="form.id" class="btn btn-secondary ms-2" @click="reset">Cancelar</button>
      </div>
    </form>

    <table class="table table-striped table-sm">
      <thead><tr><th>ID</th><th>Nombre</th><th>Chofer</th><th>Unidad</th><th>Horario</th><th>Inicio</th><th>Fin</th><th>Rango</th><th>Estado</th><th></th></tr></thead>
      <tbody>
        <tr v-for="r in rutas" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.nombre }}</td>
          <td>{{ r.chofer?.nombre }} {{ r.chofer?.apellidos }}</td>
          <td>{{ r.unidad?.matricula }}</td>
          <td>{{ r.horario }}</td>
          <td>{{ r.inicio }}</td>
          <td>{{ r.fin }}</td>
          <td>{{ r.rango }}</td>
          <td>{{ r.estado }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" @click="edit(r)">Editar</button>
            <button class="btn btn-sm btn-outline-danger" @click="eliminar(r.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import http from '@/config/api.js';

const rutas = ref([])
const choferes = ref([])
const unidades = ref([])
const form = reactive({id:null,nombre:'',chofer_id:'',unidad_id:'',horario:'',inicio:'',fin:'',rango:0,estado:'inactiva'})

function headers(){ 
  const token = localStorage.getItem('admin_token')
  console.log('Token admin:', token ? 'Existe' : 'No existe')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
async function cargar(){
  console.log('Cargando datos...')
  const [rRes,cRes,uRes] = await Promise.all([
    http.get('/admin/rutas',{headers:headers()}),
    http.get('/admin/choferes',{headers:headers()}),
    http.get('/admin/unidades',{headers:headers()}),
  ])
  console.log('Rutas:', rRes.data)
  console.log('Choferes:', cRes.data)
  console.log('Unidades:', uRes.data)
  rutas.value = rRes.data
  choferes.value = cRes.data
  unidades.value = uRes.data
}
async function guardar(){
  if(form.id){
  await http.put(`/admin/rutas/${form.id}`, form,{headers:headers()})
  }else{
  await http.post('/admin/rutas', form,{headers:headers()})
  }
  reset();
  await cargar();
}
function edit(r){ Object.assign(form,r) }
function reset(){ Object.assign(form,{id:null,nombre:'',chofer_id:'',unidad_id:'',horario:'',inicio:'',fin:'',rango:0,estado:'inactiva'}) }
async function eliminar(id){ if(confirm('¿Eliminar?')){ await http.delete(`/admin/rutas/${id}`,{headers:headers()}); await cargar(); } }

onMounted(cargar)
</script>

<style scoped>
/* Select options styles */
.form-select option {
  color: #000000 !important;
  background-color: #ffffff !important;
}

.form-select option:disabled {
  color: #6c757d !important;
}
</style>
