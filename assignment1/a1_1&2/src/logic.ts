import {Request,Response} from 'express';


export const handleSplitString=(req:Request,res:Response):Response=>{
    const {string1}=req.params;
    const revisedString=string1.split("_").join(" ");
    return res.json({revisedString});
}

//params
export const handleConcatString=(req:Request,res:Response):Response=>{
    const {string1,string2}=req.params;
    const revisedString=string1+string2;
    return res.json({revisedString});
}

//query

export const handleQueryParamters=(req:Request,res:Response):Response=>{
    const string1=req.query.string1 as string || "";
    const string2=req.query.string2 as string || "";

    const revisedString=string1+string2;
    return res.json({revisedString});
}