const Request = require('../models/Request');
const Worker = require('../models/Worker');
const Buyer = require('../models/Buyer');
const { sendErrorResponse, sendSuccessResponse, sendDataResponse } = require('../utils/serverUtils');

// Send request from buyer to worker
exports.sendRequest = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const io = req.app.get('io');
    
    // Verify sender is a buyer and receiver is a worker
    const [sender, receiver] = await Promise.all([
      Buyer.findById(senderId),
      Worker.findById(receiverId)
    ]);
    
    if (!sender) {
      return sendErrorResponse(res, 'Only buyers can send requests to workers', 400);
    }
    
    if (!receiver) {
      return sendErrorResponse(res, 'Worker not found', 404);
    }
    
    // Check for existing pending/accepted request
    const existingRequest = await Request.findOne({
      sender: senderId,
      receiver: receiverId,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingRequest) {
      return sendErrorResponse(res, 
        existingRequest.status === 'accepted' 
          ? 'You already have an established connection with this worker' 
          : 'Request already sent and pending',
        400
      );
    }
    
    // Create new request
    const newRequest = new Request({
      sender: senderId,
      senderModel: 'Buyer',
      receiver: receiverId,
      receiverModel: 'Worker',
      message,
      status: 'pending'
    });
    
    await newRequest.save();
    
    // Update both users' request arrays
    await Promise.all([
      Buyer.findByIdAndUpdate(senderId, {
        $push: { sentRequests: newRequest._id }
      }),
      Worker.findByIdAndUpdate(receiverId, {
        $push: { receivedRequests: newRequest._id }
      })
    ]);

    // Emit new request event to receiver
    io.to(receiverId.toString()).emit('newRequest', {
      request: newRequest,
      sender: sender
    });
    
    sendDataResponse(res, newRequest, 201);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Accept request (worker accepting buyer's request)
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const io = req.app.get('io');
    
    // First find the worker by userId
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return sendErrorResponse(res, 'Only workers can accept requests', 403);
    }
    
    const request = await Request.findById(requestId)
      .populate('sender', 'name contact')
      .populate('receiver', 'name contact');
    
    if (!request) {
      return sendErrorResponse(res, 'Request not found', 404);
    }
    
    // Verify the request is from a buyer to this worker
    if (request.receiver._id.toString() !== worker._id.toString()) {
      return sendErrorResponse(res, 'Not authorized to accept this request', 403);
    }
    
    if (request.status !== 'pending') {
      return sendErrorResponse(res, `Request has already been ${request.status}`, 400);
    }
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    // Establish connection between buyer and worker
    await Promise.all([
      Buyer.findByIdAndUpdate(request.sender, {
        $addToSet: { connectedWorkers: request.receiver._id }
      }),
      Worker.findByIdAndUpdate(request.receiver._id, {
        $addToSet: { connectedBuyers: request.sender }
      })
    ]);

    // Emit request accepted event to sender
    io.to(request.sender.toString()).emit('requestAccepted', {
      request,
      worker: request.receiver
    });
    
    sendDataResponse(res, {
      request,
      buyer: request.sender,
      worker: request.receiver
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const io = req.app.get('io');
    
    // First find the worker by userId
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return sendErrorResponse(res, 'Only workers can reject requests', 403);
    }
    
    const request = await Request.findById(requestId)
      .populate('sender', 'name contact');
    
    if (!request) {
      return sendErrorResponse(res, 'Request not found', 404);
    }
    
    // Verify the request is from a buyer to this worker
    if (request.receiver._id.toString() !== worker._id.toString()) {
      return sendErrorResponse(res, 'Not authorized to reject this request', 403);
    }
    
    if (request.status !== 'pending') {
      return sendErrorResponse(res, `Cannot reject a request that is ${request.status}`, 400);
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();

    // Emit request rejected event to sender
    io.to(request.sender.toString()).emit('requestRejected', {
      request,
      worker: worker
    });
    
    sendDataResponse(res, { request });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Get user's requests
exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user is a worker or buyer
    const [worker, buyer] = await Promise.all([
      Worker.findOne({ userId }),
      Buyer.findOne({ userId })
    ]);
    
    if (!worker && !buyer) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    
    const userType = worker ? 'Worker' : 'Buyer';
    const userModel = worker || buyer;
    
    // Get requests where user is sender or receiver
    const [sentRequests, receivedRequests] = await Promise.all([
      Request.find({
        _id: { $in: userModel.sentRequests }
      }).populate('sender receiver', 'name contact'),
      Request.find({
        _id: { $in: userModel.receivedRequests }
      }).populate('sender receiver', 'name contact')
    ]);
    
    sendDataResponse(res, {
      userType,
      sentRequests,
      receivedRequests,
      connections: userType === 'Worker' 
        ? await Worker.findById(userModel._id).populate('connectedBuyers', 'name contact')
        : await Buyer.findById(userModel._id).populate('connectedWorkers', 'name contact')
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Get connected users
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user is a worker or buyer
    const [worker, buyer] = await Promise.all([
      Worker.findOne({ userId }).populate('connectedBuyers', 'name contact'),
      Buyer.findOne({ userId }).populate('connectedWorkers', 'name contact')
    ]);
    
    if (!worker && !buyer) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      connections: worker ? worker.connectedBuyers : buyer.connectedWorkers,
      userType: worker ? 'Worker' : 'Buyer'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get connected users with details
exports.getConnectedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user is a worker or buyer
    const [worker, buyer] = await Promise.all([
      Worker.findOne({ userId })
        .populate('connectedBuyers', 'name contact company')
        .populate('receivedRequests', 'status message'),
      Buyer.findOne({ userId })
        .populate('connectedWorkers', 'name contact experience skills')
        .populate('sentRequests', 'status message')
    ]);
    
    if (!worker && !buyer) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    
    const userType = worker ? 'Worker' : 'Buyer';
    const userModel = worker || buyer;
    
    // Get connected users based on role
    const connectedUsers = userType === 'Worker' 
      ? userModel.connectedBuyers
      : userModel.connectedWorkers;
    
    // Get request history for each connection
    const connectionsWithHistory = await Promise.all(
      connectedUsers.map(async (user) => {
        // Find requests between the current user and the connected user
        const requests = await Request.find({
          $or: [
            // Requests where current user is sender and connected user is receiver
            {
              sender: userModel._id,
              receiver: user._id
            },
            // Requests where current user is receiver and connected user is sender
            {
              sender: user._id,
              receiver: userModel._id
            }
          ]
        })
        .sort({ createdAt: -1 })
        .populate('sender receiver', 'name contact');
        
        return {
          user,
          requestHistory: requests
        };
      })
    );
    
    sendDataResponse(res, {
      userType,
      connections: connectionsWithHistory
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};