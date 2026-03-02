import mongoose from "mongoose"
import {GenderEnum,ProviderEnum, RoleEnum} from "../../common/index.js"

export const UserSchema = new mongoose.Schema({

    // name feild 

    firstName : {
        type : String,
        required : true,
        minlength : 2 ,
        maxlength : 25,
        trim:true
    },
      lastName : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 25,
        trim:true
    },

    // email feild 
    
    email :{
        type : String,
        required:true,
        unique:true
    },
    otp:{
        type : String,
    },
    otpExpiration : {
        type : Date,
    },
    confirmEmail :{
        type : Boolean,
        default:false
    },

    // Password feild

    password : {
        type : String , 
        required: function(){
            return this.provider === ProviderEnum.System
        },
        minlength :8,
        trim:true
    },

    // phone feild 
    
    phone : {
        type : String  ,
    },

    // Gender feild

    gender : {
        type : Number,
        enum :Object.values(GenderEnum) ,
        default: GenderEnum.Male
    },


    // address feild 

    address: {
        type: String,
        trim: true
    },


    // profile Image feild 
    profileImage: {
        type: String,
    },

    // cover Image feild 

    coverImage: {
        type: [String],
    },

    // provider feild

    provider: {
        type: Number,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.System
    },
      Role: {
        type: Number,
        enum: Object.values(RoleEnum),
        default: RoleEnum.User
    },

    // change credantials feild
   changeCredantials :{
        type : Date,
    },

},{

    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})


UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', { virtuals: true });

// to avoid hot reload bug 

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)




