import User from "../model/user.js";
import bcrypt, { compareSync } from "bcryptjs";
import { configDotenv } from "dotenv";
import axios from "axios";

if (process.env.NODE_ENV != "development") {
  configDotenv();
}
const mapToken = process.env.MAPBOX_DEFULT_TOKEN;

export const isRightUser = async function (email, password) {
  const user = await User.findOneAndUpdate(
    { email },
    { lastLogin: Date.now() },
    { new: true }
  );
  if (!user) {
    return { message: "wrong email." };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return { message: "wrong password." };
  }
  return user;
};

export function generateRandomString(length, includeNumeric = true) {
  // const alphabet = "abcdefghijklmnopqrstuvw";
  const numeric = "0123456789";

  let characters = numeric;
  // if (includeNumeric) {
  //   characters += numeric;
  // }

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export const currntTimeInFixedFomat = (currDate, delay = 0) => {
  const currentDate = new Date(currDate + delay * 60 * 1000);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const formatDateAndTime = (date, time) => {
  const array = date.split("/");
  return `${array[2]}-${array[1]}-${array[0]}T${time}:00.000+05:30`;
};

export const formatDateForComparison = (dateObj) => {
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export function getTodayTimestamp(timeStr, extraMinutes = 0) {
  console.log(timeStr);
  const [hours, minutes] = timeStr.split(":").map(Number);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // Note: 0-based (0 = January)
  const day = now.getDate();

  const localDate = new Date(
    year,
    month,
    day,
    hours,
    minutes + extraMinutes,
    0,
    0
  );

  const timezoneOffsetMs = localDate.getTimezoneOffset() * 60 * 1000;
  const utcDate = new Date(localDate.getTime() - timezoneOffsetMs);

  return utcDate.toISOString(); // Returns UTC timestamp
}

export function getTimeStempByTimeStemp(time) {
  const localDate = new Date(time);

  // IST is UTC + 5:30 => 5.5 * 60 * 60 * 1000 = 19800000 ms
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(localDate.getTime() + istOffset);

  // Format to ISO string but remove the 'Z' to indicate it's not UTC
  return istDate.toISOString();
}

// Function to reverse geocode (coordinates to address)
export const reverseGeocode = async (latitude, longitude) => {
  const response = await axios.get(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapToken}`
  );
  return response.data.features[0].properties.place_formatted
    ? response.data.features[0].properties.place_formatted
    : null;
};
