import request from 'supertest';
import app from '../../src/app';
import { getDatabase } from '../../src/db/database';
import { TodoListModel } from '../../src/models/TodoList';
import { TodoElementModel } from '../../src/models/TodoElement';
import { SubItemModel } from '../../src/models/SubItem';

describe('SubItems Cascading and Progress Calculation', () => {
  beforeEach(() => {
    getDatabase().exec('DELETE FROM subitem');
    getDatabase().exec('DELETE FROM todoelement');
    getDatabase().exec('DELETE FROM todolist');
  });

  describe('Completion Cascading', () => {
    it('should cascade completion to all sub-items when element is marked complete', async () => {
      // Create list
      const listRes = await request(app).post('/api/lists').send({ name: 'Grocery Shopping' });
      const listId = listRes.body.id;

      // Create element
      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Buy fresh vegetables' });
      const elementId = elementRes.body.id;

      // Create sub-items
      const si1Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Broccoli' });
      const si1Id = si1Res.body.id;

      const si2Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Spinach' });
      const si2Id = si2Res.body.id;

      const si3Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Carrots' });
      const si3Id = si3Res.body.id;

      // Mark element as complete
      const updateRes = await request(app)
        .put(`/api/elements/${elementId}/complete`)
        .send({ isCompleted: true });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.isCompleted).toBe(true);

      // Verify all sub-items are completed
      const si1Check = await request(app).get(`/api/subitems/${si1Id}`);
      expect(si1Check.body.isCompleted).toBe(true);

      const si2Check = await request(app).get(`/api/subitems/${si2Id}`);
      expect(si2Check.body.isCompleted).toBe(true);

      const si3Check = await request(app).get(`/api/subitems/${si3Id}`);
      expect(si3Check.body.isCompleted).toBe(true);
    });

    it('should not affect already completed sub-items when cascading', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Create sub-items
      const si1Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 1' });
      const si1Id = si1Res.body.id;

      const si2Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 2' });
      const si2Id = si2Res.body.id;

      // Mark si1 as complete
      await request(app)
        .put(`/api/subitems/${si1Id}/complete`)
        .send({ isCompleted: true });

      // Mark element as complete (should cascade)
      await request(app)
        .put(`/api/elements/${elementId}/complete`)
        .send({ isCompleted: true });

      // Verify both are still complete
      const si1Check = await request(app).get(`/api/subitems/${si1Id}`);
      expect(si1Check.body.isCompleted).toBe(true);

      const si2Check = await request(app).get(`/api/subitems/${si2Id}`);
      expect(si2Check.body.isCompleted).toBe(true);
    });
  });

  describe('Progress Calculation', () => {
    it('should include progress counts in element response', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Create 3 sub-items
      const si1Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 1' });

      const si2Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 2' });

      const si3Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 3' });

      // Mark 2 as complete
      await request(app)
        .put(`/api/subitems/${si1Res.body.id}/complete`)
        .send({ isCompleted: true });

      await request(app)
        .put(`/api/subitems/${si2Res.body.id}/complete`)
        .send({ isCompleted: true });

      // Get element and check progress
      const getRes = await request(app).get(`/api/elements/${elementId}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.subItemCount).toBe(3);
      expect(getRes.body.completedSubItemCount).toBe(2);
    });

    it('should return 0 counts when element has no sub-items', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      const getRes = await request(app).get(`/api/elements/${elementId}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.subItemCount).toBe(0);
      expect(getRes.body.completedSubItemCount).toBe(0);
    });

    it('should update progress counts when sub-items are added', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Check initial counts
      let getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(0);
      expect(getRes.body.completedSubItemCount).toBe(0);

      // Add sub-item
      await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 1' });

      // Check updated counts
      getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(1);
      expect(getRes.body.completedSubItemCount).toBe(0);
    });

    it('should update progress counts when sub-items are deleted', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Create and mark sub-item complete
      const siRes = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 1' });
      const siId = siRes.body.id;

      await request(app)
        .put(`/api/subitems/${siId}/complete`)
        .send({ isCompleted: true });

      // Check counts before deletion
      let getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(1);
      expect(getRes.body.completedSubItemCount).toBe(1);

      // Delete sub-item
      await request(app).delete(`/api/subitems/${siId}`);

      // Check counts after deletion
      getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(0);
      expect(getRes.body.completedSubItemCount).toBe(0);
    });

    it('should calculate progress correctly with mixed completion states', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Create 5 sub-items
      const subItems = [];
      for (let i = 1; i <= 5; i++) {
        const siRes = await request(app)
          .post(`/api/elements/${elementId}/subitems`)
          .send({ text: `Sub ${i}` });
        subItems.push(siRes.body.id);
      }

      // Mark 1st, 3rd, and 5th as complete
      await request(app)
        .put(`/api/subitems/${subItems[0]}/complete`)
        .send({ isCompleted: true });

      await request(app)
        .put(`/api/subitems/${subItems[2]}/complete`)
        .send({ isCompleted: true });

      await request(app)
        .put(`/api/subitems/${subItems[4]}/complete`)
        .send({ isCompleted: true });

      // Check progress
      const getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(5);
      expect(getRes.body.completedSubItemCount).toBe(3);
    });
  });

  describe('Cascading with Progress', () => {
    it('should cascade completion and reflect in progress calculation', async () => {
      const listRes = await request(app).post('/api/lists').send({ name: 'Test List' });
      const listId = listRes.body.id;

      const elementRes = await request(app)
        .post(`/api/lists/${listId}/elements`)
        .send({ text: 'Test Element' });
      const elementId = elementRes.body.id;

      // Create 3 sub-items
      const si1Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 1' });

      const si2Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 2' });

      const si3Res = await request(app)
        .post(`/api/elements/${elementId}/subitems`)
        .send({ text: 'Sub 3' });

      // Mark first two as complete manually
      await request(app)
        .put(`/api/subitems/${si1Res.body.id}/complete`)
        .send({ isCompleted: true });

      await request(app)
        .put(`/api/subitems/${si2Res.body.id}/complete`)
        .send({ isCompleted: true });

      // Check progress before cascading
      let getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.completedSubItemCount).toBe(2);

      // Mark element as complete (cascade the third)
      await request(app)
        .put(`/api/elements/${elementId}/complete`)
        .send({ isCompleted: true });

      // Check progress after cascade
      getRes = await request(app).get(`/api/elements/${elementId}`);
      expect(getRes.body.subItemCount).toBe(3);
      expect(getRes.body.completedSubItemCount).toBe(3);
    });
  });

  afterEach(() => {
    getDatabase().exec('DELETE FROM subitem');
    getDatabase().exec('DELETE FROM todoelement');
    getDatabase().exec('DELETE FROM todolist');
  });
});
