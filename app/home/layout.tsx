import TopNav from "../ui/topnav";
import FollowBar from "../ui/followbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="block bg-white h-screen overflow-hidden">
          <TopNav />
          <div className="flex h-full overflow-hidden">
            <FollowBar />
            <div className="md:p-12">{children}</div>
          </div>
          
        </div>
    )
}