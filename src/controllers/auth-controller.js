const { StatusCodes } = require('http-status-codes');
const User = require('../models/user-model');
const customError = require('../errors');
const utils = require('../utils');

/**
 * Register user
 * @route POST /api/v1/auth/register
 * @access public
 */
const register = async (req, res) => {
  // 1. simple check for valid input
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password) {
    throw new customError.BadRequestError(
      'Please provide your information (Name, Email and Password)'
    );
  } else if (!passwordConfirm) {
    throw new customError.BadRequestError('Please confirm your Password');
  }

  // 2. check for password confirmation
  if (passwordConfirm !== password) {
    throw new customError.BadRequestError(
      'Password confirmation does not match, try again.'
    );
  }

  // 3. create new account
  const user = await User.create({ name, email, password, role: 'admin' });

  // 4. send token to client
  const payload = utils.createUserTokenPayload(user);
  const token = utils.createToken(payload);
  utils.attachCookiesToResponse(res, token);

  user.password = undefined;
  res.status(StatusCodes.CREATED).json({ status: 'success', user });
};

/**
 * Log in user
 * @route POST /api/v1/auth/login
 * @access public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. simple check for valid input
  if (!email || !password) {
    throw new customError.BadRequestError('Please provide Email and Password');
  }

  // 2. check if user exists (valid email) and password is correct
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new customError.UnauthenticatedError('Incorrect Email or Password');
  }

  // 3. if everything ok, send token to client
  const payload = utils.createUserTokenPayload(user);
  const token = utils.createToken(payload);
  utils.attachCookiesToResponse(res, token);

  user.password = undefined;
  res.status(StatusCodes.OK).json({ status: 'success', user });
};

/**
 * Log out user
 * @route GET /api/v1/auth/logout
 * @access public
 */
const logout = async (req, res) => {
  // send dummy cookie to client (expires right away)
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res
    .status(StatusCodes.OK)
    .json({ status: 'success', message: 'User logged out' });
};

module.exports = { register, login, logout };
