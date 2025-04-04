'use server'

import { PrismaClient } from "@prisma/client"

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