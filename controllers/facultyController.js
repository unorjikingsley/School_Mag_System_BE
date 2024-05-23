import { StatusCodes } from 'http-status-codes'
import prisma from '../DB/db.config.js'

export const createFaculty = async (req, res) => {
  try {
    const { name, facultyNo } = req.body
    // console.log('faculty:', faculty);

    if (!name || !facultyNo) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const facultyNoInt = parseInt(facultyNo, 10)

    const facultyName = await prisma.faculty.create({
      data: {
        name,
        facultyNo: facultyNoInt
      },
    })

    res.status(StatusCodes.CREATED).json({ facultyName })
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await prisma.faculty.findMany({})
    res.status(StatusCodes.OK).json({ faculties })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: parseInt(req.params.id) },
    })

    if (!faculty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Faculty not found' })
    }
    res.status(StatusCodes.OK).json({ faculty })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' })
    }

    const existingFaculty = await prisma.faculty.findUnique({
      where: { id: parsedId },
    })

    if (!existingFaculty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Events not found' })
    }

    const updatedData = { ...req.body }

    const updatedFaculty = await prisma.faculty.update({
      where: { id: parsedId },
      data: updatedData,
    })

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Faculty modified', faculty: updatedFaculty })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}
