import FabricAssignment from "../models/FabricAssignment";

export const fabricAssignment =  async (req, res) => {
  const { fabricId, workerId } = req.body;

  // Ensure buyer is assigning the worker
  const buyer = await User.findById(req.user.id);
  if (buyer.role !== 'buyer') {
    return res.status(403).json({ message: 'Only buyers can assign workers' });
  }

  try {
    // Check if worker is valid
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({ message: 'Invalid worker selected' });
    }

    // Create fabric assignment
    const newAssignment = new FabricAssignment({
      fabricId,
      buyerId: buyer._id,
      workerId: worker._id,
    });

    await newAssignment.save();
    res.json({ message: 'Worker assigned successfully', assignment: newAssignment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
} 