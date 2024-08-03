"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function SessionExpired() {
    const router = useRouter();
    const handleClick = () => {
        router.push('/auth');
      };    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Session Expired</h1>
                <p className="text-sm mt-4">Invalid login, please try again</p>
                <Button className="mt-4" onClick={handleClick}>Login</Button>
            </div>
        </div>
    );
}