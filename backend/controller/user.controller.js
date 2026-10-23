import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import createTokenAndSaveCookie from '../jwt/generateToken.js'
import { getTransporter } from '../config/nodemailer.config.js';
import StoreOTP from '../models/otp.model.js'
import {sendTemplateMessage} from '../utils/sendWhatsappMessage.js'

const transporter = getTransporter();

export const signup = async (req, res) => {
  try {
    let { username, name, email, password, confirmpassword, profilePicURL, withGoogle } = req.body;

    if (!withGoogle && password !== confirmpassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    if (!username || !name || !email || !profilePicURL) {
      return res.status(400).json({ message: "Please provide valid data!" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    let newUser;

    if (!withGoogle) {
      const hash = await bcrypt.hash(password, 10);

      newUser = new User({
        username,
        name,
        email,
        password: hash,
        profilePicURL,
      });
    } else {
      newUser = new User({
        username,
        name,
        email,
        profilePicURL,
        signupWithGoogle: true
      });
    }

    await newUser.save().then(() => {
      console.log("User saved successfully!");
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Prepverse.AI',
      text: `Hi [${name}],

          Welcome to Prepverse.AI! 🎉

          We're excited to have you on board!

          Your journey toward smarter career preparation starts here. Prepverse.AI is designed to help you build confidence, sharpen your skills, and take meaningful steps toward your career goals with the power of AI.

          Here's what you can explore on Prepverse.AI:

          🚀 Prepare for Interviews
          Practice interview questions and improve your confidence before your next interview.

          🎯 Discover Your Career Path
            Explore career opportunities that align with your skills, interests, and aspirations.

          📄 Improve Your Resume
          Get AI-powered resume insights to help you present your skills and experience more effectively.

          💡 Learn, Practice, and Grow
            Use intelligent tools to identify areas for improvement and prepare for new opportunities.

          We believe every learner has the potential to achieve great things. We're here to help you turn your efforts into progress, one step at a time.

          Ready to get started? Log in to Prepverse.AI and begin your journey today!

          If you have any questions or need assistance, feel free to reach out to our support team.

          Wishing you success in your career journey!

          Best regards,
          The Prepverse.AI Team`
    }

    await transporter.sendMail(mailOptions);

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully.",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          profilePicURL: newUser.profilePicURL,
        }
      });
    }

  } catch (err) {
    console.log("Error in signup : ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, withGoogle } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.active) {
      return res.status(404).json({ message: "Account deleted! Can not login!" });
    }

    if (!withGoogle) {
      const compPass = await bcrypt.compare(password, user.password);

      if (!compPass) {
        return res.status(404).json({ message: "Wrong password" });
      }
    }

    createTokenAndSaveCookie(user._id, res);

    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicURL: user.profilePicURL,
        mobileNumber: user.mobileNumber
      }
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: "/",
    });
    return res.status(200).json({ message: "User successfully logged out!" });
  } catch (err) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(500).json({ message: "Please provide a valid email" });
  }

  try {
    await StoreOTP.findOneAndDelete({ email });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "AIspire Accout verification OTP",
      text: `Your OTP is ${otp}. Verify your email ID using this OTP. It is valid for 24 hours.`
    }

    const otpData = new StoreOTP({
      email,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await otpData.save();

    const info = await transporter.sendMail(mailOptions);

console.log("Signup email result:", {
  messageId: info.messageId,
  accepted: info.accepted,
  rejected: info.rejected,
});

    return res.status(200).json({ message: "OTP send successful" });

  } catch (err) {
    console.log("Error in sendOtp : ", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }

}


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(500).json({ message: "Please provide a valid email or OTP" });
  }

  try {

    const data = await StoreOTP.findOne({ email });

    let valid = false;

    if (!data) {
      return res.status(200).json({ message: "Email does not found!" });
    }

    if (data.verifyOtpExpireAt < Date.now()) {
      await StoreOTP.findOneAndDelete({ email });
      return res.status(200).json({ message: "Your OTP has been Expired!" });
    }

    if (otp === data.verifyOtp) {
      valid = true;
    }


    return res.status(200).json({ message: "OTP checked", valid });


  } catch (err) {
    console.log("error in verifyOtp : ", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }

}


export const updateMobile = async (req, res) => {
  const userId = req.user._id;
  const { mobileNumber } = req.body;
  try {
    if(!mobileNumber){
      return res.status(500).json({message: "Please provide a mobile number!"});
    }
    const mobileRegex = /^[0-9]{10}$/; 
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(500).json({
        message: "Please enter a valid mobile number (10digits)."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobileNumber },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await sendTemplateMessage({to : mobileNumber});

    return res.status(200).json({
      message: "Mobile number updated successfully!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicURL: updatedUser.profilePicURL,
        mobileNumber: updatedUser.mobileNumber
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
}



export const deleteMobile = async (req, res) => {
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobileNumber: "" },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Mobile number Deleted!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicURL: updatedUser.profilePicURL,
        mobileNumber: updatedUser.mobileNumber
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
}














