import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import VerifyCode from './VerifyCode';
// import { PATH_AUTH } from '../../routes/paths';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSent = (value) => {
    setEmail(value);
    setSent(true);
    console.log("Sent email: " + value);

    // navigate(PATH_AUTH.verify);
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 md:px-0"> {/* Added responsive padding */}
      <div className="container max-w-md mx-auto">
        <div className="flex flex-col items-center">
          {!sent ? (
            <>
              <h1 className="text-3xl font-semibold mb-4 text-center">Forgot your password?</h1>
              <p className="text-gray-600 mb-5 text-center">
                Please enter the email address associated with your account and we will email you a link to reset your
                password.
              </p>
              <ResetPasswordForm onSent={handleSent} onVerified={() => setVerified(true)} />

              <div className="text-center mt-4">
                <RouterLink to='/login' className="block w-full">
                  <button className="w-full bg-black text-white py-2 px-4 rounded mt-2">
                    Back
                  </button>
                </RouterLink>
              </div>
            </>
          ) : (
            verified ? (
              <div className="text-center">
                <h1 className="text-3xl font-semibold mb-4">Request sent successfully</h1>
                <p>
                  We have sent a confirmation email to <strong>{email}</strong>
                  <br />
                  Please check your email.
                </p>
                <RouterLink to='/login' className="block w-full mt-5">
                  <button className="w-full bg-black text-white py-2 px-4 rounded">
                    Back
                  </button>
                </RouterLink>
              </div>
            ) : (
              <VerifyCode email={email} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
