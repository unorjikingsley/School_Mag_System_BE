// export updateUser = async (req, res) => {
//   try {
//     const { id } = req.params
//     const parsedId = parseInt(id)

//     const existingUser = await prisma.user.findUnique({
//       where: { id: parsedId },
//     })

//     if (!existingUser) {
//       return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })
//     }

//     const updatedData = { ...req.body }

//     delete updatedData.id

//     const updatedUser = await prisma.user.update({
//       where: { id: parsedId },
//       data: updatedData,
//     })

//     res.status(StatusCodes.OK).json({ user: updatedUser })
//   } catch (error) {
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: 'Internal Server Error' })
//   }
// }
