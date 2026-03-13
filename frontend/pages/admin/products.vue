<template>
  <div class="p-4 lg:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="font-['Poppins'] font-bold text-4xl text-[#1A4189] mb-2">Products</h1>
        <p class="font-['Poppins'] text-gray-600">Manage your menu items</p>
      </div>
      <button
        v-if="pageTab === 'products'"
        @click="openAddProduct"
        class="px-6 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#e5551a] transition"
      >
        + Add Product
      </button>
      <button
        v-if="pageTab === 'modifiers' && modifiersView === 'list'"
        @click="openAddModifierGroup"
        class="px-6 py-2 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#153066] transition"
      >
        + Add Modifier
      </button>
    </div>

    <!-- Page-level Tabs -->
    <div class="flex border-b border-gray-200 mb-6">
      <button
        type="button"
        @click="pageTab = 'products'"
        :class="pageTab === 'products' ? 'border-b-2 border-[#FE601C] text-[#FE601C] font-bold' : 'text-gray-400 hover:text-gray-600'"
        class="px-6 py-2.5 font-['Poppins'] text-sm transition-colors"
      >
        Products
      </button>
      <button
        type="button"
        @click="pageTab = 'modifiers'"
        :class="pageTab === 'modifiers' ? 'border-b-2 border-[#FE601C] text-[#FE601C] font-bold' : 'text-gray-400 hover:text-gray-600'"
        class="px-6 py-2.5 font-['Poppins'] text-sm transition-colors"
      >
        Modifiers
      </button>
    </div>

    <!-- ============================================================ -->
    <!-- PRODUCTS TAB                                                  -->
    <!-- ============================================================ -->
    <div v-show="pageTab === 'products'">
      <!-- Search & Filter -->
      <div class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Poppins']"
          />
          <select
            v-model="filterCategory"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] font-['Poppins']"
          >
            <option value="">All Categories</option>
            <option value="wings">Wings</option>
            <option value="sandwiches">Sandwiches</option>
            <option value="combos">Combos</option>
            <option value="sides">Sides</option>
            <option value="meals">Meals</option>
            <option value="pasta">Pasta</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <p class="text-gray-500 font-['Poppins'] text-lg">No products found</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
        >
          <div class="w-full h-56 bg-gray-200 overflow-hidden flex-shrink-0">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="font-['Poppins'] font-bold text-lg text-[#1A4189] mb-1 line-clamp-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-xs font-['Poppins'] mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span class="font-['Poppins'] font-bold text-2xl text-[#FE601C]">₱{{ product.price }}</span>
              <span
                :class="product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-['Poppins'] font-bold whitespace-nowrap"
              >
                {{ product.isAvailable ? 'Available' : 'Out of Stock' }}
              </span>
            </div>
            <div v-if="product.modifierGroups?.length > 0" class="mb-4 text-xs font-['Poppins'] text-gray-500">
              {{ product.modifierGroups.length }} modifier group{{ product.modifierGroups.length !== 1 ? 's' : '' }}
            </div>
            <div class="flex gap-3">
              <button
                @click="openEditProduct(product)"
                class="flex-1 px-4 py-2 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#153066] transition"
              >Edit</button>
              <button
                @click="deleteProduct(product._id)"
                class="flex-1 px-4 py-2 bg-[#FE601C] text-white font-['Poppins'] font-bold rounded-lg hover:bg-[#e5551a] transition"
              >Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODIFIERS TAB                                                 -->
    <!-- ============================================================ -->
    <div v-show="pageTab === 'modifiers'">

      <!-- ── LIST VIEW ── -->
      <div v-if="modifiersView === 'list'">
        <div v-if="modifierGroups.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="font-['Poppins'] font-bold text-gray-400 mb-1">No modifiers yet</p>
          <p class="font-['Poppins'] text-gray-300 text-xs mb-5">Create modifier groups like sauces, sizes, or extras</p>
          <button @click="openAddModifierGroup" class="px-5 py-2 bg-[#1A4189] text-white font-['Poppins'] font-bold rounded-lg text-sm hover:bg-[#153066] transition">
            + Create Modifier
          </button>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
          <div
            v-for="group in modifierGroups"
            :key="group._id"
            @click="openEditModifierGroup(group)"
            class="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <!-- Name + items preview -->
            <div class="flex-1 min-w-0">
              <p class="font-['Poppins'] font-bold text-gray-800 text-sm">{{ group.name }}</p>
              <p class="text-xs text-gray-400 font-['Poppins'] truncate mt-0.5">
                {{ group.items.length > 0 ? group.items.map((i: any) => i.name).join(', ') : 'No items yet' }}
              </p>
            </div>
            <!-- Chevron -->
            <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- ── FORM VIEW ── -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Form header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button
            @click="modifiersView = 'list'"
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 class="font-['Poppins'] font-bold text-[#1A4189] text-sm">
            {{ editingModifierGroup ? 'Edit Modifier' : 'Create Modifier' }}
          </h2>
        </div>

        <!-- Form body -->
        <div class="px-6 py-6">
          <!-- Modifier name -->
          <div class="mb-5">
            <p class="text-xs text-gray-400 font-['Poppins'] mb-1">Modifier name</p>
            <input
              v-model="modifierGroupForm.name"
              type="text"
              placeholder="e.g., Dipping Sauces"
              class="w-full text-2xl font-['Poppins'] font-bold text-[#1A4189] bg-transparent border-b-2 border-gray-200 focus:border-[#FE601C] focus:outline-none py-1"
            />
          </div>

          <!-- Type presets -->
          <div class="mb-5">
            <p class="text-xs text-gray-400 font-['Poppins'] mb-2">Type</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="preset in modifierPresets"
                :key="preset.label"
                type="button"
                @click="applyModifierPreset(preset)"
                :class="[
                  'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all',
                  modifierGroupForm.minSelections === preset.min && modifierGroupForm.maxSelections === preset.max
                    ? 'bg-[#1A4189] border-[#1A4189] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#1A4189]'
                ]"
              >
                <span class="font-['Poppins'] font-bold text-xs">{{ preset.label }}</span>
                <span class="font-['Poppins'] text-[10px] opacity-70 leading-tight">{{ preset.hint }}</span>
              </button>
            </div>
          </div>

          <!-- Selection rules (advanced) -->
          <div class="grid grid-cols-2 gap-4 mb-7 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p class="text-xs text-gray-400 font-['Poppins'] mb-1">Min selections</p>
              <p class="text-xs text-gray-300 font-['Poppins'] mb-2">0 = optional</p>
              <input
                v-model.number="modifierGroupForm.minSelections"
                type="number"
                min="0"
                class="w-full text-sm font-['Poppins'] bg-transparent border-b border-gray-200 py-0.5 focus:outline-none focus:border-[#FE601C] transition-colors"
              />
            </div>
            <div>
              <p class="text-xs text-gray-400 font-['Poppins'] mb-1">Max selections</p>
              <p class="text-xs text-gray-300 font-['Poppins'] mb-2">0 = unlimited · 1 = single</p>
              <input
                v-model.number="modifierGroupForm.maxSelections"
                type="number"
                min="0"
                class="w-full text-sm font-['Poppins'] bg-transparent border-b border-gray-200 py-0.5 focus:outline-none focus:border-[#FE601C] transition-colors"
              />
            </div>
          </div>

          <!-- Option rows -->
          <div>
            <div v-if="modifierFormItems.length > 0" class="border border-gray-100 rounded-xl overflow-hidden mb-1">
              <div
                v-for="(item, idx) in modifierFormItems"
                :key="idx"
                class="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 group"
              >
                <!-- Drag handle -->
                <svg class="w-5 h-5 text-gray-300 shrink-0 cursor-grab" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 14a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 22a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>

                <!-- Name + Price -->
                <div class="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-400 font-['Poppins'] mb-1">Option name</p>
                    <input
                      v-model="item.name"
                      type="text"
                      class="w-full text-sm bg-transparent border-b border-gray-200 py-0.5 focus:outline-none focus:border-[#FE601C] transition-colors"
                    />
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-['Poppins'] mb-1">Price</p>
                    <input
                      v-model.number="item.priceModifier"
                      type="number"
                      step="0.01"
                      class="w-full text-sm bg-transparent border-b border-gray-200 py-0.5 focus:outline-none focus:border-[#FE601C] transition-colors"
                    />
                  </div>
                </div>

                <!-- Availability toggle -->
                <div class="flex flex-col items-center gap-1 shrink-0">
                  <p class="text-xs font-['Poppins']" :class="item.isAvailable ? 'text-green-600 font-semibold' : 'text-gray-400'">{{ item.isAvailable ? 'Visible' : 'Hidden' }}</p>
                  <button
                    type="button"
                    @click="item.isAvailable = !item.isAvailable"
                    :class="item.isAvailable ? 'bg-green-500' : 'bg-gray-300'"
                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                    :title="item.isAvailable ? 'Visible' : 'Hidden'"
                  >
                    <span
                      :class="item.isAvailable ? 'translate-x-[18px]' : 'translate-x-[2px]'"
                      class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                    />
                  </button>
                </div>

                <!-- Delete -->
                <button
                  @click="removeFormItem(idx)"
                  type="button"
                  class="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                  title="Remove option"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Add Option button -->
            <button
              @click="addFormItem"
              type="button"
              class="flex items-center gap-2 font-['Poppins'] font-bold text-sm text-[#FE601C] mt-4 hover:opacity-75 transition-opacity"
            >
              <span class="w-5 h-5 rounded-full border-2 border-[#FE601C] flex items-center justify-center text-lg leading-none">+</span>
              ADD OPTION
            </button>
          </div>
        </div>

        <!-- Form footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            v-if="editingModifierGroup"
            @click="confirmDeleteModifierGroup(editingModifierGroup)"
            type="button"
            class="font-['Poppins'] font-bold text-sm text-red-500 hover:text-red-700 transition-colors px-2 py-1"
          >Delete</button>
          <div v-else></div>
          <div class="flex items-center gap-3">
            <button
              @click="modifiersView = 'list'"
              type="button"
              class="px-5 py-2 border border-gray-300 rounded-lg font-['Poppins'] font-bold text-sm hover:bg-gray-100 transition"
            >Cancel</button>
            <button
              @click="saveModifierGroup"
              type="button"
              class="px-5 py-2 bg-[#FE601C] text-white rounded-lg font-['Poppins'] font-bold text-sm hover:bg-[#e5551a] transition"
            >Save</button>
          </div>
        </div>
      </div>

    </div>

    <!-- ============================================================ -->
    <!-- PRODUCT FORM MODAL                                            -->
    <!-- ============================================================ -->
    <Modal
      :is-open="showProductModal"
      :title="editingProduct ? 'Edit Product' : 'Add New Product'"
      :submit-disabled="imageUploading"
      @close="closeProductModal"
      @submit="saveProduct"
    >
      <!-- Modal Tabs -->
      <div class="flex border-b border-gray-200 mb-5 -mt-1">
        <button
          type="button"
          @click="activeTab = 'details'"
          :class="activeTab === 'details' ? 'border-b-2 border-[#1A4189] text-[#1A4189] font-bold' : 'text-gray-400 hover:text-gray-600'"
          class="px-5 py-2.5 font-['Poppins'] text-sm transition-colors"
        >Details</button>
        <button
          type="button"
          @click="activeTab = 'modifiers'"
          :class="activeTab === 'modifiers' ? 'border-b-2 border-[#1A4189] text-[#1A4189] font-bold' : 'text-gray-400 hover:text-gray-600'"
          class="px-5 py-2.5 font-['Poppins'] text-sm transition-colors"
        >Modifiers</button>
      </div>

      <!-- ── DETAILS TAB ── -->
      <div v-show="activeTab === 'details'" class="space-y-4">
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Product Name *</label>
          <input
            v-model="productForm.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
          />
        </div>

        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Description</label>
          <textarea
            v-model="productForm.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C] resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Price (₱) *</label>
            <input
              v-model.number="productForm.price"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            />
          </div>
          <div>
            <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Category</label>
            <select
              v-model="productForm.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE601C]"
            >
              <option value="">Select Category</option>
              <option value="wings">Wings</option>
              <option value="sandwiches">Sandwiches</option>
              <option value="combos">Combos</option>
              <option value="sides">Sides</option>
              <option value="meals">Meals</option>
              <option value="pasta">Pasta</option>
            </select>
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block font-['Poppins'] font-semibold text-[#1A4189] mb-2">Product Image</label>
          <div
            @click="!imageUploading && triggerFileInput()"
            @dragover.prevent="!imageUploading && (isDragOver = true)"
            @dragleave="isDragOver = false"
            @drop.prevent="!imageUploading && handleDrop($event)"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center transition',
              imageUploading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
              isDragOver ? 'border-[#FE601C] bg-orange-50' : 'border-gray-300 hover:border-[#FE601C]'
            ]"
          >
            <div v-if="imageUploading" class="text-[#FE601C] font-['Poppins']">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-[#FE601C] border-r-transparent mb-3"></div>
              <p class="font-semibold">Uploading & compressing image...</p>
              <p class="text-sm text-gray-600 mt-1">Please wait</p>
            </div>
            <div v-else-if="!productForm.imagePreview" class="text-gray-500 font-['Poppins']">
              <p class="mb-2">Click to upload or drag and drop</p>
              <p class="text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div v-else class="relative inline-block">
              <img :src="productForm.imagePreview" alt="Preview" class="max-h-48 rounded-lg" />
              <button
                @click.stop="productForm.imagePreview = ''; productForm.image = ''"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
              >  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
          <p v-if="imageUploading" class="text-sm text-[#FE601C] font-['Poppins'] font-semibold mt-2">Please wait for upload to complete before saving</p>
          <p v-else-if="productForm.image" class="text-sm text-green-600 font-['Poppins'] font-semibold mt-2">✓ Image ready</p>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </div>

        <!-- Availability Toggle -->
        <div class="flex items-center justify-between py-2 border rounded-xl px-4 bg-gray-50">
          <div>
            <p class="font-['Poppins'] font-semibold text-[#1A4189] text-sm">Available for Order</p>
            <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Show this item to customers</p>
          </div>
          <button
            type="button"
            @click="productForm.isAvailable = !productForm.isAvailable"
            :class="productForm.isAvailable ? 'bg-green-500' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            <span :class="productForm.isAvailable ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform" />
          </button>
        </div>

        <!-- Popular Pick Toggle -->
        <div class="flex items-center justify-between py-2 border rounded-xl px-4 bg-gray-50">
          <div>
            <p class="font-['Poppins'] font-semibold text-[#FE601C] text-sm">Popular Pick</p>
            <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Featured on the home page</p>
          </div>
          <button
            type="button"
            @click="productForm.isPopularPick = !productForm.isPopularPick"
            :class="productForm.isPopularPick ? 'bg-[#FE601C]' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FE601C] focus:ring-offset-2"
          >
            <span :class="productForm.isPopularPick ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform" />
          </button>
        </div>

        <!-- Special Requests Toggle -->
        <div class="flex items-center justify-between py-2 border rounded-xl px-4 bg-gray-50">
          <div>
            <p class="font-['Poppins'] font-semibold text-[#1A4189] text-sm">Allow Special Requests</p>
            <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">Customers can add notes at checkout</p>
          </div>
          <button
            type="button"
            @click="productForm.allowSpecialRequests = !productForm.allowSpecialRequests"
            :class="productForm.allowSpecialRequests ? 'bg-[#1A4189]' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A4189] focus:ring-offset-2"
          >
            <span :class="productForm.allowSpecialRequests ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform" />
          </button>
        </div>
      </div>

      <!-- ── MODIFIERS TAB (in modal) ── -->
      <div v-show="activeTab === 'modifiers'" class="space-y-3">
        <p class="text-xs text-gray-400 font-['Poppins']">
          Toggle which modifier groups customers can choose from when ordering this product.
          Manage the groups and their items on the <strong>Modifiers</strong> page tab.
        </p>

        <div v-if="modifierGroups.length === 0" class="text-center py-8 border border-dashed border-gray-200 rounded-xl">
          <p class="text-gray-400 font-['Poppins'] text-sm">No modifier groups exist yet.</p>
          <p class="text-gray-300 font-['Poppins'] text-xs mt-1">Close this modal and go to the Modifiers tab to create some.</p>
        </div>

        <div
          v-for="group in modifierGroups"
          :key="group._id"
          class="flex items-center justify-between py-2.5 border rounded-xl px-4 bg-gray-50"
        >
          <div class="flex-1 min-w-0 pr-3">
            <p class="font-['Poppins'] font-semibold text-gray-700 text-sm">{{ group.name }}</p>
            <p class="text-xs text-gray-400 font-['Poppins'] mt-0.5">
              {{ group.items.filter((i: any) => i.isAvailable).length }} available item{{ group.items.filter((i: any) => i.isAvailable).length !== 1 ? 's' : '' }}
            </p>
          </div>
          <button
            type="button"
            @click="toggleModifierGroupInProduct(group._id)"
            :class="productForm.modifierGroups.includes(group._id) ? 'bg-[#1A4189]' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none"
          >
            <span
              :class="productForm.modifierGroups.includes(group._id) ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
            />
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Product Confirmation -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Product?"
      :message="`Are you sure you want to delete '${deletingProduct?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Delete Modifier Group Confirmation -->
    <ConfirmModal
      :is-open="showDeleteModifierGroupConfirm"
      title="Delete Modifier Group?"
      :message="`Are you sure you want to delete '${deletingModifierGroup?.name}'? Products using this group will no longer show it.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="executeDeleteModifierGroup"
      @cancel="showDeleteModifierGroupConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import Modal from '~/components/admin/Modal.vue'
import ConfirmModal from '~/components/admin/ConfirmModal.vue'

definePageMeta({
  layout: 'admin'
})

const {
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct: deleteProductApi,
  getAllProductsAdmin,
  uploadImage,
  getModifierGroups,
  createModifierGroup,
  updateModifierGroup,
  deleteModifierGroup: deleteModifierGroupApi
} = useApi()

// ─── Page state ────────────────────────────────────────────────────────────
const pageTab = ref('products')

// ─── Products state ─────────────────────────────────────────────────────────
const products = ref<any[]>([])
const categories = ref<any[]>([])
const searchQuery = ref('')
const filterCategory = ref('')
const showProductModal = ref(false)
const editingProduct = ref<any>(null)
const fileInput = ref()
const isDragOver = ref(false)
const activeTab = ref('details')
const imageUploading = ref(false)

const productForm = ref<any>({
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  imagePreview: '',
  isAvailable: true,
  isPopularPick: false,
  allowSpecialRequests: false,
  modifierGroups: [] as string[]
})

const showDeleteConfirm = ref(false)
const deletingProduct = ref<any>(null)

// ─── Modifier Groups state ──────────────────────────────────────────────────
const modifierGroups = ref<any[]>([])
const modifiersView = ref<'list' | 'form'>('list')
const editingModifierGroup = ref<any>(null)
const modifierGroupForm = ref({ name: '', minSelections: 0, maxSelections: 0 })

const modifierPresets = [
  { label: 'Variant',    hint: 'Pick exactly one · required',  min: 1, max: 1 },
  { label: 'Optional',   hint: 'Pick any · not required',      min: 0, max: 0 },
  { label: 'Required',   hint: 'Pick at least one · required', min: 1, max: 0 },
]

const applyModifierPreset = (preset: { min: number; max: number }) => {
  modifierGroupForm.value.minSelections = preset.min
  modifierGroupForm.value.maxSelections = preset.max
}
const modifierFormItems = ref<any[]>([])
const showDeleteModifierGroupConfirm = ref(false)
const deletingModifierGroup = ref<any>(null)

// ─── Computed ───────────────────────────────────────────────────────────────
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || product.category === filterCategory.value
    return matchesSearch && matchesCategory
  })
})

