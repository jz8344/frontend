<template>
  <div class="container py-4">
    <h2 class="mb-3">Unidades</h2>
    <form @submit.prevent="guardar" class="row g-2 mb-3">
      <div class="col-md-3"><input v-model="form.matricula" class="form-control" placeholder="Matrícula" required /></div>
      <div class="col-md-3"><input v-model="form.modelo" class="form-control" placeholder="Modelo" /></div>
      <div class="col-md-2"><input v-model.number="form.capacidad" type="number" min="1" class="form-control" placeholder="Capacidad" required /></div>
      <div class="col-md-4">
        <button class="btn btn-primary">{{ form.id? 'Actualizar':'Agregar' }}</button>
        <button type="button" v-if="form.id" class="btn btn-secondary ms-2" @click="reset">Cancelar</button>
      </div>
    </form>

    <table class="table table-striped table-sm">
      <thead><tr><th>ID</th><th>Matrícula</th><th>Modelo</th><th>Capacidad</th><th></th></tr></thead>
      <tbody>
        <tr v-for="u in unidades" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.matricula }}</td>
          <td>{{ u.modelo }}</td>
          <td>{{ u.capacidad }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" @click="edit(u)">Editar</button>
            <button class="btn btn-sm btn-outline-danger" @click="eliminar(u.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import http from '@/config/api.js';

const unidades = ref([])
const form = reactive({id:null, matricula:'', modelo:'', capacidad:1})
function headers(){ return {} }
async function cargar(){
  const res = await http.get('/admin/unidades', { headers: headers() })
  unidades.value = res.data
}
async function guardar(){
  if(form.id){
  await http.put(`/admin/unidades/${form.id}`, form, { headers: headers() })
  }else{
  await http.post('/admin/unidades', form, { headers: headers() })
  }
  reset();
  await cargar();
}
function edit(u){ Object.assign(form,u) }
function reset(){ Object.assign(form,{id:null,matricula:'',modelo:'',capacidad:1}) }
async function eliminar(id){ if(confirm('¿Eliminar?')){ await http.delete(`/admin/unidades/${id}`, { headers: headers() }); await cargar(); } }

onMounted(cargar)
</script>
