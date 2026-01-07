import { Metadata } from 'next'
import React from 'react'
import SignupForm from './SignupForm'


export const metadata: Metadata = {
  title: "Signup - P Monger",
  description: "Signup page for P Monger"
}


const Signup = () => {
  return (
    <SignupForm />
  )
}

export default Signup
