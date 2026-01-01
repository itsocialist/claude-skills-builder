import { FlowBackground } from '@/components/flow/FlowBackground';

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <FlowBackground stepIndex={4} />
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}
