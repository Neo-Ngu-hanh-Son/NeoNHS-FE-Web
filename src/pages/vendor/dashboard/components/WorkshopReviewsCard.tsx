import { Star } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { WorkshopReview } from '../types';

interface WorkshopReviewsCardProps {
    reviews: WorkshopReview[];
}

export function WorkshopReviewsCard({ reviews }: WorkshopReviewsCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Workshop Reviews</CardTitle>
                <CardDescription>Review summary per workshop</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-4 space-y-4">
                {reviews.map((wr) => (
                    <div key={wr.workshop} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{wr.workshop}</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">{wr.avgRating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Progress value={(wr.avgRating / 5) * 100} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {wr.totalReviews} reviews
                            </span>
                        </div>
                        <p className="text-xs text-emerald-600 font-medium">{wr.recent}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
