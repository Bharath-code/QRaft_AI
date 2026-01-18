import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background bg-noise">
            <div className="w-full max-w-sm space-y-4 reveal-up reveal-up-1">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black font-display tracking-tighter uppercase">QRaft.ai</h1>
                    <p className="text-muted-foreground font-medium">Sign in to manage your art</p>
                </div>
                <AuthForm />
            </div>
        </div>
    );
}
