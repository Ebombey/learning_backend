import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health Check passed!"));
});

export { healthCheck };

// --This is usually done but we have async handler--
// const healthCheck = async (req, res) => {
//   try {
//     res.status(200).json();
//   } catch (error) {}
// };
