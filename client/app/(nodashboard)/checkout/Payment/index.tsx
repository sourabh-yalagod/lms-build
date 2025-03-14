'use client';
import { useCheckoutNavigation } from '@/app/hooks/useCheckoutNavigation';
import { useCurrentCourse } from '@/app/hooks/useCurrentCourse';
import CoursePreview from '@/components/CoursePreview';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';
import React from 'react';
import StripeProvider from './StripeProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCreateTransactionMutation } from '@/state/api';
import { useClerk, useUser } from '@clerk/nextjs';
console.log(process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL);

const PaymentPage = () => {
  const { user } = useUser();
  const elements = useElements();
  const { courseId } = useCurrentCourse();
  const stripe = useStripe();
  const { navigateToStep } = useCheckoutNavigation();
  const [createTransaction] = useCreateTransactionMutation();
  const { course } = useCurrentCourse();
  const { signOut } = useClerk();
  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe Service is not available....!', {
        description: 'please try again later',
        position: 'top-center',
        duration: 2000,
      });
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL
      ? `https://${process.env.NEXT_PUBLIC_LOCAL_URL}`
      : process.env.NEXT_PUBLIC_VARCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VARCEL_URL}`
        : undefined;
    const confirmPayment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/chockout?step=3&id=${courseId}`,
      },
      redirect: 'if_required',
    });
    if (confirmPayment.paymentIntent?.status === 'succeeded') {
      const newTransaction: Partial<Transaction> = {
        amount: confirmPayment.paymentIntent.amount,
        transactionId: confirmPayment.paymentIntent.id,
        courseId: courseId,
        userId: user?.id as string,
        paymentProvider: 'stripe',
      };
      const { data, error } = await createTransaction(newTransaction);
      if (data) {
        window.location.href = `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}&id=${courseId}`;
      }
    }
  };
  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Pyament Form */}
        <div className="payment__form-container">
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payment details below to complete your purchase.
              </p>

              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>

                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="payment__card-element">
                    <PaymentElement />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          disabled={!stripe}
          form="payment-form"
          type="submit"
          className={`payment__submit ${!stripe && 'cursor-not-allowed'}`}
        >
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};
const Payment = () => {
  return (
    <StripeProvider>
      <PaymentPage />
    </StripeProvider>
  );
};

export default Payment;
