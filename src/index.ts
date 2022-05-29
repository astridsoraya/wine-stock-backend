import express from "express";
import cors from "cors";
import {WineRouter} from "./routes/wine-router";
import {connectToDB} from "./services/db-helper";

const main = express();

main.use(cors({origin: true, maxAge: 3600}));
main.use(express.json());
main.use(express.urlencoded({extended: true}));

connectToDB().then(() => {
    main.use("/wine", WineRouter);
    
    const port = 3000;
    main.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
})