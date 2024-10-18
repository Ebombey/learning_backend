import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validation
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required.");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImg[0]?.path;

  if (avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  let coverImg = "";
  if (coverImgLocalPath) {
    coverImg = await uploadOnCloudinary(coverImgLocalPath);
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user.");
  }
});

export { registerUser };
