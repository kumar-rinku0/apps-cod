import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import { exportUsersToCSV } from "../controller/export.js";

const exportRoute = Router();

exportRoute.get("/users/csv", wrapAsync(exportUsersToCSV));

export default exportRoute;