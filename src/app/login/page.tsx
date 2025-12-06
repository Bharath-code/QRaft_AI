import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-sm space-y-4">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">QRaft.ai</h1>
                    <p className="text-muted-foreground">Sign in to manage your art</p>
                </div>
                <AuthForm />
            </div>
        </div>
    );
}
