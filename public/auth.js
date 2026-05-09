const SUPABASE_URL = 'https://jhjpdypjbcxyrurqownc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBkeXBqYmN4eXJ1cnFvd25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDgxMDksImV4cCI6MjA5MzYyNDEwOX0.AwdurgMrs9V72MjRuc9FpC1jNfQkefUcIJla_0HrEkU';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSession() {
  const {data: { session } } = await client.auth.getSession();
  if (session && window.location.pathname.includes('login') ||
      session && window.location.pathname.includes('signup')) {
        window.location.href = 'dashboard.html';
      }
}
checkSession();

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.display = 'block';
  } else {
    window.location.href = 'dashboard.html';
  }
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  const successMsg = document.getElementById('success-msg');
  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  const { error } = await client.auth.signUp({ email, password });

  if (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.display = 'block';
  } else {
    // Check if they came from pricing page
    const redirect = sessionStorage.getItem('redirect');
    if (redirect === 'pricing') {
      sessionStorage.removeItem('redirect');
      window.location.href = 'pricing.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }
}