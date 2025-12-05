import { models } from '../models/index.js';
import { formatResponse, paginate } from '../utils/helpers.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = {};
    if (search) {
      whereCondition.name = { [models.Sequelize.Op.like]: `%${search}%` };
    }

    const users = await models.User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ['password'] },
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      formatResponse(true, 'Users retrieved successfully', {
        users: users.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.count,
          pages: Math.ceil(users.count / limit)
        }
      })
    );
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching users')
    );
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: models.Order,
          include: [
            {
              model: models.OrderItem,
              include: [models.Menu]
            },
            models.Payment
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json(
        formatResponse(false, 'User not found')
      );
    }

    res.status(200).json(
      formatResponse(true, 'User retrieved successfully', { user })
    );
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching user')
    );
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await models.User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json(
        formatResponse(false, 'User not found')
      );
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json(
      formatResponse(true, `User ${isActive ? 'activated' : 'deactivated'} successfully`)
    );
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating user status')
    );
  }
};