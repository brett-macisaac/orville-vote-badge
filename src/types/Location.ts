import { z } from "zod";

const zodLocation = z.object(
    {
        x: z.number(),
        y: z.number()
    }
);

export type Location = z.infer<typeof zodLocation>;

export function isLocation(pData : unknown) : pData is Location
{
    return zodLocation.safeParse(pData).success;
}