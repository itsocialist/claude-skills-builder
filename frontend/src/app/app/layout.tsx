export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Pages manage their own Shell wrapper, so layout just passes through
    return <>{children}</>;
}
