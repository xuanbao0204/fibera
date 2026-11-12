import { BaseEntity } from "../base-entity";
import { ModerationStatus, PostType } from "./type";

export interface Post extends BaseEntity {
    authorId: string;
    type: PostType;

    title: string;
    content: string;

    moderationStatus: ModerationStatus;
    publishedAt?: string | null;
}