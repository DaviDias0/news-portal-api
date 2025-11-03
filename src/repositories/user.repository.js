// src/repositories/user.repository.js
const prisma = require('../lib/prisma');

class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
  async create(userData) {
    return prisma.user.create({ data: userData });
  }
}
module.exports = new UserRepository();