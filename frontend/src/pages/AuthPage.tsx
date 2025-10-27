import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

type AuthStep = 'login' | 'otp';

export const AuthPage = () => {
    const [currentStep, setCurrentStep] = useState<AuthStep>('login');
    const [customerIdOrMobile, setCustomerIdOrMobile] = useState<string>('');
    const { isAuthenticated } = useCustomerAuth();

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        return (
            <Navigate
                to='/dashboard'
                replace
            />
        );
    }

    const handleOTPSent = (identifier: string) => {
        setCustomerIdOrMobile(identifier);
        setCurrentStep('otp');
    };

    const handleBackToLogin = () => {
        setCurrentStep('login');
        setCustomerIdOrMobile('');
    };

    const handleAuthSuccess = () => {
        // Navigation will be handled by the redirect above
        window.location.href = '/dashboard';
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {currentStep === 'login' ? (
                    <LoginForm onOTPSent={handleOTPSent} />
                ) : (
                    <OTPVerification
                        customerIdOrMobile={customerIdOrMobile}
                        onBack={handleBackToLogin}
                        onSuccess={handleAuthSuccess}
                    />
                )}
            </div>
        </div>
    );
};
