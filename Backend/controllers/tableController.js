import { models } from '../models/index.js';
import { formatResponse } from '../utils/helpers.js';

export const getTables = async (req, res) => {
  try {
    const tables = await models.Table.findAll({
      include: [{
        model: models.User,
        as: 'occupiedByUser',
        attributes: ['id', 'name', 'email']
      }],
      order: [['tableNumber', 'ASC']]
    });

    res.status(200).json(
      formatResponse(true, 'Tables retrieved successfully', { tables })
    );
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching tables')
    );
  }
};

export const getAvailableTables = async (req, res) => {
  try {
    const tables = await models.Table.findAll({
      where: { status: 'available' },
      order: [['tableNumber', 'ASC']]
    });

    res.status(200).json(
      formatResponse(true, 'Available tables retrieved successfully', { tables })
    );
  } catch (error) {
    console.error('Get available tables error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching available tables')
    );
  }
};

export const occupyTable = async (req, res) => {
  try {
    const { tableId } = req.body;
    const table = await models.Table.findByPk(tableId);

    if (!table) {
      return res.status(404).json(
        formatResponse(false, 'Table not found')
      );
    }

    if (table.status !== 'available') {
      return res.status(400).json(
        formatResponse(false, 'Table is not available')
      );
    }

    table.status = 'occupied';
    table.occupiedBy = req.user.id;
    await table.save();

    res.status(200).json(
      formatResponse(true, 'Table occupied successfully', { table })
    );
  } catch (error) {
    console.error('Occupy table error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while occupying table')
    );
  }
};

export const releaseTable = async (req, res) => {
  try {
    const table = await models.Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json(
        formatResponse(false, 'Table not found')
      );
    }

    table.status = 'available';
    table.occupiedBy = null;
    await table.save();

    res.status(200).json(
      formatResponse(true, 'Table released successfully', { table })
    );
  } catch (error) {
    console.error('Release table error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while releasing table')
    );
  }
};

export const createTable = async (req, res) => {
  try {
    const table = await models.Table.create(req.body);

    res.status(201).json(
      formatResponse(true, 'Table created successfully', { table })
    );
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while creating table')
    );
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await models.Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json(
        formatResponse(false, 'Table not found')
      );
    }

    await table.update(req.body);

    res.status(200).json(
      formatResponse(true, 'Table updated successfully', { table })
    );
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating table')
    );
  }
};

export const occupyTableById = async (req, res) => {
  try {
    console.log('Occupy table request:', req.params.id, req.body);
    const { occupiedBy, customerName, status } = req.body;
    const table = await models.Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json(
        formatResponse(false, 'Table not found')
      );
    }

    if (table.status !== 'available') {
      return res.status(400).json(
        formatResponse(false, 'Table is not available')
      );
    }

    const updateData = {
      status: status || 'occupied',
      occupiedBy: req.user.id,
      notes: customerName ? `Customer: ${customerName}` : 'Occupied'
    };
    
    console.log('Updating table with:', updateData);
    await table.update(updateData);

    res.status(200).json(
      formatResponse(true, 'Table occupied successfully', { table })
    );
  } catch (error) {
    console.error('Occupy table error:', error);
    console.error('Error details:', error.message);
    res.status(500).json(
      formatResponse(false, `Server error while occupying table: ${error.message}`)
    );
  }
};

export const releaseTableById = async (req, res) => {
  try {
    const table = await models.Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json(
        formatResponse(false, 'Table not found')
      );
    }

    await table.update({
      status: 'available',
      occupiedBy: null,
      notes: null
    });

    res.status(200).json(
      formatResponse(true, 'Table released successfully', { table })
    );
  } catch (error) {
    console.error('Release table error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while releasing table')
    );
  }
};