// ─── Loaders ────────────────────────────────────────────────────────────────
const loadProducts = async () => {
  try {
    const response = await getAllProductsAdmin()
    products.value = response.data
  } catch (error) {
    console.error('Failed to load products:', error)
    alert('Failed to load products. Please try refreshing the page.')
  }
}

const loadCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadModifierGroups = async () => {
  try {
    const response = await getModifierGroups()
    // Only overwrite the list when we got a real array back (the wrap() fallback
    // returns [] on error, which would wipe any already-loaded data)
    if (Array.isArray(response.data) && response.data.length > 0) {
      modifierGroups.value = response.data
    } else if (modifierGroups.value.length === 0) {
      // Allow clearing only when the list was already empty (initial load / genuinely empty)
      modifierGroups.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load modifier groups:', error)
  }
}

// ─── Product CRUD ────────────────────────────────────────────────────────────
const openAddProduct = () => {
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imagePreview: '',
    isAvailable: true,
    isPopularPick: false,
    allowSpecialRequests: false,
    modifierGroups: []
  }
  activeTab.value = 'details'
  showProductModal.value = true
}

const openEditProduct = (product: any) => {
  editingProduct.value = product
  const enabledGroupIds = (product.modifierGroups || [])
    .filter((mg: any) => mg.enabled !== false)
    .map((mg: any) => {
      const id = mg.group?._id || mg.group
      return typeof id === 'object' ? String(id) : id
    })
    .filter(Boolean)

  productForm.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    category: product.category,
    image: product.image || '',
    imagePreview: product.image || '',
    isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    isPopularPick: product.isPopularPick || false,
    allowSpecialRequests: product.allowSpecialRequests || false,
    modifierGroups: enabledGroupIds
  }
  activeTab.value = 'details'
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}

