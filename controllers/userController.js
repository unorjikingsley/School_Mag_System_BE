import prisma from '../DB/db.config.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

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
      updatedData.imagePublicId = existingEvent.imagePublicId
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedId },
      data: updatedData,
    })

    // Delete previous image from Cloudinary if a new one was uploaded
    if (req.file && existingUser.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingUser.imagePublicId)
    }

    res.status(StatusCodes.OK).json({ msg: 'Event modified', updatedUser })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

export const assignDeanRole = async (req, res) => {
  try {
    const { email, facultyId } = req.body;

    // Find the super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'Super_admin' },
    });

    if (!superAdmin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'No super admin found' });
    }

    // Check if the logged-in user is the super admin
    if (req.user.id !== superAdmin.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'Only the super admin can assign dean roles' });
    }

    // Check if the provided email belongs to an existing user
    const deanCandidate = await prisma.user.findFirst({
      where: { email },
    });

    if (!deanCandidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User with provided email not found' });
    }

    // Check if the user already has a role
    if (deanCandidate.role !== null) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'User already has a role assigned' });
    }

    // Assign the role of Dean to the user
    const updatedUser = await prisma.user.update({
      where: { id: deanCandidate.id },
      data: { role: 'Dean' },
    });

    // Optionally, assign the dean to a specific faculty
    await prisma.dean.create({
      data: {
        userId: updatedUser.id,
        facultyId,
      },
    });

    res.status(StatusCodes.OK).json({ msg: 'Dean role assigned successfully' });
  } catch (error) {
    console.error('Error assigning dean role:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
};
