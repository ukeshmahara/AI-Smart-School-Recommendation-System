import { z } from "zod";

export const AddFavoriteDTO = z.object({
    schoolId: z.string().min(1, "School id is required"),
});
export type AddFavoriteDTO = z.infer<typeof AddFavoriteDTO>;
