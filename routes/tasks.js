const express = require('express');
const router = express.Router();
const { createClient} = require('@supabase/supabase-js');
const { create } = require('node:domain');

// let tasks = [];

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// GET all task
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', {ascending: true });
    if (error) return res.status(500).json({error: error.message});
    res.json(data);
});


// POST create a task
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const {data, error} = await supabase
  .from('tasks')
  .insert([{ title }])
  .select();

  if (error) return res.status(500).json({error: error.message});
  res.status(201).json(data[0]);
});


// PUT toggle done
router.put('/:id', async (req, res) => {
  const{ id } = req.params;

  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('done')
    .eq('id', id)
    .single();

  if (fetchError) return res.status(404).json({ error: 'Task not found' });
  
  const {data, error } = await supabase
    .from('tasks')
    .update({ done: !task.done })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE a task

router.delete('/:id', async (req, res) => {
  const {error} = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({error: error.message});
  res.json({ message: 'Task deleted'});
});

module.exports = router;