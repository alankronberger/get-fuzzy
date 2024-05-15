import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Home',
};

export default function Page() {
    return (
        <main className="h-full">
            <h1 className="text-black">Home</h1>
        </main>
    )
}