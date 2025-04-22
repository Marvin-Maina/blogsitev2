import Bloglist from "../components/BlogList";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    return (
        <div className="flex">
           
       
        <div className="flex-1 p-6 ml-64">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <Bloglist />
        </div>
        </div>

    )
}
export default Dashboard