import api from './api';

export const tableService = {
  getAllTables: async () => {
    const response = await api.get('/tables');
    return response.data;
  },

  createTable: async (tableData) => {
    const response = await api.post('/tables', tableData);
    return response.data;
  },

  updateTable: async (id, tableData) => {
    const response = await api.put(`/tables/${id}/occupy`, tableData);
    return response.data;
  },

  adminUpdateTable: async (id, tableData) => {
    const response = await api.put(`/tables/${id}/admin-update`, tableData);
    return response.data;
  },

  deleteTable: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },

  occupyTable: async (id, customerData) => {
    const response = await api.put(`/tables/${id}/occupy`, customerData);
    return response.data;
  },

  releaseTable: async (id) => {
    const response = await api.put(`/tables/${id}/release`);
    return response.data;
  }
};