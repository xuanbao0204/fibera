export type PostType =
    | 'LISTING'
    | 'SEEKING';

export type ModerationStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'FLAGGED';

export type ModerationTargetType =
    | 'POST'
    | 'COMMENT';

export type ModerationVerdict =
    | 'SAFE'
    | 'WARNING'
    | 'VIOLATION';

export type ViolationCategory =
    | 'SPAM'
    | 'SCAM'
    | 'FRAUD'
    | 'MISLEADING_INFORMATION'
    | 'INAPPROPRIATE_CONTENT'
    | 'DUPLICATE_CONTENT'
    | 'OTHER';

export type ReviewDecision =
    | 'APPROVE'
    | 'REJECT'
    | 'REQUEST_EDIT'
    | 'DISMISS';