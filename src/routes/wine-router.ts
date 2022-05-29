import express, {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {collections} from "../services/db-helper";

export const WineRouter = express.Router();

WineRouter.get("/", async (req: Request, res: Response) => {
    getWines(req, res);
});

WineRouter.get("/:id", async (req: Request, res: Response) => {
    getOneWine(req, res);
});

WineRouter.post("/", async (req: Request, res: Response) => {
    insertWine(req, res);
});

WineRouter.put("/:id", async (req: Request, res: Response) => {
    updateWine(req, res);
});

WineRouter.delete("/:id", async (req: Request, res: Response) => {
    deleteWine(req, res);
});

async function getWines(req: Request, res: Response) {
    try {
        const wines = (await collections.wine?.find({}).toArray());
        res.status(200).send(wines);
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).send({msg: "Internal server error: failed to fetch wine data"});
    }
}

async function getOneWine(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
        const query = {_id: new ObjectId(id)};
        const wine = await collections.wine?.findOne({query});
        if (wine) {
            res.status(200).send(wine);   
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(404).send({msg: `Wine with ${id} not found`});
    }
}

async function insertWine(req: Request, res: Response) {
    const newWine = req.body;
    try {
        const result = await collections.wine?.insertOne(newWine);

        if (result) {
            res.status(200).send({msg: "Successfully inserted a new wine", id: result.insertedId});
        } else {
            res.status(500).send({msg: "Failed to insert a new wine"});
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(400).send({msg: "Bad request to create a new wine"});
    }
}

async function updateWine(req: Request, res: Response) {
    const id = req?.params?.id;
    const updatedWine = req.body;
    try {
        const query = {_id: new ObjectId(id)};
        const result = await collections.wine?.updateOne(query, {
            $set: updatedWine
        });

        if (result) {
            res.status(200).send({msg: `Successfully updated a wine with id ${id}`});
        } else {
            res.status(304).send({msg: `Failed to update a wine with id ${id}`});
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(400).send({msg: "Bad request to create a new wine"});
    }
}

async function deleteWine(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
        const query = {_id: new ObjectId(id)};
        const result = await collections.wine?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully deleted a wine with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to delete a wine with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Wine with id ${id} doesn't exist`);
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).send({msg: "Internal server error: failed to fetch wine data"});
    }
}