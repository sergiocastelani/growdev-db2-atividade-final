import { Like } from "../../models/like";

export class LikeDAO_Prisma {
    getById(id: number) : Like {
        return new Like(0,0);
    }
}