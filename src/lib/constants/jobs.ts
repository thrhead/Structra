export const JOB_STATUS = {
	PENDING: "PENDING",
	IN_PROGRESS: "IN_PROGRESS",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
	ON_HOLD: "ON_HOLD",
} as const;

export const JOB_PRIORITY = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
	URGENT: "URGENT",
} as const;

type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
type JobPriority = (typeof JOB_PRIORITY)[keyof typeof JOB_PRIORITY];
