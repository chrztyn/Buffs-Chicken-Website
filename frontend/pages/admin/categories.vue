<template>
  <div class="p-4 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="font-['Poppins'] font-bold text-4xl text-[#1A4189] mb-2">Categories</h1>
        <p class="font-['Poppins'] text-gray-600">Manage menu categories and display order</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="orderChanged"
          @click="saveOrder"
          :disabled="savingOrder"
          class="px-5 py-2 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#153066] transition text-sm disabled:opacity-60"
        >
          {{ savingOrder ? 'Saving...' : 'Save Order' }}
        </button>
        <button
          @click="openAdd"
          class="px-6 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#e5551a] transition"
        >
          + Add Category
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <p class="text-sm font-['Poppins'] text-blue-700">
        Use <strong>↑ ↓</strong> arrows to set the order categories appear on the menu. Click <strong>Save Order</strong> when done.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <p class="font-['Poppins'] font-bold text-gray-400 mb-1">No categories yet</p>
      <p class="font-['Poppins'] text-gray-300 text-xs mb-5">Create categories like Wings, Combos, or Sides</p>
      <button @click="openAdd" class="px-5 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg text-sm hover:bg-[#e5551a] transition">
        + Create Category
      </button>
    </div>

    <!-- Category List -->
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
      <div
        v-for="(cat, idx) in categories"
        :key="cat._id"
        class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <!-- Position number -->
        <span class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold font-['Poppins'] text-gray-500 shrink-0">
          {{ idx + 1 }}
        </span>

        <!-- Up / Down -->
        <div class="flex flex-col gap-0.5 shrink-0">
          <button
            @click="moveUp(idx)"
            :disabled="idx === 0"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/>
            </svg>
          </button>
          <button
            @click="moveDown(idx)"
            :disabled="idx === categories.length - 1"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <!-- Name + slug -->
        <div class="flex-1 min-w-0">
          <p class="font-['Poppins'] font-bold text-gray-800">{{ cat.name }}</p>
          <p class="text-xs text-gray-400 font-['Poppins']">slug: <span class="font-mono">{{ cat.slug }}</span></p>
        </div>

        <!-- Visible badge -->
        <span
          :class="cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          class="px-2.5 py-1 rounded-full text-xs font-['Poppins'] font-bold shrink-0"
        >
          {{ cat.isActive ? 'Visible' : 'Hidden' }}
        </span>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button @click="openEdit(cat)" class="px-3 py-1.5 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg text-xs hover:bg-[#153066] transition">
            Edit
          </button>
          <button @click="confirmDelete(cat)" class="px-3 py-1.5 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg text-xs hover:bg-[#e5551a] transition">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- ── Add / Edit Modal ── -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="font-['Poppins'] font-bold text-lg text-[#1A4189]">
            {{ editingCategory ? 'Edit Category' : 'Add Category' }}
          </h2>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] text-sm mb-1">Category Name *</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Wings, Combos, Sides"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Poppins']"
              @keyup.enter="save"
            />
            <p class="mt-1.5 text-xs text-gray-400 font-['Poppins']">
              Slug: <span class="font-mono font-semibold text-gray-600">{{ slugPreview }}</span>
              <span class="ml-2 text-gray-300">— matches products by this slug</span>
            </p>
          </div>
          <div class="flex items-center justify-between py-2.5 border rounded-xl px-4 bg-gray-50">
            <div>
              <p class="font-['Poppins'] font-semibold text-[#1A4189] text-sm">Show on Menu</p>
              <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Hide to temporarily remove from menu</p>
            </div>
            <button
              type="button"
              @click="form.isActive = !form.isActive"
              :class="form.isActive ? 'bg-green-500' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span :class="form.isActive ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"/>
            </button>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button @click="closeModal" class="px-5 py-2 border border-gray-300 rounded-lg font-['Poppins'] font-bold text-sm hover:bg-gray-100 transition">Cancel</button>
          <button @click="save" :disabled="saving" class="px-5 py-2 bg-[#FE601C] text-white rounded-lg font-['Poppins'] font-bold text-sm hover:bg-[#e5551a] transition disabled:opacity-60">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Delete Confirm ── -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteConfirm = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="font-['Poppins'] font-bold text-gray-800 mb-1">Delete Category?</h3>
        <p class="text-sm text-gray-500 font-['Poppins'] mb-6">
          Delete <strong>"{{ deletingCategory?.name }}"</strong>? Products won't be deleted but will disappear from the menu until reassigned to a new category.
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteConfirm = false" class="flex-1 py-2 border border-gray-300 rounded-lg font-['Poppins'] font-bold text-sm hover:bg-gray-100 transition">Cancel</button>
          <button @click="executeDelete" :disabled="deleting" class="flex-1 py-2 bg-red-500 text-white rounded-lg font-['Poppins'] font-bold text-sm hover:bg-red-600 transition disabled:opacity-60">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'admin' })

// ── API ───────────────────────────────────────────────────────────────────────
const {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  reorderCategories, 
  deleteCategory
} = useApi()

// ── State ─────────────────────────────────────────────────────────────────────
const categories = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const savingOrder = ref(false)
const deleting = ref(false)
const orderChanged = ref(false)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingCategory = ref<any>(null)
const deletingCategory = ref<any>(null)
const form = ref({ name: '', isActive: true })

const slugPreview = computed(() =>
  form.value.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '—'
)

const loadCategories = async () => {
  loading.value = true
  try {
    const res = await getAllCategoriesAdmin()
    categories.value = (res?.data?.data || []).sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    orderChanged.value = false
  } catch (e) {
    console.error('loadCategories', e)
  } finally {
    loading.value = false
  }
}

// ── Reorder ───────────────────────────────────────────────────────────────────
const moveUp = (idx: number) => {
  if (idx === 0) return
  const arr = [...categories.value];
  [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
  categories.value = arr
  orderChanged.value = true
}

const moveDown = (idx: number) => {
  if (idx === categories.value.length - 1) return
  const arr = [...categories.value];
  [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
  categories.value = arr
  orderChanged.value = true
}

const saveOrder = async () => {
  savingOrder.value = true
  try {
    const updates = categories.value.map((cat, idx) => ({ categoryId: cat._id, displayOrder: idx }))
    await reorderCategories(updates) 
    orderChanged.value = false
    await loadCategories()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save order')
  } finally {
    savingOrder.value = false
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
const openAdd = () => {
  editingCategory.value = null
  form.value = { name: '', isActive: true }
  showModal.value = true
}

const openEdit = (cat: any) => {
  editingCategory.value = cat
  form.value = { name: cat.name, isActive: cat.isActive }
  showModal.value = true
}

const closeModal = () => { showModal.value = false; editingCategory.value = null }

const save = async () => {
  if (!form.value.name.trim()) { alert('Please enter a category name'); return }
  saving.value = true
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value._id, form.value)
    } else {
      await createCategory(form.value)
    }
    closeModal()
    await loadCategories()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save category')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (cat: any) => { deletingCategory.value = cat; showDeleteConfirm.value = true }

const executeDelete = async () => {
  deleting.value = true
  try {
    await deleteCategory(deletingCategory.value._id)
    showDeleteConfirm.value = false
    await loadCategories()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}

onMounted(loadCategories)
</script>