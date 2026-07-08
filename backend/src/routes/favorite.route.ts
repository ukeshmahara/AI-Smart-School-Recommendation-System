import { Router } from "express";
import { FavoriteController } from "../controllers/favorite.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

favoriteRouter.use(authorizedMiddleware);

favoriteRouter.get("/", favoriteController.getFavorites);
favoriteRouter.post("/", favoriteController.addFavorite);
favoriteRouter.delete("/:schoolId", favoriteController.removeFavorite);

export default favoriteRouter;