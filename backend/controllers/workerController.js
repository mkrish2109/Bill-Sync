const Worker = require("../models/Worker");

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

module.exports={
    getallWorkers
}