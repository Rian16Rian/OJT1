<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { Pencil, Trash2, Check, Play } from 'lucide-vue-next'

const queue = ref([])

const form = ref({
  customer_id: '',
  customer_name: '',
  menu_name: '',
  price: '',
  status: 'reserved'
})

const editingId = ref(null)
const editForm = ref({
  customer_name: '',
  menu_name: '',
  price: '',
  status: ''
})


const fetchQueue = async () => {
  const { data } = await supabase
    .from('food_queue')
    .select('*')
    .order('created_at')

  queue.value = data || []
}

const subscribeRealtime = () => {
  supabase
    .channel('food-queue-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'food_queue' },
      () => fetchQueue()
    )
    .subscribe()
}

onMounted(() => {
  fetchQueue()
  subscribeRealtime()
})

const addOrder = async () => {
    if (!form.value.customer_id || !/^\d+$/.test(form.value.customer_id)) return
    if (!form.value.customer_name) return
  await supabase.from('food_queue').insert([form.value])

  form.value = {
    customer_id: '',
    customer_name: '',
    menu_name: '',
    price: '',
    status: 'reserved'
  }

  fetchQueue()
}

const updateStatus = async (id, status) => {
  await supabase.from('food_queue').update({ status }).eq('id', id)
  fetchQueue()
}

const deleteOrder = async (id) => {
  await supabase.from('food_queue').delete().eq('id', id)
  fetchQueue()
}

const startEdit = (item) => {
  editingId.value = item.id
  editForm.value = {
    customer_name: item.customer_name,
    menu_name: item.menu_name,
    price: item.price,
    status: item.status
  }
}

const cancelEdit = () => {
  editingId.value = null
}

const saveEdit = async (id) => {
  const index = queue.value.findIndex(item => item.id === id)
  if (index !== -1) {
    queue.value[index] = {
      ...queue.value[index],
      ...editForm.value
    }
  }
  editingId.value = null

  await supabase
    .from('food_queue')
    .update(editForm.value)
    .eq('id', id)
}

const onlyDigits = (event) => {
  form.value.customer_id = event.target.value.replace(/\D/g, '')
}

onMounted(fetchQueue)
</script>

<template>
  <section class="card fade-in">
    <div class="form-row">
        <input v-model="form.customer_id" @input="onlyDigits" inputmode="numeric" placeholder="Queue ID"/>
        <input v-model="form.customer_name" placeholder="Name" />
        <input v-model="form.menu_name" placeholder="Menu" />
        <input v-model="form.price" type="number" placeholder="₱" />

  <select v-model="form.status">
        <option value="reserved">Reserved</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
  </select>

    <button class="btn-primary" @click="addOrder">
        Add to queue
    </button>
</div>

    <table class="queue-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Menu</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

<tbody>
  <tr v-for="item in queue" :key="item.id" class="row-animate">
    <td>{{ item.customer_id }}</td>

    <td>
      <input
        v-if="editingId === item.id"
        v-model="editForm.customer_name"
      />
      <span v-else>{{ item.customer_name }}</span>
    </td>

    <td>
      <input
        v-if="editingId === item.id"
        v-model="editForm.menu_name"
      />
      <span v-else>{{ item.menu_name }}</span>
    </td>

    <td>
      <input
        v-if="editingId === item.id"
        type="number"
        v-model="editForm.price"
        style="width: 80px;"
      />
      <span v-else>₱{{ item.price }}</span>
    </td>

    <td>
      <select
        v-if="editingId === item.id"
        v-model="editForm.status"
      >
        <option value="reserved">Reserved</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <span
        v-else
        :class="['status', item.status.replace(' ', '-')]"
      >
        {{ item.status }}
      </span>
    </td>

<td class="actions">

  <template v-if="editingId === item.id">
    <button class="icon-btn save" @click="saveEdit(item.id)"> <Check /> </button>
    <button class="icon-btn cancel" @click="cancelEdit"> <Trash2 /> </button>
  </template>

  <template v-else>
    <button class="icon-btn edit" @click="startEdit(item)"> <Pencil /> </button>
    <button class="icon-btn progress" @click="updateStatus(item.id, 'in progress')"> <Play /> </button>
    <button class="icon-btn finished" @click="updateStatus(item.id, 'done')"> <Check /> </button>
    <button class="icon-btn delete" @click="deleteOrder(item.id)"> <Trash2 /> </button>
  </template>

</td>

  </tr>
</tbody>

    </table>
  </section>
</template>
