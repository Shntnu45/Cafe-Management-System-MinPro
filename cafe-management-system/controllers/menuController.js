import { models } from '../models/index.js';
import { formatResponse, paginate } from '../utils/helpers.js';
import { Op } from 'sequelize';

export const getCategories = async (req, res) => {
  try {
    const { includeMenus = false } = req.query;
    
    const queryOptions = {
      where: { isActive: true },
      order: [['name', 'ASC']]
    };
    
    if (includeMenus === 'true') {
      queryOptions.include = [{
        model: models.Menu,
        where: { isAvailable: true },
        required: false,
        attributes: ['id', 'name', 'price', 'image']
      }];
    }

    const categories = await models.Category.findAll(queryOptions);

    res.status(200).json(
      formatResponse(true, 'Categories retrieved successfully', { categories })
    );
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching categories')
    );
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { categoryId, vegetarian, search, page = 1, limit = 100, includeUnavailable = false } = req.query;
    const { limit: queryLimit, offset } = paginate(parseInt(page), parseInt(limit));

    const whereCondition = {};
    
    // For admin requests, include unavailable items
    if (!includeUnavailable || includeUnavailable === 'false') {
      whereCondition.isAvailable = true;
    }
    
    if (categoryId) whereCondition.categoryId = categoryId;
    if (vegetarian !== undefined) whereCondition.isVegetarian = vegetarian === 'true';
    if (search) {
      whereCondition.name = { [models.Sequelize.Op.like]: `%${search}%` };
    }

    const menuItems = await models.Menu.findAndCountAll({
      where: whereCondition,
      include: [{
        model: models.Category,
        attributes: ['id', 'name', 'description']
      }],
      limit: queryLimit,
      offset,
      order: [['name', 'ASC']]
    });

    // Process image URLs for each menu item
    const processedMenus = menuItems.rows.map(item => {
      const itemData = item.toJSON();
      if (itemData.image && itemData.image.startsWith('/api/')) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        itemData.image = baseUrl + itemData.image;
      }
      return itemData;
    });

    res.status(200).json(
      formatResponse(true, 'Menu items retrieved successfully', {
        menus: processedMenus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: menuItems.count,
          pages: Math.ceil(menuItems.count / limit)
        }
      })
    );
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching menu items')
    );
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await models.Menu.findByPk(req.params.id, {
      include: [{
        model: models.Category,
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!menuItem) {
      return res.status(404).json(
        formatResponse(false, 'Menu item not found')
      );
    }

    res.status(200).json(
      formatResponse(true, 'Menu item retrieved successfully', { menuItem })
    );
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching menu item')
    );
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json(
        formatResponse(false, 'Category name is required')
      );
    }
    
    const category = await models.Category.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      image
    });

    res.status(201).json(
      formatResponse(true, 'Category created successfully', { category })
    );
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(
        formatResponse(false, 'Category with this name already exists')
      );
    }
    
    res.status(500).json(
      formatResponse(false, error.message || 'Server error while creating category')
    );
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, image, isAvailable = true } = req.body;
    
    if (!name || !price || !categoryId) {
      return res.status(400).json(
        formatResponse(false, 'Name, price, and category are required')
      );
    }

    // Validate category exists
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json(
        formatResponse(false, 'Invalid category selected')
      );
    }

    const menuItem = await models.Menu.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      image,
      isAvailable: Boolean(isAvailable)
    });

    // Fetch created item with category info
    const createdItem = await models.Menu.findByPk(menuItem.id, {
      include: [models.Category]
    });

    res.status(201).json(
      formatResponse(true, 'Menu item created successfully', { menuItem: createdItem })
    );
  } catch (error) {
    console.error('Create menu item error:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json(
        formatResponse(false, `Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      );
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(
        formatResponse(false, 'Menu item with this name already exists')
      );
    }
    
    res.status(500).json(
      formatResponse(false, error.message || 'Server error while creating menu item')
    );
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, image, isAvailable } = req.body;
    
    // Validate required fields
    if (!name || !price || !categoryId) {
      return res.status(400).json(
        formatResponse(false, 'Name, price, and category are required')
      );
    }

    const menuItem = await models.Menu.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json(
        formatResponse(false, 'Menu item not found')
      );
    }

    // Validate category exists
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json(
        formatResponse(false, 'Invalid category selected')
      );
    }

    // Prepare update data with proper type conversion
    const updateData = {
      name: name.trim(),
      description: description ? description.trim() : null,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : menuItem.isAvailable
    };

    // Only update image if provided
    if (image) {
      updateData.image = image;
    }

    await menuItem.update(updateData);

    // Fetch updated item with category info
    const updatedItem = await models.Menu.findByPk(req.params.id, {
      include: [models.Category]
    });

    res.status(200).json(
      formatResponse(true, 'Menu item updated successfully', { menuItem: updatedItem })
    );
  } catch (error) {
    console.error('Update menu item error:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json(
        formatResponse(false, `Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      );
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json(
        formatResponse(false, 'Invalid category reference')
      );
    }
    
    res.status(500).json(
      formatResponse(false, error.message || 'Server error while updating menu item')
    );
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await models.Menu.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json(
        formatResponse(false, 'Menu item not found')
      );
    }

    // Check if item is referenced in any orders
    const orderItems = await models.OrderItem.findOne({
      where: { menuItemId: req.params.id }
    });
    
    if (orderItems) {
      // Soft delete by marking as unavailable instead of hard delete
      await menuItem.update({ isAvailable: false });
      return res.status(200).json(
        formatResponse(true, 'Menu item marked as unavailable (has order history)')
      );
    }

    await menuItem.destroy();

    res.status(200).json(
      formatResponse(true, 'Menu item deleted successfully')
    );
  } catch (error) {
    console.error('Delete menu item error:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json(
        formatResponse(false, 'Cannot delete menu item - it is referenced in orders')
      );
    }
    
    res.status(500).json(
      formatResponse(false, error.message || 'Server error while deleting menu item')
    );
  }
};

export const getCategoriesWithMenus = async (req, res) => {
  try {
    const { includeUnavailable = false } = req.query;
    
    const menuWhereCondition = includeUnavailable === 'true' ? {} : { isAvailable: true };
    
    const categories = await models.Category.findAll({
      where: { isActive: true },
      include: [{
        model: models.Menu,
        where: menuWhereCondition,
        required: false,
        attributes: ['id', 'name', 'description', 'price', 'image', 'isAvailable', 'preparationTime']
      }],
      order: [
        ['name', 'ASC'],
        [models.Menu, 'name', 'ASC']
      ]
    });

    // Process image URLs for each menu item in categories
    const processedCategories = categories.map(category => {
      const categoryData = category.toJSON();
      if (categoryData.Menus) {
        categoryData.Menus = categoryData.Menus.map(item => {
          if (item.image && item.image.startsWith('/api/')) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            item.image = baseUrl + item.image;
          }
          return item;
        });
      }
      return categoryData;
    });

    res.status(200).json(
      formatResponse(true, 'Categories with menus retrieved successfully', { categories: processedCategories })
    );
  } catch (error) {
    console.error('Get categories with menus error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching categories with menus')
    );
  }
};