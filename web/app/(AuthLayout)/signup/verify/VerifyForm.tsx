'use client'
import React from 'react'
import styles from '@/components/Auth/auth.module.css'
import Link from 'next/link'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import clsx from 'clsx'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import apiClient from '@/lib/apiClient'
import { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'

const VerifyFormSchema = z.object({
    otp: z.coerce.number({ error: "Must be a 6 digit number" }).int({ error: "Must be a 6 digit number" }).nonnegative({ error: "Cannot be negative" }).refine(val => val.toString().length === 6, { error: "Must be a 6 digit number" })
})

type VerifyFormFields = z.infer<typeof VerifyFormSchema>


const VerifyForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<VerifyFormFields>({ resolver: zodResolver(VerifyFormSchema) })
    const router = useRouter()

    const onSubmit: SubmitHandler<VerifyFormFields> = async (data) => {
        toast.loading("Verifying OTP", {
            id: "otp"
        })

        try {
            await apiClient('post', '/auth/signup/verify', data)
            toast.success('Signup Successful', {
                description: "Account created successfully",
                id: 'otp'
            })
            router.replace('/dashboard')
        } catch (error) {
            if (!error) return toast.error('Internal Error', {
                description: 'Something went wrong !',
                id: 'signup'
            })


            if (typeof error === 'object' && !Array.isArray(error)) {
                toast.dismiss('verify')
                if (!error.status) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'signup'
                })

                const { status, data: { code, message } } = error as ApiError
                if (status >= 500) return toast.error('Internal Error', {
                    description: 'Something went wrong !',
                    id: 'signup'
                })

                if (status === 400 || status === 401) return setError('otp', { message: "Invalid OTP" })
                if (status === 410) return setError('root', { message: "Session Expired, please re-signup" })
            }
            toast.error('Internal Error', {
                id: 'verify',
                description: "Something went wrong !"
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h1 className={styles.heading}>Enter OTP</h1>
            <div className={styles.textField}>
                <div className={styles.inputHeader}>
                    <label htmlFor="otp">OTP</label>
                </div>
                <input {...register('otp')} className={styles.input} inputMode='numeric' type="number" name='otp' id='otp' />
                {errors.otp && <span className={styles.errorMsg}>
                    <AlertCircle size={20} color='var(--clr-red-500)' />
                    {errors.otp.message}
                </span>}
                <button disabled={isSubmitting} className={clsx(styles.submitBtn, isSubmitting && 'disabledBtn')}>Continue</button>
                <div className={styles.switchPageLinks}>
                    <Link href={'/login'}>Log in</Link>
                    <Link href={'/signup'}>Back</Link>
                </div>
            </div>
        </form>
    )
}

export default VerifyForm
