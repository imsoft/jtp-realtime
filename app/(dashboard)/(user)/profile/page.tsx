"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error("Error fetching session:", sessionError);
        setLoading(false);
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: userProfile, error: userProfileError } = await supabase
        .from("users")
        .select("name, last_name, email, role")
        .eq("id", userId)
        .single();

      if (userProfileError) {
        console.error("Error fetching user profile:", userProfileError);
      } else {
        setUserProfile(userProfile);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!userProfile) {
    return <p>No se pudo cargar la información del perfil.</p>;
  }

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Perfil del usuario
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Aquí podrás ver el perfil del usuario
          </p>
        </div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Nombre(s)
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {userProfile.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Apellido(s)
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {userProfile.last_name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {userProfile.email}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Role
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {userProfile.role}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
