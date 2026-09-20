'use client';

import { useState } from 'react';
import EditProfile from './edit-profile';
import ChangePassword from './change-password';
import { IUser } from '@/src/types/user.type';
import { useAppSelector } from '@/src/redux/hooks';
import { selectCurrentUser } from '@/src/redux/features/auth/authSlice';
import { useGetUserProfileQuery } from '@/src/redux/features/user/userApi';
import Spinner from '@/src/components/shared/Spinner';
import ImagePreviewer from '@/src/components/modules/ImageUploader/ImagePreviewer';
import ImageUploader from '@/src/components/modules/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;

  // Fetch user profile
  const { data, isLoading, refetch } = useGetUserProfileQuery(email);
  const userData: IUser | undefined = data?.data;

  // Single image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    userData?.image || '',
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white pb-10">
      {/* ----- Profile Picture Section ----- */}
      <div className="w-full bg-sc-primary flex items-center justify-center gap-6 py-12 bg-[#1c3b4a]">
        {/* Profile Image */}
        <div className="relative w-32 h-32">
          {imagePreview ? (
            <ImagePreviewer
              className="w-32 h-32 rounded-full object-cover border border-white shadow-lg"
              setImageFile={setImageFile}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          ) : (
            <ImageUploader
              setImageFile={setImageFile}
              setImagePreview={setImagePreview}
              label="Upload"
              className="w-32 h-32 rounded-full border border-white bg-white"
            />
          )}
        </div>

        {/* User Info */}
        <div className="text-white">
          <h2 className="text-2xl font-semibold">{userData?.name}</h2>
          <p className="text-base">{userData?.role}</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <Tabs defaultValue="editProfile" className="mt-6 flex-col w-full">
          <div className="w-full flex items-center justify-center">
            <TabsList className="flex flex-wrap space-x-3 bg-transparent w-fit">
              {[
                { value: 'editProfile', label: 'Edit Profile' },
                { value: 'changePass', label: 'Change Password' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
              font-medium cursor-pointer px-4 py-2 rounded
              text-gray-700 dark:text-gray-300
              transition-colors flex-none
              data-active:bg-[#1c3b4a]
              data-active:text-white bg-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-800
            "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="editProfile">
            <EditProfile
              userData={userData}
              imageFile={imageFile}
              refetch={refetch}
            />
          </TabsContent>

          <TabsContent value="changePass">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
