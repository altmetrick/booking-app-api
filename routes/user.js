import express from 'express';

const router = express.Router();

router.get('/info', (req, res) => {
  const { authMessage } = req;

  res.json({ user: 'some info', message: authMessage });
});

export default router;
