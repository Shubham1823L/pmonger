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

const SignupFormSchema = AuthFormSchema

type SignupFormFields = AuthFormFields

const SignupForm = () => {
    const [currentType, setCurrentType] = useState<'password' | 'text'>('password')
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormFields>({ resolver: zodResolver(SignupFormSchema) })


    const onSubmit: SubmitHandler<SignupFormFields> = (data) => {

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
                <input className={styles.input} type="text" name='email' id='email' />
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
                <input className={styles.input} type={currentType} name='password' id='password' />
                <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    Error message
                </span>
            </div>
            <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="fullName">Full Name</label>
                </div>
                <input className={styles.input} type="text" name='fullName' id='fullName' />
                <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    Error message
                </span>
            </div>

            <button disabled={isSubmitting} className={clsx(styles.submitBtn, isSubmitting && 'disabledBtn')}>Sign up</button>
            <div className={styles.switchPageLinks}>
                <Link href={'/login'}>Log in</Link>
                {/* <Link href={'/signup'}>Forgot Password?</Link> */}
            </div>
        </form >
    )
}

export default SignupForm
