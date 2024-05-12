import { StatusCodes } from "http-status-codes";
import prisma from "../DB/db.config.js";
import cloudinary from 'cloudinary';
import { formatImage } from "../middleware/multerMiddleware.js";

export const registerUser = async (req, res) => {
  try {
    const user = { ...req.body }

    // console.log('Request body:', req.body)

    // Default image values
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

    const newUser = await prisma.user.create({
      data: {
        ...user,
        role: requestedRole,
        image: user.image,
      },
    })

    res.status(StatusCodes.CREATED).json({ msg: newUser })
  } catch (error) {
    // console.log('error:', error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

