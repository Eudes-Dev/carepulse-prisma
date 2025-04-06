'use client'

import React from 'react'
import { Form, FormControl } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerPatient } from '@/lib/actions/patient.actions'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './PatientForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { PatientFormValidation } from '@/lib/validation'
import { GenderOptions, PatientFormDefaultValues } from '@/constants'
import { Label } from '../ui/label'

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        // @ts-ignore
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: '',
            email: '',
            phone: ''
        }
    })

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        console.log('Form submitted with values: ', values)
        setIsLoading(true)

        let formData

        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            formData = new FormData()
            formData.append('blobFile', blobFile)
            formData.append('fileName', values.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            }

            console.log('Patient data: ', patientData)
            
            //@ts-ignore
            const patient = await registerPatient(patientData)

            if (patient) router.push(`/patients/${user.$id}/new-appointment`)

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Form {...form}>
        {/* @ts-ignore */}
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12 flex-1'>
            <section className='space-y-4'>
                <h1 className='header'>Welcome 👏</h1>
                <p className='text-dark-700'>Let us know more about yourself.</p>
            </section>

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                    <h2 className="sub-header">Personnal Information</h2>
                </div>
            </section>

            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='name'
                label='Full name'
                placeholder='John Doe'
                iconSrc='/assets/icons/user.svg'
                iconAlt='user'
            />

            <div className='flex flex-col gap-6 xl:flex-row'>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name='email'
                    label='Email'
                    placeholder='email@gmail.com'
                    iconSrc='/assets/icons/email.svg'
                    iconAlt='email'
                />
                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name='phone'
                    label='Phone number'
                />
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
                <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name='birthDay'
                    label='Date of Birth'
                />
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name='gender'
                    label='Gender'
                    renderSkeleton={(field) => (
                        <FormControl>
                            <RadioGroup
                                className='flex h-11 gap-6 xl:justify-between'
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                {GenderOptions.map((option) => (
                                    <div key={option} className='radio-group'>
                                        <RadioGroupItem value={option} id={option} />

                                        <Label htmlFor={option} className='cursor-pointer'>
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
                    
            </div>
        </form>
    </Form>
  )
}

export default RegisterForm