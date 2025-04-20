import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res) => {
    //logic to register
    res.status(200).json({
        message: "Chai Aur Code"
    })
});

export { registerUser }