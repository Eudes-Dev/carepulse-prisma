'use client'

import { decryptKey, encryptKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import Image from 'next/image'


const PassKeyModal = () => {
    const router = useRouter()
    const path = usePathname()
    const [open, setOpen] = React.useState(true)
    const [passkey, setPasskey] = React.useState('')
    const [error, setError] = React.useState('')

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null

    React.useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey)

        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            setOpen(false)
            router.push('/admin')
        } else {
            setOpen(true)
        }
    }, [encryptedKey])

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey)

            localStorage.setItem('accessKey', encryptedKey)

            setOpen(false)
        } else {
            setError('Invalid passkey. Please try again')
        }
    }

    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='shad-alert-dialog'>
            <AlertDialogHeader>
                <AlertDialogTitle className='flex items-start text-white justify-between'>
                    Admin Access Verification
                    <Image
                        src='/assets/icons/close.svg'
                        alt='close'
                        width={20}
                        height={20}
                        onClick={() => closeModal()}
                        className='cursor-pointer'
                    />
                </AlertDialogTitle>
                <AlertDialogDescription className='text-white'>
                    To access the admin page, please enter your passkey.
                </AlertDialogDescription>                
            </AlertDialogHeader>
            <div>
                <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot className='shad-otp-slot' index={0} />
                        <InputOTPSlot className='shad-otp-slot' index={1} />
                        <InputOTPSlot className='shad-otp-slot' index={2} />
                        <InputOTPSlot className='shad-otp-slot' index={3} />
                        <InputOTPSlot className='shad-otp-slot' index={4} />
                        <InputOTPSlot className='shad-otp-slot' index={5} />
                    </InputOTPGroup>
                </InputOTP>

                {error && <p className='shad-error text-14-regular mt-4 flex justify-center'>{error}</p>}
            </div>
            <AlertDialogFooter>
                <AlertDialogAction
                    onClick={(e) => validatePasskey(e)}
                    className='shad-primary-btn w-full'
                >
                    Enter Admin Passkey
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default PassKeyModal