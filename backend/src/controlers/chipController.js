import Chip from "../models/chipModel.js";

// CRUD operations
export async function createChip(req, res) {
    try {
        const {roomId, position, color, shape} = req.body

        const chip = new Chip({
            roomId,
            position,
            color,
            shape,
        })

        await chip.save()

        res.status(201).json({message: "Chip created"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to create chip"})
    }
}

export async function getChips(req, res) {
    try {
        const {roomId} = req.params;

        if (!roomId) {
            return res.status(400).json({message: "roomId is required"});
        }

        const chips = await Chip.find({roomId});

        return res.status(200).json(chips);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to fetch chips"});
    }
}

export async function moveChip(req, res) {
    try {
        const chipId = req.params.chipId
        const {x, y} = req.body.position

        if(!x || !y) {
            return res.status(400).json({message: "x and y are required"});
        }

        const chip = await Chip.findByIdAndUpdate(
            chipId,
            {position: {x, y}},
            {new: true}
        )

        if(!chip) {
            return res.status(404).json({message: "Chip not found"});
        }

        return res.status(200).json(chip)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to move chip"})
    }
}

export async function deleteChip(req, res) {
    try {
        const chipId = req.params.chipId
        const deletedChip = await Chip.findByIdAndDelete(chipId)

        if (!deletedChip) {
            return res.status(400).json({message: "Chip not found"})
        }

        return res.status(200).json({message: `Chip with id ${chipId} was deleted successfully`})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete chip"})
    }
}