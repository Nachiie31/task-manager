const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

function getSupabase(token) {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

// GET all tasks
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST create a task
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabase(token);
  
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { title, priority, category, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      title, 
      priority: priority || 'medium', 
      category: category || 'general', 
      due_date: due_date || null, 
      user_id: userData.user.id 
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT toggle done
router.put('/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabase(token);
  const { id } = req.params;

  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('done')
    .eq('id', id)
    .single();

  if (fetchError) return res.status(404).json({ error: 'Task not found' });

  const { data, error } = await supabase
    .from('tasks')
    .update({ done: !task.done })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabase(token);
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted' });
});

module.exports = router;