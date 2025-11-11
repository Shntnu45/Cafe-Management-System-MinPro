import { models } from '../models/index.js';
import { generateToken, formatResponse } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(
        formatResponse(false, 'User already exists with this email')
      );
    }

   
    const userRole = role === 'user' ? 'customer' : (role || 'customer');

    const user = await models.User.create({
      name,
      email,
      password,
      phone,
      role: userRole
    });

    const token = generateToken(user.id);

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(201).json(
      formatResponse(true, 'User registered successfully', {
        user: userResponse,
        token
      })
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error during registration')
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await models.User.findOne({ 
      where: { email }
    });

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json(
        formatResponse(false, 'Invalid email or password')
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        formatResponse(false, 'Account is deactivated. Please contact administrator.')
      );
    }

    if (role && role !== user.role) {
      let errorMessage;
      if (role === 'admin' && user.role === 'customer') {
        errorMessage = 'Not authorized to access admin role';
      } else if (role === 'user' && user.role === 'admin') {
        errorMessage = 'Not authorized to access user section';
      } else {
        errorMessage = `Access denied for ${role} role`;
      }
      
      return res.status(403).json(
        formatResponse(false, errorMessage)
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user.id);

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(200).json(
      formatResponse(true, 'Login successful', {
        user: userResponse,
        token
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error during login')
    );
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(
      formatResponse(true, 'User data retrieved successfully', { user })
    );
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while fetching user data')
    );
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await models.User.findByPk(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(200).json(
      formatResponse(true, 'Profile updated successfully', { user: userResponse })
    );
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error while updating profile')
    );
  }
};

export const verifyRole = async (req, res) => {
  try {
    const { requiredRole } = req.body;
    const userRole = req.user.role;
    
    const backendRole = requiredRole === 'user' ? 'customer' : requiredRole;
    
    if (userRole !== backendRole) {
      let errorMessage;
      if (backendRole === 'admin' && userRole === 'customer') {
        errorMessage = 'Not authorized to access admin role';
      } else if (backendRole === 'customer' && userRole === 'admin') {
        errorMessage = 'Not authorized to access user section';
      } else {
        errorMessage = `Access denied for ${requiredRole} role`;
      }
      
      return res.status(403).json(
        formatResponse(false, errorMessage)
      );
    }
    
    res.status(200).json(
      formatResponse(true, 'Role verification successful', { role: userRole })
    );
  } catch (error) {
    console.error('Role verification error:', error);
    res.status(500).json(
      formatResponse(false, 'Server error during role verification')
    );
  }
};