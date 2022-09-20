import { ImageFormat, KnownMedia, Media, UserImage } from '@prisma/client';

// TODO: complete GetMediaResponseType from prisma client

export type GetMediaResponeType = Promise<(Media & {
    image: MediaImage & {
        image: {
            format: ImageFormat;
        };
    };
    knownBy: (KnownMedia & {
        user: {
            id: number;
            image: UserImage & {
                ...;
            };
            alias: string;
        };
    })[];
})[]>

