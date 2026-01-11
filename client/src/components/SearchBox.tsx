import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react';

const SearchBox = () => {
  return (
    <div className="">
      <div className='flex items-center relative'>
        <Search className='absolute left-3 w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800' onClick={()=>console.log("Search Box clicked..")}/>
        <Input 
          placeholder='Search...' 
          className='pl-10 w-[500px]'
        />
      </div>
    </div>
  )
}

export default SearchBox