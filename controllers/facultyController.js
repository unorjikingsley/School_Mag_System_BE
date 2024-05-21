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

export const getAllFaculty = async (req, res) => {
  console.log(req)
}
