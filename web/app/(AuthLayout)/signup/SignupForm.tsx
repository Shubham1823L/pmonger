'use client'
import AuthFormSchema from '@/components/Auth/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import styles from '@/components/Auth/auth.module.css'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AuthFormFields } from '@/types/auth'
import clsx from 'clsx'
import { toast } from 'sonner'
import apiClient from '@/lib/apiClient'
import { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'

const SignupFormSchema = AuthFormSchema

type SignupFormFields = AuthFormFields

const SignupForm = () => {
    const [currentType, setCurrentType] = useState<'password' | 'text'>('password')
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<AuthFormFields>({ resolver: zodResolver(SignupFormSchema) })

    const router = useRouter()


    const onSubmit: SubmitHandler<SignupFormFields> = async (data) => {
        toast.loading('Verifying Credentials', {
            id: 'signup'
        })

        try {
            await apiClient('post', '/auth/signup', data)
            toast.success('OTP Sent', {
                id: 'signup',
                description: "An OTP has been sent to your email",
                duration:1500
            })
            router.push('/signup/verify')
        } catch (error) {
            if (!error) return toast.error('Internal Error', {
                description: 'Something went wrong !',
                id: 'signup'
            })


            if (typeof error === 'object' && !Array.isArray(error)) {
                toast.dismiss('signup')
                if (!error.status) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'signup'
                })

                const { status, data: { code, message } } = error as ApiError
                if (status >= 500) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'signup'
                })

                if (status === 400) return setError('root', { message })
                if (status === 409) return setError('email', { message })

            }
            toast.error('Internal Error', {
                id: 'signup',
                description: "Something went wrong !"
            })

        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h1 className={styles.heading}>Sign up to P Monger</h1>
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
            <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="fullName">Full Name</label>
                </div>
                <input {...register('fullName')} className={styles.input} type="text" name='fullName' id='fullName' />
                {errors.fullName && <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    {errors.fullName.message}
                </span>}
            </div>
            {errors.root && <span className={styles.errorMsg}>
                <AlertCircle size={20} color='var(--clr-red-500)' />
                {errors.root.message}
            </span>}
            <button disabled={isSubmitting} className={clsx(styles.submitBtn, isSubmitting && 'disabledBtn')}>Sign up</button>
            <div className={styles.switchPageLinks}>
                <Link href={'/login'}>Log in</Link>
                {/* <Link href={'/signup'}>Forgot Password?</Link> */}
            </div>
        </form >
    )
}

export default SignupForm
