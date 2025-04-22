import {Search, User} from 'lucide-react'
import {Link} from "react-router-dom"
function Navbar() {
    return(
        <nav className='bg-gray-900 p-4 flex justify-between items-center shadow-2'>
            <h1 className='text-xl font-bold tracking-wide text-gray-100'>Obscura Ink</h1>
            <div className='flex items-center gap-4'>
                <div className='relative'>
                    <input 
                    type="text" 
                    placeholder='Search...'
                    className='bg-gray-800 text-gray-300 px-4 py-2 rounded-full focus:outline-none w-60'
                    />
                    <Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
                <Link to="/authentication">
  <button>
    <User className="h-8 w-8 text-gray-300 cursor-pointer" />
  </button>
</Link>
            </div>
        </nav>
    )
}

export default Navbar