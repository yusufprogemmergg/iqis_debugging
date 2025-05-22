import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL, SECRET } from "../global"
import { v4 as uuidv4 } from "uuid";
import { request } from "http";
import fs from "fs";

const prisma = new PrismaClient({errorFormat:"pretty"})

export const getAllStudio=async (request:Request, response:Response)=>{
    try{
        const {search} =request.query

        const allStudio = await prisma.studio.findMany({
            where:{name:{contains:search?.toString()||""} }
        })
        response.json({
            status:true,
            data:allStudio,
            message:"studios has retrived"
        }).status(200)
    }catch(error){
        response.json({
            status:false,
            message:`there is an error .${error}`
        })
        .status(400)
    }
}

export const createStudio = async (request: Request, response: Response) => {
    try {
        const { name, pricePerHour, description } = request.body;

        let filename = "";
        if (request.file) filename = request.file.filename;

        const newStudio = await prisma.studio.create({
            data:{
                name,
                pricePerHour: Number(pricePerHour),  // Adjusted from price to pricePerHour
                description,
                picture: filename
            }
        });

        response.json({
            status: true,
            data: newStudio,
            message: 'New studio has been created successfully'
        }).status(200);
    } catch (error) {
        response.json({
            status: false,
            message: `There was an error: ${error}`
        }).status(400);
    }
};

export const updateStudio=async(request:Request,response:Response)=>{
    try{
        const {id} =request.params
        const{name,pricePerHour,description}=request.body

        const findStudio= await prisma.studio.findFirst({where:{id:Number(id)}})
        if(!findStudio){
             response.status(200)
            .json({
                status:false, 
                message: `studio isn't found`})
                return
        }
        let filename= findStudio.picture
        if(request.file){
            filename=request.file.filename
            let path =`${BASE_URL}/../public/studio_picture/${findStudio?.picture}`
            let exists =fs.existsSync(path)
            if(exists&&findStudio.picture!==``)fs.unlinkSync(path)
        }
    const updateStudio=await prisma.studio.update({
        data:{
            name:name||findStudio.name,
            pricePerHour:pricePerHour?Number(pricePerHour):findStudio.pricePerHour,
            description:description||findStudio.description,
            picture:filename
        },
        where:{id:Number(id)}
    })
    response.json({
        status: true,
        data: updateStudio,
        message: `studio has updated`
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
export const deleteStudio = async(request:Request,response:Response)=>{
    try{
        const {id}=request.params

        const findStudio= await prisma.studio.findFirst({where:{id:Number(id)}})
        if(!findStudio){
            response.status(200)
            .json({status:false,message:`studio is not found`})
            return
        }

        let path=`${BASE_URL}/../public/studio_picture/${findStudio?.picture}`
        let exists=fs.existsSync(path)
        
        if(exists&&findStudio.picture !==``)fs.unlinkSync(path)

        const deleteStudio= await prisma.studio.delete({
            where:{id:Number(id)}
        })    
        response.json({
            status: true,
            data:deleteStudio,
            message:`studio has deleted`
        }).status(200)
    }catch(error){
        response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}