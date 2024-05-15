import Link from "next/link";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";

export default function TopNav() {
    return (
        <div className="flex w-full flex-row justify-between bg-violet-950 h-20">
            <Link className="w-40" href="/home">
                <div className="px-10 content-center text-3xl">Get Fuzzy</div>
            </Link>
            <div className="flex  justify-between">
                <MagnifyingGlassCircleIcon />
                <div className="px-5">Profile Pic</div>
            </div>
        </div>
    )
}