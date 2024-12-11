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
