import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getDashboard = async (request: Request, response: Response) => {
    try {
        console.log("get Dashboard called!!!")
        /** process to get order, contains means search name or table number of customer's order based on sent keyword */
        const allUsers = await prisma.user.findMany()
        const allStudios = await prisma.studio.findMany()
        const newOrders = await prisma.booking.findMany({
            where: {
                status: { in: ["PENDING", "CONFIRMED"] }    
            },
        })
        const doneOrders = await prisma.booking.findMany({
            where: {status:  'COMPLETED'}
        })
        response.json({
            status: true,
            data: {
                allUser: allUsers.length,
                allstudios: allStudios.length,
                newOrder: newOrders.length,
                doneOrder: doneOrders.length,
            },
            message: `Booking list has retrieved`
        }).status(200)
    } catch (error) {
        console.log(error)
        response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

