import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../services/api';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function VerifyCode() {
    const location = useLocation();
    const emailAddress = location.state.emailAddress;
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [verificationError, setVerificationError] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e, index) => {
        if (
            !/^[0-9]{1}$/.test(e.key)
            && e.key !== 'Backspace'
            && e.key !== 'Delete'
            && e.key !== 'Tab'
            && !e.metaKey
        ) {
            e.preventDefault();
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            const newOtpValues = [...otpValues];
            newOtpValues[index] = '';
            setOtpValues(newOtpValues);
        }
    };

    const handleInput = (e, index) => {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = e.target.value;
        setOtpValues(newOtpValues);
        setVerificationError('');

        // Automatically move focus to the next input box if the current one has a value
        if (e.target.value && index < otpValues.length - 1) {
            const nextIndex = index + 1;
            const nextInput = document.getElementById(`otp-input-${nextIndex}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (!new RegExp(`^[0-9]{${otpValues.length}}$`).test(text)) {
            return;
        }
        const digits = text.split('');
        const newOtpValues = [];
        for (let i = 0; i < otpValues.length; i++) {
            if (i < digits.length) {
                newOtpValues.push(digits[i]);
            } else {
                newOtpValues.push('');
            }
        }
        setOtpValues(newOtpValues.join(''));
        // console.log(newOtpValues.join(''));
        setVerificationError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = otpValues.join('');
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email: emailAddress, otp: verificationCode });
            if (response.status === 200) {
                console.log("Successfully verified OTP");
                navigate('/auth/new-password', { replace: true,state: { emailAddress: emailAddress } });
            } else {
                console.log("Failed to verify OTP");
                setVerificationError("Invalid OTP.");
                toast.error(verificationError, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
            }
        } catch (error) {
            console.error("Error:", error);
            setVerificationError("An error occurred while verifying the OTP.");
            toast.error(verificationError, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            setVerificationError("An error occurred while verifying the OTP.");
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
            <ToastContainer/>
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                <div className="flex justify-center">
                    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">OTP Verification</h1>
                            <p className="text-[15px] text-slate-500">Enter the 6-digit verification code that was sent to your Email <b>{emailAddress}</b>.</p>
                        </header>
                        <form id="otp-form" onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-3">
                                {otpValues.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        id={`otp-input-${index}`}
                                        className="w-12 h-14 text-center text-2xl font-extrabold text-slate-900 bg-white border border-black hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black"
                                        maxLength="1"
                                        value={value}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onInput={(e) => handleInput(e, index)}
                                        onFocus={handleFocus}
                                        onPaste={handlePaste}
                                        required
                                    />
                                ))}
                            </div>
                            <div className="max-w-[260px] mx-auto mt-4">
                                <button type="submit"
                                    className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-black px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-black focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">
                                    Verify Account
                                </button>
                            </div>
                        </form>
                        {verificationError && <div className="text-red-500 text-sm mt-4">{verificationError}</div>}
                        <div className="text-sm text-slate-500 mt-4">Didn't receive code? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a></div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default VerifyCode;
