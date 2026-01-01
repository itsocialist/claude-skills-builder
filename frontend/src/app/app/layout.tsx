import { NavigationProvider } from '@/components/providers/NavigationProvider';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Pages manage their own Shell wrapper, so layout just passes through
    // But we wrap in NavigationProvider to share config state
    return (
        <NavigationProvider>
            {children}
        </NavigationProvider>
    );
}
