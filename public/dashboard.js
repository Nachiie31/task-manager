const SUPABASE_URL = 'https://jhjpdypjbcxyrurqownc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBkeXBqYmN4eXJ1cnFvd25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDgxMDksImV4cCI6MjA5MzYyNDEwOX0.AwdurgMrs9V72MjRuc9FpC1jNfQkefUcIJla_0HrEkU';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentFilter = 'all';
let currentCategory = 'all';
let allTasks = [];

// Check auth
async function init() {
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('user-email').textContent = session.user.email;
  loadTasks();
}

async function loadTasks() {
  const { data, error } = await client.auth.getSession();
  const token = data.session.access_token;

  const res = await fetch('/api/tasks', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  allTasks = await res.json();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  let tasks = allTasks;

  if (currentFilter !== 'all') {
    tasks = tasks.filter(t => t.priority === currentFilter);
  }
  if (currentCategory !== 'all') {
    tasks = tasks.filter(t => t.category === currentCategory);
  }

  if (tasks.length === 0) {
    list.innerHTML = '<p class="empty-text">No tasks yet — add one!</p>';
    return;
  }

  list.innerHTML = tasks.map(task => `
    <div class="task-card ${task.done ? 'done' : ''}">
      <div class="task-left">
        <input type="checkbox" ${task.done ? 'checked' : ''} 
          onchange="toggleTask(${task.id})"/>
        <div class="task-info">
          <p class="task-title">${task.title}</p>
          <div class="task-meta">
            <span class="badge priority-${task.priority}">${task.priority}</span>
            <span class="badge category">${task.category}</span>
            ${task.due_date ? `<span class="badge due">📅 ${task.due_date}</span>` : ''}
          </div>
        </div>
      </div>
      <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `).join('');
}

async function addTask() {
  const title = document.getElementById('task-title').value.trim();
  const priority = document.getElementById('task-priority').value;
  const category = document.getElementById('task-category').value;
  const due_date = document.getElementById('task-due').value || null;

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  const { data } = await client.auth.getSession();
  const token = data.session.access_token;

  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, priority, category, due_date })
  });

  const result = await res.json();
  if (result.error) {
    alert('Error adding task: ' + result.error);
    return;
  }

  closeModal();
  loadTasks();
}

async function toggleTask(id) {
  const { data } = await client.auth.getSession();
  const token = data.session.access_token;

  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  loadTasks();
}

async function deleteTask(id) {
  const { data } = await client.auth.getSession();
  const token = data.session.access_token;

  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  loadTasks();
}

function filterTasks(priority) {
  currentFilter = priority;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks();
}

function filterCategory(category) {
  currentCategory = category;
  renderTasks();
}

function openModal() {
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('task-title').value = '';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-category').value = 'general';
  document.getElementById('task-due').value = '';
}

async function logout() {
  await client.auth.signOut();
  window.location.href = '/';
}

init();