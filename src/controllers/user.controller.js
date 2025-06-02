import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

//Method to generate access and refresh token.
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens.")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    
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

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
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

const loginUser = asyncHandler( async (req, res) => {
    //Logic to login
    
    /**
     * req body -> data
     * username or email
     * find the user in database
     * password check. 
     * generate access token and refresh token. 
     * send cookies. 
     */
    

    //Get data from req body
    const {email, username, password} = req.body;

    //Check if either username or email is available or not.
    if(!username && !email) {  
        throw new ApiError(400, "username or email is required! ")
    }

    //Find the user in database.
    const user = await  User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(user);

    //Return with error if user not found.
    if(!user){
        throw new ApiError(404, "User not found! Please sign up.")
    }

    //Check if password is correct or not.
    // console.log(password)
    const passwordCorrect = await user.isPasswordCorrect(password);

    //If password is not correct return with the message.
    if(!passwordCorrect){
        throw new ApiError(402, "Password is incorrect! Please try again. ");
    }

    //Generate access and refresh tokens from the method we have created.
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // //Because we want to exclude password and refreshTokens from the response. 
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully. "
        )
    )


});

const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
})


export {
    registerUser,
    loginUser,
    logoutUser
}