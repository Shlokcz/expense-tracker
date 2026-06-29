import request from 'supertest';

import app from '../src/app';

let token: string;
let expenseId: string;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'Password123' });

  token = res.body.data?.token || '';
});

describe('Expense Routes', () => {
  describe('POST /api/expenses', () => {
    it('should create an expense', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          desc: 'Test expense',
          amount: 100,
          category: 'Food',
          type: 'expense',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expenseId = res.body.data.id;
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send({ desc: 'Test', amount: 50, category: 'Food', type: 'expense' });

      expect(res.status).toBe(401);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({ desc: '', amount: -5, category: 'Invalid' });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/expenses', () => {
    it('should list expenses', async () => {
      const res = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/expenses/summary', () => {
    it('should return summary', async () => {
      const res = await request(app)
        .get('/api/expenses/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('balance');
      expect(res.body.data).toHaveProperty('totalIncome');
      expect(res.body.data).toHaveProperty('totalExpense');
      expect(res.body.data).toHaveProperty('categoryBreakdown');
    });
  });

  describe('PUT /api/expenses/:id', () => {
    it('should update an expense', async () => {
      const res = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ desc: 'Updated expense', amount: 150 });

      expect(res.status).toBe(200);
      expect(res.body.data.desc).toBe('Updated expense');
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should delete an expense', async () => {
      const res = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
