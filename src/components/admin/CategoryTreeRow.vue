<template>
  <li>
    <div
      class="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50/70 border-b border-slate-100"
      :style="{ paddingLeft: `${12 + depth * 22}px` }"
    >
      <span class="text-slate-300 shrink-0" aria-hidden="true">{{ depth ? '└' : '•' }}</span>
      <span class="min-w-0 flex-1">
        <span class="text-sm font-semibold text-slate-800 break-words">{{ node.name }}</span>
        <span class="ml-2 text-[11px] font-mono text-slate-400">#{{ node.id }}</span>
        <span v-if="children.length" class="ml-2 text-[11px] text-slate-400">{{ children.length }} subkategori</span>
      </span>
      <span class="flex items-center gap-1 shrink-0">
        <button type="button" :class="btn" title="Tambah subkategori" @click="$emit('add', node)">+ Sub</button>
        <button type="button" :class="btn" @click="$emit('edit', node)">Ubah</button>
        <button type="button" :class="[btn, 'text-rose-600 hover:bg-rose-50']" @click="$emit('delete', node)">Hapus</button>
      </span>
    </div>
    <ul v-if="children.length">
      <CategoryTreeRow
        v-for="child in children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        @add="$emit('add', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // CategoryDto { id, name, parentId, children? } (children dihilangkan pada daun)
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 }
})
defineEmits(['add', 'edit', 'delete'])

const children = computed(() => props.node.children ?? [])
const btn = 'px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer'
</script>
