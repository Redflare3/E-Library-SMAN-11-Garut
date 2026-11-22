import { request } from './client.js'

// GET /api/categories?type=BOOK|ARCHIVE → pohon kategori akar (children dihilangkan pada daun)
export function listCategories(type = 'BOOK') {
  return request('/categories', { query: { type } })
}

// Ratakan pohon menjadi daftar berurutan dengan kedalaman untuk indentasi
export function flattenCategories(tree, depth = 0, out = []) {
  for (const cat of tree || []) {
    out.push({ id: cat.id, name: cat.name, parentId: cat.parentId ?? null, depth })
    flattenCategories(cat.children ?? [], depth + 1, out)
  }
  return out
}
