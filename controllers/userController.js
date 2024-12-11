import prisma from '../DB/db.config.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({})
    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User not found' })
    }

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    console.log('error:', error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const parsedId = parseInt(id)

    if (isNaN(parsedId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: parsedId },
    })

    if (!existingUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User not found' })
    }

    const updatedData = { ...req.body }

    // Check if there's a file uploaded
    if (req.file) {
      const imageInfo = formatImage(req.file)
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(imageInfo)
      updatedData.image = cloudinaryResponse.secure_url
      updatedData.imagePublicId = cloudinaryResponse.public_id
    } else {
      // If no new image is uploaded, retain the existing image URL
      updatedData.image = existingUser.image
      updatedData.imagePublicId = existingUser.imagePublicId
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedId },
      data: updatedData,
    })

    // Delete previous image from Cloudinary if a new one was uploaded
    if (req.file && existingUser.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingUser.imagePublicId)
    }

    res.status(StatusCodes.OK).json({ msg: 'User modified', updatedUser })
  } catch (error) {
    console.log('error:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}
