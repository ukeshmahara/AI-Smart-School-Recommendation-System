import { z } from "zod";
import { SchoolSchema } from "../types/school.type";

export const CreateSchoolDTO = SchoolSchema.pick({
    name: true,
    location: true,
    category: true,
    streamsOffered: true,
    fees: true,
});
export type CreateSchoolDTO = z.infer<typeof CreateSchoolDTO>;

export const UpdateSchoolDTO = SchoolSchema.partial();
export type UpdateSchoolDTO = z.infer<typeof UpdateSchoolDTO>;