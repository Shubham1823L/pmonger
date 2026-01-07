import React from 'react'
import VerifyForm from './VerifyForm'
import { Metadata } from 'next'

export const metadata: Metadata= {
  title:"Signup - Verify OTP - P Monger",
  description:"Verify OTP"
}

const Verify = () => {
  return (
    <VerifyForm />
  )
}

export default Verify
