'use client'
import AuthFormSchema from '@/components/Auth/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import styles from '@/components/Auth/auth.module.css'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import clsx from 'clsx'
import { toast } from 'sonner'
import apiClient from '@/lib/apiClient'
import { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'

const LoginFormSchema = AuthFormSchema.omit({
    fullName: true
})

type LoginFormFields = z.infer<typeof LoginFormSchema>

const LoginForm = () => {
    const [currentType, setCurrentType] = useState<'password' | 'text'>('password')
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormFields>({ resolver: zodResolver(LoginFormSchema) })
    const router = useRouter()


    const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
        toast.loading('Verifying Credentials', {
            id: 'login'
        })
        try {
            await apiClient<{ id: string }>('post', '/auth/login', data)
            toast.success("Login Sucessful", {
                description: "Redirecting...",
                id: 'login',
                duration: 1500
            })
            router.replace('/dashboard')
        } catch (error) {
            if (!error) return toast.error('Internal Error', {
                description: 'Something went wrong !',
                id: 'login'
            })


            if (typeof error === 'object' && !Array.isArray(error)) {
                if (!error.status) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'login'
                })

                const { status, data: { code, message } } = error as ApiError
                if (status >= 500) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'login'
                })

                toast.dismiss('login')
                return setError('root', { message: "Wrong email or password" })
            }
            toast.dismiss('login')


        }
    }





    return (

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h1 className={styles.heading}>Log in to P Monger</h1>
            <a href="" className={styles.oauthBtn}>
                <Image height={18} width={18} src="/google-logo.svg" alt="google-logo" />
                <span>Continue with Google</span>
            </a>
            <a href="" className={styles.oauthBtn}>
                <Image height={18} width={18} src="/github-logo.svg" alt="google-logo" />
                <span>Continue with GitHub</span>
            </a>
            <div className={styles.seperator}>
                <div></div>
                <span>OR</span>
                <div></div>
            </div>
            <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="email">Email</label>
                </div>
                <input {...register('email')} className={styles.input} type="text" name='email' id='email' />
                {errors.email && <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    {errors.email.message}
                </span>}
            </div>
            <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="password">Password</label>
                    <button type='button' onClick={() => setCurrentType(prev => prev === 'text' ? 'password' : 'text')} className={styles.showPassword}>
                        {
                            currentType === 'password' ?
                                <>
                                    <Eye size={20} />
                                    Show
                                </>
                                :
                                <>
                                    <EyeOff size={20} />
                                    Hide
                                </>
                        }
                    </button>
                </div>
                <input {...register('password')} className={styles.input} type={currentType} name='password' id='password' />
                {errors.password && <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    {errors.password.message}
                </span>}
            </div>
            {/* <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="fullName">Full Name</label>
                </div>
                <input className={styles.input} type="text" name='fullName' id='fullName' />
                <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    Error message
                </span>
            </div> */}
            {errors.root && <span className={styles.errorMsg}>
                <AlertCircle size={20} color='var(--clr-red-500)' />
                {errors.root.message}
            </span>}
            <button disabled={isSubmitting} className={clsx(styles.submitBtn, isSubmitting && 'disabledBtn')}>Log in</button>

            <div className={styles.switchPageLinks}>
                <Link href={'/signup'}>Sign up</Link>
                {/* <Link href={'/signup'}>Forgot Password?</Link> */}
            </div>
        </form >
    )
}

export default LoginForm
