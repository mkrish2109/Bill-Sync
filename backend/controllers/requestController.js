const Request = require('../models/Request');
const Worker = require('../models/Worker');
const Buyer = require('../models/Buyer');
const { sendErrorResponse, sendSuccessResponse, sendDataResponse } = require('../utils/serverUtils');
const { createNotification } = require('./notificationController');

// Send request from buyer to worker
exports.sendRequest = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const io = req.app.get('io');
    
    // Validate required fields
    if (!senderId || !receiverId) {
      return sendErrorResponse(res, 'Sender ID and receiver ID are required', 400);
    }
    
    if (!io) {
      console.error('Socket.io instance not found');
      return sendErrorResponse(res, 'Server error: Socket.io not initialized', 500);
    }
    
    // Verify sender is a buyer and receiver is a worker
    const [sender, receiver] = await Promise.all([
      Buyer.findById(senderId),
      Worker.findById(receiverId)
    ]);
    
    if (!sender) {
      return sendErrorResponse(res, 'Buyer not found', 404);
    }
    
    if (!receiver) {
      return sendErrorResponse(res, 'Worker not found', 404);
    }

    if (!receiver.userId) {
      console.error('Worker has no userId:', receiver);
      return sendErrorResponse(res, 'Invalid worker data', 400);
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

    // Get the worker's userId for socket room
    const workerRoomId = receiver.userId.toString();
    
    // Prepare the notification data
    const notificationData = {
      request: newRequest,
      senderName: sender.name,
      sender: sender,
      type: 'request',
      message: `New request from ${sender.name}`
    };

    // Store notification in database
    await createNotification(
      receiver.userId,
      'request',
      notificationData.message,
      notificationData
    );

    // Check if the worker's room exists
    const workerRoom = io.sockets.adapter.rooms.get(workerRoomId);
    if (!workerRoom) {
      console.warn(`Worker's room ${workerRoomId} not found. Worker might be offline.`);
    }
    
    // Emit the notification to the worker's room
    io.to(workerRoomId).emit('new_request', notificationData);
    
    sendDataResponse(res, newRequest, 201);
  } catch (error) {
    console.error('Error in sendRequest:', error);
    if (error.name === 'ValidationError') {
      return sendErrorResponse(res, `Invalid request data: ${error.message}`, 400);
    }
    sendErrorResponse(res, 'Failed to send request', 500);
  }
};

// Accept request (worker accepting buyer's request)
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const io = req.app.get('io');

    if (!requestId) {
      return sendErrorResponse(res, 'Request ID is required', 400);
    }
    
    // First find the worker by userId
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return sendErrorResponse(res, 'Worker not found', 404);
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

    // Get the buyer's and worker's userIds for socket rooms
    const [buyerDoc, workerDoc] = await Promise.all([
      Buyer.findById(request.sender),
      Worker.findById(request.receiver._id)
    ]);

    if (!buyerDoc || !workerDoc) {
      return sendErrorResponse(res, 'Failed to find user documents', 500);
    }

    // Create notification for buyer
    const buyerNotificationData = {
      request,
      status: 'accepted',
      workerName: worker.name,
      worker: request.receiver
    };

    // Store notification in database
    await createNotification(
      buyerDoc.userId,
      'status_update',
      `Your request was accepted by ${worker.name}`,
      buyerNotificationData
    );

    // Emit request status update to both sender and receiver
    io.to(buyerDoc.userId.toString()).emit('request_status_update', buyerNotificationData);
    
    io.to(workerDoc.userId.toString()).emit('request_status_update', {
      request,
      status: 'accepted',
      buyerName: request.sender.name,
      buyer: request.sender
    });
    
    sendDataResponse(res, {
      request,
      buyer: request.sender,
      worker: request.receiver
    });
  } catch (error) {
    console.error('Error in acceptRequest:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 'Invalid request ID', 400);
    }
    sendErrorResponse(res, 'Failed to accept request', 500);
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const io = req.app.get('io');

    if (!requestId) {
      return sendErrorResponse(res, 'Request ID is required', 400);
    }
    
    // First find the worker by userId
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return sendErrorResponse(res, 'Worker not found', 404);
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

    // Get the buyer's userId for socket room
    const buyerDoc = await Buyer.findById(request.sender);
    if (!buyerDoc) {
      return sendErrorResponse(res, 'Buyer not found', 404);
    }

    // Create notification for buyer
    const buyerNotificationData = {
      request,
      status: 'rejected',
      workerName: worker.name,
      worker: worker
    };

    // Store notification in database
    await createNotification(
      buyerDoc.userId,
      'status_update',
      `Your request was rejected by ${worker.name}`,
      buyerNotificationData
    );

    // Emit request status update to both sender and receiver
    io.to(buyerDoc.userId.toString()).emit('request_status_update', buyerNotificationData);
    
    io.to(worker.userId.toString()).emit('request_status_update', {
      request,
      status: 'rejected',
      buyerName: request.sender.name,
      buyer: request.sender
    });
    
    sendDataResponse(res, { request });
  } catch (error) {
    console.error('Error in rejectRequest:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 'Invalid request ID', 400);
    }
    sendErrorResponse(res, 'Failed to reject request', 500);
  }
};

// Get user's requests
exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!userId) {
      return sendErrorResponse(res, 'User ID is required', 400);
    }
    
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
    console.error('Error in getUserRequests:', error);
    sendErrorResponse(res, 'Failed to fetch user requests', 500);
  }
};

// Get connected users
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!userId) {
      return sendErrorResponse(res, 'User ID is required', 400);
    }
    
    // Check if user is a worker or buyer
    const [worker, buyer] = await Promise.all([
      Worker.findOne({ userId }).populate('connectedBuyers', 'name contact'),
      Buyer.findOne({ userId }).populate('connectedWorkers', 'name contact')
    ]);
    
    if (!worker && !buyer) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    
    sendDataResponse(res, {
      connections: worker ? worker.connectedBuyers : buyer.connectedWorkers,
      userType: worker ? 'Worker' : 'Buyer'
    });
  } catch (error) {
    console.error('Error in getConnections:', error);
    sendErrorResponse(res, 'Failed to fetch connections', 500);
  }
};

// Get connected users with details
exports.getConnectedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!userId) {
      return sendErrorResponse(res, 'User ID is required', 400);
    }
    
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
    console.error('Error in getConnectedUsers:', error);
    sendErrorResponse(res, 'Failed to fetch connected users', 500);
  }
};