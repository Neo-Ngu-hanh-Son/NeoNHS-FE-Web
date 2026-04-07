/**
 * Event Timeline Type Definitions
 */

export interface EventTimelineResponse {
    id: string;
    name: string;
    description?: string;
    date: string;          // "2026-04-04" (LocalDate)
    startTime: string;     // "08:00" (LocalTime)
    endTime: string;       // "09:30" (LocalTime)
    organizer?: string;
    location?: string;
    lunarDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventTimelineRequest {
    name: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    organizer?: string; 
    location?: string;
}

export interface UpdateEventTimelineRequest {
    name?: string;
    description?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    organizer?: string;
    location?: string;
}
