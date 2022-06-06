import express, {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {collections} from "../services/db-helper";

export const CategoryRouter = express.Router();

CategoryRouter.get("/", async (req: Request, res: Response) => {
    getCategories(req, res);
});

CategoryRouter.get("/:id", async (req: Request, res: Response) => {
    getOneCategory(req, res);
});

CategoryRouter.post("/", async (req: Request, res: Response) => {
    insertCategory(req, res);
});

CategoryRouter.put("/:id", async (req: Request, res: Response) => {
    updateCategory(req, res);
});

CategoryRouter.delete("/:id", async (req: Request, res: Response) => {
    deleteCategory(req, res);
});

async function getCategories(req: Request, res: Response) {
    try {
        const categories = (await collections.category?.find({}).toArray());
        res.status(200).send(categories);
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).send({msg: "Internal server error: failed to fetch wine category data"});
    }
}

async function getOneCategory(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
        const query = {_id: new ObjectId(id)};
        const wine = await collections.category?.findOne({query});
        if (wine) {
            res.status(200).send(wine);   
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(404).send({msg: `Wine category with ${id} not found`});
    }
}

async function insertCategory(req: Request, res: Response) {
    const newCategory = req.body;
    try {
        const result = await collections.category?.insertOne(newCategory);

        if (result) {
            res.status(200).send({msg: "Successfully inserted a new wine category", id: result.insertedId});
        } else {
            res.status(500).send({msg: "Failed to insert a new wine category"});
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(400).send({msg: "Bad request to create a new wine category"});
    }
}

async function updateCategory(req: Request, res: Response) {
    const id = req?.params?.id;
    const updatedCategory = req.body;
    try {
        const query = {_id: new ObjectId(id)};
        const result = await collections.category?.updateOne(query, {
            $set: updatedCategory
        });

        if (result) {
            res.status(200).send({msg: `Successfully updated a wine category with id ${id}`});
        } else {
            res.status(304).send({msg: `Failed to update a wine category with id ${id}`});
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(400).send({msg: "Bad request to create a new wine category"});
    }
}

async function deleteCategory(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
        const query = {_id: new ObjectId(id)};
        const result = await collections.category?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully deleted a wine category with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to delete a wine category with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Wine category with id ${id} doesn't exist`);
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).send({msg: "Internal server error: failed to fetch wine category data"});
    }
}