import React from "react";
import useConnectedUserData from "../hooks/useConnectedUserData";

const GetUser = () => {
  const { data: userData, error, isLoading } = useConnectedUserData();

  return (
    <>
      {error && <p>{error.message}</p>}
      <div>{userData?.name}</div>
    </>
  );
};

export default GetUser;
