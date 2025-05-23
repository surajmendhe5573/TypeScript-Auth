import User from '../models/user.model';
import  {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp= async(req: Request, res: Response): Promise<void> =>{
    try {
        const {name, email, password}= req.body;

        if(!name || !email || !password){
             res.status(400).json({message: 'All fields are required'});
             return;
        }

        const userExist= await User.findOne({email});
        if(userExist){
             res.status(409).json({message: 'User already exists'});
             return;
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User sign up successfully', user:newUser});
        
    } catch (error) {
         res.status(500).json({message: 'Internal serveer error'});
    }
};

export const login= async(req: Request, res: Response): Promise<void> =>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
             res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
             res.status(401).json({message: 'Invalid Credentials'});
             return;
        }

        const isMatch= await bcrypt.compare(password, userExist.password)
        if(!isMatch){
             res.status(401).json({message: 'Invalid Credentials'});
             return;
        }

        const token= jwt.sign({id: userExist.id}, process.env.JWT_SECRET || 'JWT_SECRET', {expiresIn: '1h'});
        res.status(200).json({message: 'User login successfully', token});
        
    } catch (error) {
         res.status(500).json({message: 'Internal server error'});
    }
};

export const getAllUsers= async(req: Request, res: Response)=>{
     try {
          const users= await User.find().select('-password');

          if(users.length == 0){
               res.status(404).json({message: 'Users not found'});
          }

          res.status(200).json({message: 'Users fetched successfully', users:users});
          
     } catch (error) {
          res.status(500).json({message: 'Internal server error'});
     }
};

export const updateUser= async(req: Request, res:Response): Promise<void> =>{
     try {
          const {name, email, password}= req.body;
          const {id}= req.params;

          const updates: Partial<{name: string, email: string, password: string}> = {};

          if(name) updates.name= name;
          if(email){
               const userExist= await User.findOne({email});
               if(userExist && userExist.id != id){
                    res.status(409).json({message: 'This email is already taken by another user'});
                    return;
               }
               updates.email= email;
          }

          if(password){
               const hashedPassword= await bcrypt.hash(password, 10);
               updates.password= hashedPassword;
          }

          const updateUser= await User.findByIdAndUpdate(id, updates, {new:true});
          if(!updateUser){
                res.status(404).json({message: 'User not found'});
                return;
          }

          res.status(200).json({message: 'User updated successfully', user:updateUser});
          
     } catch (error) {
         res.status(500).json({message: 'Internal server error'}); 
     }
};

export const deleteUser= async(req: Request, res: Response)=>{
     try {
          const {id}= req.params;

          const deleteUser= await User.findByIdAndDelete(id);
          if(!deleteUser){
               res.status(404).json({message: 'User not found'});
               return;
          }

          res.status(200).json({message: 'User deleted successfully'});
          
     } catch (error) {
          console.log(error);
          res.status(500).json({message: 'Internal server error'});
     }
};

export const getUserById= async(req: Request, res:Response)=>{
     try {
          const {id}= req.params;

          const user= await User.findById(id);

          if(!user){
               res.status(404).json({message: 'User not found'});
               return;
          }

          res.status(200).json({message: 'User fetched successfully', user:user});
          
     } catch (error) {
          res.status(500).json({message: 'Internal server error'});
     }
};