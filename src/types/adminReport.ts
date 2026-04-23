export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';
export type ReportTargetType = 'POINT' | 'EVENT' | 'WORKSHOP' | 'ALL';

export interface AdminReport {
    id: number;
    reporterName: string;
    targetId: number;
    targetName: string;
    targetType: Exclude<ReportTargetType, 'ALL'>;
    reason: string;
    description: string;
    evidenceUrl?: string;
    status: ReportStatus;
    createdAt: string;
    handleNote?: string;
    resolvedAt?: string;
}

export interface ReportFilter {
    targetType?: ReportTargetType;
    status?: ReportStatus;
    reporterName?: string;
    page?: number;
    size?: number;
}

export interface ResolveReportRequest {
    status: 'RESOLVED' | 'REJECTED';
    handleNote: string;
}
