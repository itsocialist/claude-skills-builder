'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const FEEDBACK_CATEGORIES = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'question', label: 'Question' },
    { value: 'other', label: 'Other' },
];

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category || !message.trim()) {
            toast.error('Please select a category and enter a message');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category,
                    message: message.trim(),
                    email: email.trim() || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Thanks for your feedback!');
                setCategory('');
                setMessage('');
                setEmail('');
                setIsOpen(false);
            } else {
                toast.error(data.error || 'Failed to submit feedback');
            }
        } catch {
            toast.error('Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-[#C15F3C] hover:bg-[#a84f32] text-white shadow-lg flex items-center justify-center transition-all duration-200 ${isOpen ? 'scale-0' : 'scale-100'}`}
                aria-label="Send feedback"
            >
                <MessageSquare className="w-5 h-5" />
            </button>

            {/* Feedback Panel */}
            <div
                className={`fixed bottom-6 left-6 z-50 w-80 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl shadow-xl transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
                    <h3 className="font-medium text-white">Send Feedback</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Category */}
                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:outline-none focus:border-[#C15F3C]"
                        >
                            <option value="">Select category...</option>
                            {FEEDBACK_CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your feedback..."
                            rows={4}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#C15F3C] placeholder:text-gray-500"
                        />
                    </div>

                    {/* Email (optional) */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email (optional, for follow-up)"
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:outline-none focus:border-[#C15F3C] placeholder:text-gray-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C15F3C] hover:bg-[#a84f32] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