const toggleModifierGroupInProduct = (groupId: string) => {
  const idx = productForm.value.modifierGroups.indexOf(groupId)
  if (idx > -1) {
    productForm.value.modifierGroups.splice(idx, 1)
  } else {
    productForm.value.modifierGroups.push(groupId)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (!file) return
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    const changeEvent = new Event('change', { bubbles: true })
    Object.defineProperty(changeEvent, 'target', { value: { files: dataTransfer.files }, enumerable: true })
    handleImageUpload(changeEvent)
  }
}

const handleImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return
  imageUploading.value = true
  const reader = new FileReader()
  reader.onload = (e) => { productForm.value.imagePreview = e.target?.result }
  reader.readAsDataURL(file)
  try {
    const response = await uploadImage(file)
    if (!response.data?.url) throw new Error('No URL returned from upload')
    productForm.value.image = response.data.url
  } catch (error: any) {
    console.error('Image upload failed:', error)
    alert('Failed to upload image: ' + (error.response?.data?.message || error.message))
    productForm.value.imagePreview = ''
  } finally {
    imageUploading.value = false
  }
}

const saveProduct = async () => {
  if (!productForm.value.name || !productForm.value.price) {
    alert('Please fill in all required fields')
    return
  }
  try {
    const payload = {
      name: productForm.value.name,
      description: productForm.value.description,
      price: productForm.value.price,
      category: productForm.value.category,
      image: productForm.value.image,
      isAvailable: productForm.value.isAvailable,
      isPopularPick: productForm.value.isPopularPick,
      allowSpecialRequests: productForm.value.allowSpecialRequests,
      modifierGroups: productForm.value.modifierGroups.map((id: string) => ({
        group: id,
        enabled: true
      }))
    }
    if (editingProduct.value) {
      await updateProduct(editingProduct.value._id, payload)
    } else {
      await createProduct(payload)
    }
    closeProductModal()
    await loadProducts()
  } catch (error: any) {
    console.error('Save error:', error)
    alert(error.response?.data?.message || 'Failed to save product')
  }
}

