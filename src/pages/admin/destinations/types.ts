import { AttractionResponse } from '@/types/attraction';
import { PointResponse } from '@/types/point';

export interface Point extends PointResponse { }

export interface Destination extends AttractionResponse {
    points: Point[];
}

export type MapPickerTarget = 'destination' | 'point';
