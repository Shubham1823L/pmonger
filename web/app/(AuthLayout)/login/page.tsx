import AuthForm from '@/components/Auth/AuthForm'
import { Metadata } from 'next'
import React from 'react'
import LoginForm from './LoginForm'


export const metadata: Metadata = {
  title: "Login - P Monger",
  description: "Login page for P Monger"
}


const Login = () => {
  return (
    <LoginForm />
  )
}

export default Login
