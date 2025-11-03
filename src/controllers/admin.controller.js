// src/controllers/admin.controller.js
const AdminService = require('../services/admin.service');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) { next(error); }
  }

  async deleteUser(req, res, next) {
    try {
      await AdminService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) { next(error); }
  }

  async updateUserRole(req, res, next) {
    try {
      const updatedUser = await AdminService.updateUserRole(req.params.id, req.body.role);
      res.status(200).json(updatedUser);
    } catch (error) { next(error); }
  }
}
module.exports = new AdminController();