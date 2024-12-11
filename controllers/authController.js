import { StatusCodes } from "http-status-codes";
import prisma from "../DB/db.config.js";
import cloudinary from 'cloudinary';
import { formatImage } from "../middleware/multerMiddleware.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtil.js";

export const registerUser = async (req, res) => {
  try {
    const user = { ...req.body }

    const defaultImage =
      'https://res.cloudinary.com/dt3psf5ta/image/upload/v1715502383/xnxcbxzehmirgi2iwty3.png'
    const defaultImagePublicId = 'xnxcbxzehmirgi2iwty3'

    if (!req.file) {
      user.image = defaultImage;
      user.imagePublicId = defaultImagePublicId;
    } else {
      const imageInfo = formatImage(req.file)
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(imageInfo)

      user.image = cloudinaryResponse.secure_url
      user.imagePublicId = cloudinaryResponse.public_id
    }

    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'Super_admin' },
    })

    let requestedRole = req.body.role

    if (!existingSuperAdmin && requestedRole !== 'Super_admin') {
      // If no super admin exists yet and the requested role is not 'Super_admin',
      // assign the 'Super_admin' role to the first user
      requestedRole = 'Super_admin'
    }

    if (requestedRole !== 'Super_admin') {
      // If the requested role is not 'Super_admin', filter it out from available roles
      const availableRoles = [
        'Dean',
        'Head_Of_Department',
        'Lecturer',
        'Student',
      ]
      if (!availableRoles.includes(requestedRole)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Invalid role' })
      }
    }

    const hashedPassword = await hashPassword(req.body.password)
    req.body.password = hashedPassword

    const newUser = await prisma.user.create({
      data: {
        ...user,
        role: requestedRole,
        image: user.image,
        password: hashedPassword
      },
    })

    res.status(StatusCodes.CREATED).json({ msg: newUser })
  } catch (error) {
    console.log('error:', error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email}
    })

    const isValidUser = user && (await comparePassword(req.body.password, user.password))

    if(!isValidUser) throw new UnauthenticatedError('Invalid credentials')

    const token = createJWT({ userId: user.id, role: user.role })

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
    })

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    console.log('Error:', error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
} 
