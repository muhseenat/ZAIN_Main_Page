import React from 'react'
import { useNavigate } from "react-router-dom";
import Announcement from "../components/Announcement";
import ProfileEdit from '../components/profile/ProfileEdit';
import Navbar from "../components/Navbar";

function ProfilePage() {
  return (
  <>
<Navbar/>
<Announcement/>
<ProfileEdit/>
</>
  )
}

export default ProfilePage