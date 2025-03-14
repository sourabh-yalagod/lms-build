'use client';
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotificationSettingsFormData, notificationSettingsSchema } from '@/lib/schemas';
import { useGetCourseByIdQuery, useUserUpdateMutation } from '@/state/api';
import { toast } from 'sonner';
import { Form } from './ui/form';
import FormComponent from './FormComponent';
import { Button } from './ui/button';
type SettingsProp = {
  title: string;
  subTitles?: string;
};
const Settings = ({ title, subTitles }: SettingsProp) => {
  const [userUpdate] = useUserUpdateMutation();
  const { user } = useUser();
  if (!user) return <div>Authenticate</div>;
  const currentSettings = (user?.publicMetadata as { settings: UserSettings }).settings || {};
  const method = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings?.courseNotifications || false,
      emailAlerts: currentSettings?.emailAlerts || false,
      smsAlerts: currentSettings?.smsAlerts || false,
      notificationFrequency: currentSettings?.notificationFrequency || 'no',
    },
  });
  const onSubmit = async (data: NotificationSettingsFormData) => {
    if (!data) {
      toast.warning(`Form Data required`);
      return;
    }
    console.log('Formdata : ', data);
    const userSetting = {
      userId: user.id,
      publicMetaData: {
        ...user?.publicMetadata,
        settings: { ...currentSettings, ...data },
      },
    };
    try {
      await userUpdate(userSetting);
      toast.success(`From submited successfully`);
    } catch (error) {
      toast.error(`Form Submition failed....!`);
    }
  };
  useEffect(() => {
    if (user?.publicMetadata) {
      method.reset({
        courseNotifications: currentSettings?.courseNotifications || false,
        emailAlerts: currentSettings?.emailAlerts || false,
        smsAlerts: currentSettings?.smsAlerts || false,
        notificationFrequency: currentSettings?.notificationFrequency || 'no',
      });
    }
  }, [user, method.reset]);
  return (
    <Form {...method}>
      <form className="notification-settings__form" onSubmit={method.handleSubmit(onSubmit)}>
        <div className="notification-settings__fields">
          <FormComponent name="courseNotifications" label="Course Notifications" type="switch" />
          <FormComponent name="emailAlerts" label="Email Alerts" type="switch" />
          <FormComponent name="smsAlerts" label="SMS Alerts" type="switch" />
          <FormComponent
            name="notificationFrequency"
            label="Notification Frequency"
            type="select"
            options={[
              { value: 'immediate', label: 'Immediate' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'no', label: 'Off' },
            ]}
          />
        </div>
        <Button type="submit" className="notification-settings__submit">
          Update Settings
        </Button>
      </form>
    </Form>
  );
};

export default Settings;