const deleteProduct = (productId: string) => {
  deletingProduct.value = products.value.find((p) => p._id === productId)
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteProductApi(deletingProduct.value._id)
    showDeleteConfirm.value = false
    await loadProducts()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to delete product')
  }
}

// ─── Modifier Group CRUD ─────────────────────────────────────────────────────
const openAddModifierGroup = () => {
  editingModifierGroup.value = null
  modifierGroupForm.value = { name: '', minSelections: 0, maxSelections: 0 }
  modifierFormItems.value = []
  modifiersView.value = 'form'
}

const openEditModifierGroup = (group: any) => {
  editingModifierGroup.value = group
  modifierGroupForm.value = { name: group.name, minSelections: group.minSelections ?? 0, maxSelections: group.maxSelections ?? 0 }
  modifierFormItems.value = group.items.map((item: any) => ({ ...item }))
  modifiersView.value = 'form'
}

const addFormItem = () => {
  modifierFormItems.value.push({ name: '', priceModifier: 0, isAvailable: true })
}

const removeFormItem = (idx: number) => {
  modifierFormItems.value.splice(idx, 1)
}

const saveModifierGroup = async () => {
  if (!modifierGroupForm.value.name.trim()) {
    alert('Please enter a modifier name')
    return
  }
  try {
    // Explicitly serialize items to plain objects to avoid Vue proxy quirks
    const payload = {
      name: modifierGroupForm.value.name,
      minSelections: modifierGroupForm.value.minSelections ?? 0,
      maxSelections: modifierGroupForm.value.maxSelections ?? 0,
      items: modifierFormItems.value.map((item: any) => ({
        _id: item._id,
        name: item.name,
        priceModifier: Number(item.priceModifier) || 0,
        isAvailable: Boolean(item.isAvailable !== false)
      }))
    }
    if (editingModifierGroup.value) {
      const { data: updated } = await updateModifierGroup(editingModifierGroup.value._id, payload)
      // Update in-place from server response — no GET reload needed
      const idx = modifierGroups.value.findIndex((g: any) => g._id === editingModifierGroup.value!._id)
      if (idx !== -1 && updated) {
        modifierGroups.value[idx] = updated
      } else {
        await loadModifierGroups()
      }
    } else {
      const { data: created } = await createModifierGroup(payload)
      if (created) {
        modifierGroups.value.push(created)
      } else {
        await loadModifierGroups()
      }
    }
    modifiersView.value = 'list'
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to save modifier')
  }
}

const confirmDeleteModifierGroup = (group: any) => {
  deletingModifierGroup.value = group
  showDeleteModifierGroupConfirm.value = true
}

const executeDeleteModifierGroup = async () => {
  try {
    await deleteModifierGroupApi(deletingModifierGroup.value._id)
    showDeleteModifierGroupConfirm.value = false
    modifiersView.value = 'list'
    await loadModifierGroups()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to delete modifier')
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
  loadModifierGroups()
})
</script>
