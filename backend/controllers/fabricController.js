import Fabric from "../models/Fabric";

export const getAllFabrics = async (req, res) => {
    try {
        const fabrics = await Fabric.find();
        res.json(fabrics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

export const getFabricById = async (req, res) => {
    const { fabricId } = req.params;
    try {
        const fabric = await Fabric.findById(fabricId);
        if (!fabric) {
            return res.status(404).json({ message: "Fabric not found" });
        }
        res.json(fabric);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

export const createFabric = async (req, res) => {
    const { name, description, unit,quantity,unitPrice,totalPrice,imageUrl } = req.body;
    try {
        const newFabric = new Fabric({
            name,
            description,
            unit,
            quantity,
            unitPrice,
            totalPrice,
            imageUrl,
        });
        await newFabric.save();
        res.status(201).json(newFabric);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

