import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL, SECRET } from "../global"
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllUsers = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allUser = await prisma.user.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })

         response.json({
            status: true,
            data: allUser,
            message: `user has retrieved`
        }).status(200)
        return
    } catch (error) {
         response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
            return
    }
}
export const getUserById=async(request:Request,response:Response)=>{
    try{
        const{id}=request.body.user

        if(!id){
            response
            .json({
                status :false,
                message :`user not found`
            })
            .status(400)
             return
        }
        const allUser=await prisma.user.findFirst({
            where:{id:Number(id)}
        })
         response.json({
            status:true,
            data:allUser,
            message:`user has retrived`
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
export const createUser =async(request:Request,response:Response)=>{
    try{
        const {name,email,password,role} =request.body
        const uuid = uuidv4()

       const newUser = await prisma.user.create({
        data:{uuid,name,email,password:md5(password),role}
       })
        response.json({
        status:true,
        data:newUser,
        message:`New user has created`
       }).status(200)
       return
    }catch(error){
         response
            .json({
                status:false,
                message:`there is an error.${error}`
            })
            .status(400)
            return
    }
}
export const updateUser = async(request:Request, response:Response)=>{
    try{
        const {id}= request.params
        const{name,email,password,role}=request.body

        const findUser =await prisma.user.findFirst({where:{id:Number(id)}})

        if(!findUser) {
            response.status(200).json({status:false,message:`user is not found`})
            return
        }

        const updateUser=await prisma.user.update({
            data:{
                name:name ||findUser.name,
                email: email || findUser.email,
                password: password ? md5(password) : findUser.password,
                role: role || findUser.role,
            },
            where:{id: Number(id)}
        })

         response.json({
            status:true,
            data:updateUser,
            message:`user has updated`
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

export const deleteUser=async(request:Request,response:Response) =>{
    try{
        const {id} = request.params

        const findUser=await prisma.user.findFirst({where:{id:Number(id)}})
        if(!findUser) {
            response.status(200).json({status:false, message:`user is not found`});
            return;
        }
        

        const deleteUser=await prisma.user.delete({
            where:{id:Number(id)}
        })    
         response.json({
            status:true,
            data:deleteUser,
            message:`user has deleted`
        }).status(200)
        return
    }catch(error){
        response
            .json({
                status:false,
                message:`there is an error .${error}`
            })
            .status(400) 
            return
    }
}
export const authentication = async(request : Request, response :Response)=>{
    try{
        const {email,password}= request.body

       const findUser = await prisma.user.findFirst({
        where:{email, password:md5(password)}
       })

       if(!findUser) return response
            .status(200)
            .json({status:false, logged:false, message:`email or password is invalid` })

        let data={
            id:findUser.id,
            name: findUser.name,
            email:findUser.email,
            role:findUser.role
        }   
        let payload=   JSON.stringify(data)
        
        let token = sign(payload, SECRET ||"joss")

        return response
            .status(200)
            .json({status:true, logged:true, data:data, message:`login success`,token})
    }catch(error){
        return response
            .json({
                status:false,
                message:`there is an error. ${error}`
            })
            .status(400)
    }
}