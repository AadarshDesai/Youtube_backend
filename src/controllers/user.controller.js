import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

//logic to register
    
    // get user details from frontend (in our case from postman body) - Done
    // validation - non empty - Done
    // Check if user already exist: username, email - Done
    // Check for images, check for avatar - Done
    // Upload them to cloudinary, check avatar is present or not - Done
    // Create user object - create entry in DB - Done
    // Remove password and refresh token field from response. - Done
    // Check for user creation - Done
    // return response. - Done

const registerUser = asyncHandler( async (req, res) => {
    
    const {fullName, username, password, email} = req.body;

    //Empty Validation
    if (
        [fullName, username, password, email].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Please fill all the required fields.");
    }

    //Check if user already exist or not
    const userExist = await User.findOne({
        $or: [ { username }, { email } ]
    });

    if(userExist) {
        throw new ApiError ( 409, "Username or Email Already Exists!" );
    }

    //Fetch localpaths for avatar and coverImages
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    //As avatar is required field, check if avatar is present or not.
    if(!avatarLocalPath) {
        throw new ApiError ( 400, "Avatar file is required!" );
    }

    //Uplaod on cloudinary
    const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
    const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);

    //Throw error if avatar is not present.
    if(!avatarResponse) {
        throw new ApiError ( 400, "Avatar file is required" );
    }

    //Create user in database.
    const response = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatarResponse.url,
        coverImage: coverImageResponse?.url || "",
    });

    //Check if user entry is added in the database. 
    const userCreated = await User.findById(response._id).select(
        "-password -refreshToken"
    );

    //If user is not created, throw an error. 
    if(!userCreated) {
        throw new ApiError( 500, "Something went wrong while registering user!" );
    }

    //Else return th status code and response.
    return res.status(201).json(
        new ApiResponse(200, userCreated, "User created successfully",  )
    )


});

export { registerUser }