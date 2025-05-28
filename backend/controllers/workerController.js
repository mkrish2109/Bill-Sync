const Worker = require("../models/Worker");
const Buyer = require('../models/Buyer');
const Request = require('../models/Request');

const getallWorkers = async (req, res)=>{
    try {
        const workers = await Worker.find();
        res.status(200).json({
            success: true,
            data: workers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get all received requests for a worker
const getReceivedRequests = async (req, res) => {
    try {
        const workerId  = req.user.userId;
        const requests = await Request.find({
            receiver: workerId,
            receiverModel: 'Worker'
        })
        .populate('sender', 'name contact')
        .sort({ createdAt: -1 });

        if (requests.length === 0) {
            return res.status(200).json({ message: 'No requests found' });
        }

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

// Accept a request from a buyer
const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const workerId = req.user.userId;

        const request = await Request.findOne({
            _id: requestId,
            receiver: workerId,
            receiverModel: 'Worker'
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been handled' });
        }

        request.status = status;
        await request.save();

        res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (error) {
        res.status(500).json({ message: 'Error handling request', error: error.message });
    }
};
const handleRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const workerId = req.user.userId;
  
      const request = await Request.findOne({
        _id: requestId,
        receiver: workerId,
        receiverModel: 'Worker'
      });
  
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request has already been handled' });
      }
  
      request.status = status;
      await request.save();
  
      res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (error) {
      res.status(500).json({ message: 'Error handling request', error: error.message });
    }
  };

// Reject a request from a buyer
const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const workerId = req.user.userId;

        const request = await Request.findOne({
            _id: requestId,
            receiver: workerId,
            receiverModel: 'Worker'
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been handled' });
        }

        request.status = status;
        await request.save();

        res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (error) {
        res.status(500).json({ message: 'Error handling request', error: error.message });
    }
};

// Get all buyers
const getAllBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find()
            .select('name contact company')
            .sort({ createdAt: -1 });
        res.status(200).json(buyers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching buyers', error: error.message });
    }
};

// Send request to buyer
const sendRequestToBuyer = async (req, res) => {
    try {
        const { buyerId, message } = req.body;
        const workerId = req.user.userId; // Assuming you have authentication middleware

        // Check if worker exists
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Check if buyer exists
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Create new request
        const request = new Request({
            sender: workerId,
            senderModel: 'Worker',
            receiver: buyerId,
            receiverModel: 'Buyer',
            message
        });

        await request.save();

        // Update worker and buyer with request reference
        worker.sentRequests.push(request._id);
        buyer.receivedRequests.push(request._id);
        await worker.save();
        await buyer.save();

        res.status(201).json({ message: 'Request sent successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Error sending request', error: error.message });
    }
};

// Get all sent requests
const getSentRequests = async (req, res) => {
    try {
        const workerId = req.user.userId; // Assuming you have authentication middleware
        const requests = await Request.find({
            sender: workerId,
            senderModel: 'Worker'
        })
        .populate('receiver', 'name contact')
        .sort({ createdAt: -1 });
        
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

module.exports={
    getallWorkers,
    getReceivedRequests,
    acceptRequest,
    rejectRequest,
    getAllBuyers,
    sendRequestToBuyer,
    getSentRequests,
    handleRequest
}