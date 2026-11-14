export const uid = () => Math.random().toString(36).slice(2, 9);
export const getNode = (root, parts) =>
  parts.reduce((n, p) => (n && n.type === 'folder' ? n.children.find(c => c.name === p) : null), root);
export function resolvePath(cwd, arg = '') {
  const parts = arg.startsWith('/') ? [] : [...cwd];
  for (const s of arg.split('/').filter(Boolean)) {
    if (s === '..') parts.pop();
    else if (s !== '.') parts.push(s);
  }
  return parts;
}
export function updateFolder(root, parts, fn) {
  if (!parts.length) return fn(root);
  const [h, ...t] = parts;
  return { ...root, children: root.children.map(c => (c.name === h && c.type === 'folder' ? updateFolder(c, t, fn) : c)) };
}
export const addFolder = (root, parts, name) =>
  updateFolder(root, parts, f => ({ ...f, children: [...f.children, { id: uid(), name, type: 'folder', children: [] }] }));
export const writeFile = (root, parts, name, content) =>
  updateFolder(root, parts, f => ({
    ...f,
    children: f.children.some(c => c.name === name)
      ? f.children.map(c => (c.name === name ? { ...c, content } : c))
      : [...f.children, { id: uid(), name, type: 'file', content }],
  }));
export const removeNode = (root, parts, name) =>
  updateFolder(root, parts, f => ({ ...f, children: f.children.filter(c => c.name !== name) }));
export const renameNode = (root, parts, old, nw) =>
  updateFolder(root, parts, f => ({ ...f, children: f.children.map(c => (c.name === old ? { ...c, name: nw } : c)) }));
export const exists = (root, parts, name) => !!getNode(root, [...parts, name]);
