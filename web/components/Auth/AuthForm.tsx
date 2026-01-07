'use client'

import React, { useState } from 'react'
import styles from './auth.module.css'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FieldErrors, FieldValues, SubmitHandler, UseControllerProps, UseFormHandleSubmit, UseFormRegister, UseFormReturn } from 'react-hook-form'


// interface AuthFormProps<T extends FieldValues> {
//     errors: FieldErrors<T>,
//     register: UseFormRegister<T>,
//     handleSubmit: UseFormHandleSubmit<T>,
//     isSubmitting: boolean,
//     onSubmit: SubmitHandler<T>

// }

interface AuthFormProps<T extends FieldValues> {
    form: UseFormReturn<T>,
    onSubmit: SubmitHandler<T>,
}

const AuthForm = <T extends FieldValues>({ form, onSubmit }: AuthFormProps<T>) => {
    const [currentType, setCurrentType] = useState<'password' | 'text'>('password')

    const { register, handleSubmit, formState: { errors, isSubmitting } } = form



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

            <div className={styles.switchPageLinks}>
                <Link href={'/signup'}>Sign up</Link>
                {/* <Link href={'/signup'}>Forgot Password?</Link> */}
            </div>
        </form >
    )
}

export default AuthForm



