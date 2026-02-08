import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    // A simple, lightweight response to indicate the server is alive
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                { status: "OK", uptime: process.uptime() }, 
                "Health check passed"
            )
        );
});

export { healthcheck };