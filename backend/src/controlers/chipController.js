import Chip from "../models/chipModel.js"
import Game from "../models/gameModel.js"
import {io} from "../server.js"

// CRUD operations
export async function createChip(req, res) {
    try {
        const {gameId} = req.params
        const {color, shape} = req.body
        const game = await Game.findOne({gameId})

        if (!game) return res.status(404).json({message: "Game not found"})

        const chip = new Chip({
            game: game._id,
            position: {x: 0, y: 0},
            color,
            shape,
        })

        await chip.save()

        io.to(game.gameId).emit("chip:created", chip)

        res.status(201).json(chip)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to create chips"})
    }
}

export async function getChips(req, res) {
    try {
        const {gameId} = req.params;

        if (!gameId) {
            return res.status(400).json({message: "gameId is required"});
        }

        const game = await Game.findOne({gameId})

        if (!game) {
            return res.status(400).json({message: "Game not found"});
        }

        const chips = await Chip.find({game: game._id});

        return res.status(200).json(chips);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to fetch chips"});
    }
}

export async function moveChip(req, res) {
    try {
        const chipId = req.params.chipId
        const {x, y} = req.body.position || {}

        if (typeof x !== "number" || typeof y !== "number") {
            return res.status(400).json({message: "x and y are required"});
        }

        const chip = await Chip.findByIdAndUpdate(
            chipId,
            {position: {x, y}},
            {new: true}
        )

        if (!chip) {
            return res.status(404).json({message: "Chip not found"});
        }

        const game = await Game.findById(chip.game)
        if (!game) {
            return res.status(404).json({message: "Game not found"})
        }
        io.to(game.gameId).emit("chip:moved", chip)

        return res.status(200).json(chip)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to move chips"})
    }
}

export async function deleteChip(req, res) {
    try {
        const {chipId} = req.params
        const deletedChip = await Chip.findByIdAndDelete(chipId)

        if (!deletedChip) {
            return res.status(400).json({message: "Chip not found"})
        }

        const gameId = deletedChip.game
        const game = await Game.findById(gameId)

        if (!game) {
            return res.status(404).json({message: "Game not found"})
        }

        io.to(gameId.toString()).emit("chip:deleted")

        return res.status(200).json({message: `Chip with id ${chipId} was deleted successfully`})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete 1 chip"})
    }
}

export async function deleteChipsByGame(req, res) {
    try {
        const {gameId} = req.params
        const game = await Game.findOne({gameId})

        if (!game) {
            return res.status(400).json({message: "Game not found"});
        }

        const result = await Chip.deleteMany({game: game._id})

        io.to(gameId).emit("chips:deleted")

        return res.status(200).json({
            message: `Chips for game ${gameId} deleted successfully`,
            deletedCount: result.deletedCount,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete all chips by game"})
    }
}