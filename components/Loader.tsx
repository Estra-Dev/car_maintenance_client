import { Car } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center overflow-hidden'>
      <h1 className=' font-bold text-2xl text-gray-700 text-center'>Car <span className=' text-lime-500'>Maintenance</span></h1>
      <div className="car-animation">
        <Car className=' w-32 h-32 text-lime-500' />
      </div>
    </div>
  )
}

export default Loader 
