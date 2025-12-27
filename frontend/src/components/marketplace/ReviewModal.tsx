'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/StarRating';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface ReviewModalProps {
    skillId: string;
    onReviewSubmitted: () => void;
}

export function ReviewModal({ skillId, onReviewSubmitted }: ReviewModalProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);

        if (!supabase) {
            alert('Database not configured');
            setSubmitting(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('skill_reviews').insert({
                skill_id: skillId,
                user_id: user.id,
                rating,
                comment
            });

            if (error) throw error;

            setOpen(false);
            setRating(0);
            setComment('');
            onReviewSubmitted();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Write a Review</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[auto] max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Write a Review</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium">Rate this skill</span>
                        <StarRating rating={rating} size={32} onChange={setRating} />
                    </div>
                    <Textarea
                        placeholder="Share your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || submitting}
                        className="w-full"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Submit Review
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
