'use server'

import { PrismaClient } from "@prisma/client"
import { parseStringify } from "../utils"

import { InputFile } from 'node-appwrite/file'
import { BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "../appwrite.config"
import { ID } from "node-appwrite"

const prisma = new PrismaClient()

export const createUser = async (user: CreateUserParams) => {
    try {
        //Verification si l'utilisateur existe deja (par email)
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if (existingUser)
            return existingUser

        //Creer un nouvel utilisateur
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                phone: user.phone,
                name: user.name
            }
        })

        console.log(user.phone)
        return newUser

    } catch (error) {
        console.error('Error lors de la creation de l\'utilisateur: ', error)
        throw error
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        return user ? parseStringify(user) : null
        
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur : ", error)
        return null
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let fileId = null
        let fileUrl = null
        
        //Gestion du fichier avec Appwrite Storage
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blodFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            const file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
            fileId = file?.$id
            fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
        }

        //Creation du patient
        const newPatient = await prisma.patient.create ({
            data: {
                identificationDocument: fileUrl,
                gender: patient.gender,
                birthDate: patient.birthDate,
                address: patient.address,
                occupation: patient.occupation,
                emergencyContactName: patient.emergencyContactName,
                emergencyContactNumber: patient.emergencyContactNumber,
                primaryPhysician: patient.primaryPhysician,
                insuranceProvider: patient.insuranceProvider,
                insurancePolicyNumber: patient.insurancePolicyNumber,
                allergies: patient.allergies || null,
                currentMedication: patient.currentMedication || null,
                familyMedicalHistory: patient.familyMedicalHistory || null,
                pastMedicalHistory: patient.pastMedicalHistory || null,
                identificationType: patient.identificationType || null,
                identificationNumber: patient.identificationNumber || null,
                privacyConsent: patient.privacyConsent,
                disclosureConsent: patient.privacyConsent,
                userId: patient.userId
            }
        })

        console.log(newPatient)

        return parseStringify(newPatient)

    } catch (error) {
        console.error("Erreur lors de la creation du patient : ", error)
        return null
    }
}