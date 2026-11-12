import { BaseEntity } from "../base-entity";
import { ModerationStatus } from "./type";

export interface Comment extends BaseEntity {
    postId: string;
    authorId: string;

    parentId?: string | null;
    content: string;

    moderationStatus: ModerationStatus;
}