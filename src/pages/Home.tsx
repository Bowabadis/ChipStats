import { Link } from "react-router"
import imgUrl from '../assets/home-background.png'

function Home() {
  return (
    <div className='relative flex items-center justify-center h-screen overflow-hidden'>
      <img src={imgUrl} alt="poker chips" className="w-full h-full object-cover blur-xs" />
      <div className="absolute bg-primary/50 w-150 h-150 rounded-full top-8 right-[-16rem] blur-2xl"></div>
      <div className="absolute bg-bg-main/50 w-150 h-150 rounded-full bottom-0 left-[-16rem] blur-2xl"></div>
        {/* header */}
        <div className="h-fit flex flex-col items-center absolute text-center">
            <div className="text-9xl font-bold text-white text-shadow-lg">Chip Stats</div>
            <div className="text-2xl mt-8 text-text-inverse text-shadow-md">For casual poker players</div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 text-xl">
               <Link to="/login" className='shadow font-semibold bg-primary w-[200px] text-center hover:bg-primary-muted text-text-inverse px-4 py-1 rounded-sm'>Login</Link>
               <Link to="/signup" className='shadow font-semibold border-2 w-[200px] text-center border-primary hover:bg-bg-neutral/20 text-text-inverse px-4 py-1 rounded-sm'>Sign Up</Link>
            </div>
        </div>
    </div>
  )
}

export default Home