<template>
    <div class="shortcuts-container">
      <header class="header">
        <h1>⌨️ 快捷键管理器</h1>
        <p class="subtitle">输入缩写后按下 【空格键】，即可在系统任意位置自动替换为固定文本。</p>
      </header>
  
      <div class="main-layout">
        <section class="form-section">
          <h2>{{ isEditing ? '📝 修改映射规则' : '➕ 新增映射规则' }}</h2>
          <form @submit.prevent="handleSubmit" class="snippet-form">
            <div class="form-item">
              <label for="shortcut">快捷键缩写 (如: ssf)</label>
              <input 
                id="shortcut"
                v-model.trim="form.shortcut" 
                type="text" 
                placeholder="请输入缩写字母..." 
                :disabled="isEditing"
                required
              />
            </div>
            <div class="form-item">
              <label for="content">替换后的文本内容</label>
              <textarea 
                id="content"
                v-model="form.content" 
                placeholder="请输入需要自动替换的长文本或 SQL 语句..." 
                rows="6"
                required
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ isEditing ? '保存修改' : '立即添加' }}
              </button>
              <button v-if="isEditing" type="button" @click="cancelEdit" class="btn-secondary">
                取消
              </button>
            </div>
          </form>
        </section>
  
        <section class="list-section">
          <h2>📋 现有映射列表 (共 {{ snippets.length }} 条)</h2>
          <div class="table-wrapper">
            <table class="snippet-table">
              <thead>
                <tr>
                  <th>缩写 (Trigger)</th>
                  <th>替换内容 (Content)</th>
                  <th style="width: 120px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in snippets" :key="item.id">
                  <td class="td-shortcut"><span class="badge">{{ item.shortcut }}</span></td>
                  <td class="td-content"><code>{{ item.content }}</code></td>
                  <td>
                    <div class="action-btns">
                      <button @click="startEdit(item)" class="btn-text edit">编辑</button>
                      <button @click="handleDelete(item.id!)" class="btn-text delete">删除</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="snippets.length === 0">
                  <td colspan="3" class="empty-tip">暂无数据，请在左侧添加你的第一个快捷键！</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import axios from 'axios'
  
  // 定义 TypeScript 接口契约
  interface Snippet {
    id?: number;
    shortcut: string;
    content: string;
  }
  
  // 后端 FastAPI 服务的本地运行地址
  const API_BASE_URL = 'http://127.0.0.1:8000/api/snippets'
  
  // 状态定义
  const snippets = ref<Snippet[]>([])
  const isEditing = ref(false)
  const form = reactive<Snippet>({
    shortcut: '',
    content: ''
  })
  
  // 查：从后端获取数据列表
  const fetchList = async () => {
    try {
      const response = await axios.get<Snippet[]>(API_BASE_URL)
      snippets.value = response.data
    } catch (error) {
      console.error('获取列表失败:', error)
      alert('无法连接到后端 API，请检查 FastAPI 服务是否启动！')
    }
  }
  
  // 增 / 改：提交表单数据
  const handleSubmit = async () => {
    try {
      const response = await axios.post(API_BASE_URL, form)
      if (response.data.status === 'success') {
        alert(isEditing.value ? '修改成功！' : '添加成功！')
        resetForm()
        await fetchList()
      } else {
        alert(`操作失败: ${response.data.message}`)
      }
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }
  
  // 删：删除指定 ID 的数据
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条快捷键映射吗？')) return
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`)
      if (response.data.status === 'success') {
        alert('删除成功，系统热键已同步卸载！')
        cancelEdit()
        await fetchList()
      }
    } catch (error) {
      console.error('删除数据失败:', error)
    }
  }
  
  // 进入编辑状态
  const startEdit = (item: Snippet) => {
    isEditing.value = true
    form.id = item.id
    form.shortcut = item.shortcut
    form.content = item.content
  }
  
  // 取消/重置表单
  const cancelEdit = () => {
    resetForm()
  }
  
  const resetForm = () => {
    isEditing.value = false
    delete form.id
    form.shortcut = ''
    form.content = ''
  }
  
  // 页面挂载时自动加载数据
  onMounted(() => {
    fetchList()
  })
  </script>
  
  <style scoped>
  .shortcuts-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 20px;
  }
  
  .header h1 {
    font-size: 2.2rem;
    color: #1a1a1a;
    margin-bottom: 10px;
  }
  
  .subtitle {
    color: #666;
    font-size: 1rem;
  }
  
  .main-layout {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 40px;
    align-items: start;
  }
  
  section {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
  }
  
  section h2 {
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 24px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f5f5f5;
    color: #2c3e50;
  }
  
  .snippet-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-item label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #4a5568;
  }
  
  .form-item input, .form-item textarea {
    padding: 10px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.95rem;
  }
  
  .form-item input:focus, .form-item textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  
  .form-item input:disabled {
    background-color: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
  }
  
  button {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }
  
  .btn-primary {
    background-color: #2563eb;
    color: white;
    flex: 1;
  }
  
  .btn-primary:hover {
    background-color: #1d4ed8;
  }
  
  .btn-secondary {
    background-color: #e2e8f0;
    color: #475569;
  }
  
  .btn-secondary:hover {
    background-color: #cbd5e1;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .snippet-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  .snippet-table th {
    background-color: #f8fafc;
    padding: 14px;
    font-weight: 600;
    color: #475569;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .snippet-table td {
    padding: 14px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  
  .badge {
    background-color: #ef4444;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
  }
  
  .td-content code {
    background-color: #f8fafc;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    font-family: monospace;
    color: #0f172a;
    white-space: pre-wrap;
    display: block;
    max-height: 120px;
    overflow-y: auto;
  }
  
  .action-btns {
    display: flex;
    gap: 10px;
  }
  
  .btn-text {
    padding: 4px 8px;
    font-size: 0.85rem;
    background: transparent;
  }
  
  .btn-text.edit { color: #2563eb; }
  .btn-text.edit:hover { text-decoration: underline; }
  
  .btn-text.delete { color: #dc2626; }
  .btn-text.delete:hover { text-decoration: underline; }
  
  .empty-tip {
    text-align: center;
    color: #94a3b8;
    padding: 40px !important;
  }
  </style>