'use client';
import Loading from '@/components/Loading';
import WizardStepper from '@/components/WizardStepper';
import { useCheckoutNavigation } from '@/app/hooks/useCheckoutNavigation';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import CheckoutDetailPage from './CheckoutDetail';
import Payment from './Payment';
import PurchaseCompletion from './Completion';

const page = () => {
  const { isLoaded } = useUser();
  if (!isLoaded) return <Loading />;
  const { checkoutStep } = useCheckoutNavigation();
  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailPage />;
      case 2:
        return <Payment />;
      case 3:
        return <PurchaseCompletion />;
      default:
      // return <CheckoutDetailsPage />;
    }
  };

  return (
    <div className="checkout">
      <WizardStepper currentStep={checkoutStep} />
      <div className="checkout__content">{renderStep()}</div>
    </div>
  );
};

export default page;
