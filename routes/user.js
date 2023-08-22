import express from 'express';

const router = express.Router();

router.get('/info', (req, res) => {
  const { user } = req;

  res.json({ user });
});

export default router;
