import { Request, Response } from "express";
import { PaymentMethod, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { request } from "http";
import { Prisma } from "@prisma/client";

// console.log(Object.keys(Prisma.validator<Prisma.BookingCreateInput>()({})));

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getBookings=async(request:Request,response:Response)=>{
    try{
        const {search} = request.query
        const allBookings= await prisma.booking.findMany({
            where:{
                OR :[
                    { user: { name: { contains: search?.toString() || "" } } },
                    {studio: { name: { contains: search?.toString() || "" } }}
                ]
            },
            orderBy:{createdAt: "desc" },
            include :{
                user:true,
                studio:true,
                payments:true
                }
            
        });
        response.json({
            status: true,
            data: allBookings,
            message: `Order list has retrieved`
        }).status(200)
    } catch (error) {
        response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}
export const getBookingById=async(request:Request,response:Response)=>{
    try{
        const{id}=request.body.booking

        if(!id){
            response
            .json({
                status :false,
                message :`user not found`
            })
            .status(400)
             return
        }
        const allBookings=await prisma.booking.findFirst({
            where:{id:Number(id)}
        })
         response.json({
            status:true,
            data:allBookings,
            message:`booking has retrived`
        }).status(200)
        return
    }catch(error){
         response
        .json({
            status:false,
            message:`there is an error. ${error}`
        })
        .status(400)
        return
    }
}
export const createBooking = async (request: Request, response: Response) => {
    try {
        /** get requested data (data has been sent from request) */
        const { customer, studioid, payment_method,start_time,end_time, note, status} = request.body
        const user = request.body.user
        if (!studioid||!start_time||!end_time){
            response.status(400)
            .json({status:false,message:`data tidak lengkap`})
        }
        const studio = await prisma.studio.findUnique({where:{id:studioid}})
        
        if(!studio){
           response.status(400)
            .json({status:false,message:`studio tidak ditemukan`})
            return 
        }
        const start =new Date(start_time)
        const end = new Date(end_time)
        const duration = (end.getTime()-start.getTime())/(1000*60*60);
        const total_price= duration*studio.pricePerHour;
        
        const newBooking = await prisma.booking.create({
            data: {
              uuid: uuidv4(),
              customer: customer,
              user: user?.id ? { connect: { id: user.id } } : undefined,
              studio: { connect: { id: studioid } },
              startTime: new Date(start_time),
              endTime: new Date(end_time),
              note: note,
              totalPrice: total_price,
              status,
              paymentMethod: payment_method, // FIXED
            },
            include: {
              studio: true,
              user: true,
            },
          });
         response.status(200).json({
            status: true,
            message: "Booking berhasil dibuat",
            data: newBooking,
          }) ;
        } catch (error) {
        response.status(500).json({ status: false, message: `Terjadi kesalahan: ${error}` });
        }
      };

export const updateBooking = async(request:Request,response:Response)=>{
    try{
        const {id}=request.params
        const {
            customer,
            studioId,
            startTime,
            endTime,
            note,
            status,
            paymentMethod,
          } = request.body;

        const findBooking = await prisma.booking.findFirst({where:{id:Number(id)}})
        if(!findBooking){
            response.status(200)
            .json({status:false, message:`order is not found`})
        }
        const studio = await prisma.studio.findUnique({ where: { id: studioId } });
        if (!studio) {
         response.status(404).json({ status: false, message: "Studio not found" });
         return 
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const totalPrice = Math.ceil(durationInHours) * studio.pricePerHour;
        const updateBooking= await prisma.booking.update({
            data: {
                customer: customer,
                studioId,
                startTime: start,
                endTime: end,
                note,
                status,
                paymentMethod,
                totalPrice,
            },
            where:{id:Number(id)}
        })
        response.json({
            status:true,
            data:updateBooking,
            message: ` order has updated`
        }).status(200)
    }catch(error){
        response.json({
            status:false,
            message:`there is an error.${error}`
        })
        .status(400)
    }
}

export const deleteBooking= async(request:Request,response:Response)=>{
    try{
        const {id}= request.params;
        const findBooking= await prisma.booking.findFirst({where:{id:Number(id)}})
        if(!findBooking)
            response.status(200)
            .json({
                status:false,
                message:`order is not found`
            })
        let deleteBooking = await prisma.booking.delete({where:{id:Number(id)}})
        response.json({
            status:true,
            data:deleteBooking,
            message:`booking has deleted`
        }).status(200)
        
        
    }catch(error){
        response.status(400)
        .json({
            status:false,
            message: `there is an error.${error}`
        })
    }
}
