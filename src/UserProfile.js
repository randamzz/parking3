import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const cookieValue = Cookies.get('email');

  useEffect(() => {
    axios
      .get('http://localhost:5000/Users')
      .then((response) => {
        const currentUser = response.data.find((user) => user.email === cookieValue);
        setUserProfile(currentUser);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cookieValue]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-10 mb-lg-10">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol
                  md="4"
                  className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}
                >
                  <MDBCardImage
                    src="https://i.pinimg.com/originals/61/4b/59/614b59b862d195cac9abe0d996cd3e4d.jpg"
                    alt="Avatar"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                    className="my-5"
                    fluid
                  />
                  <MDBCardText className="text-muted">{userProfile.email}</MDBCardText>
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-5">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">User ID</MDBTypography>
                        <MDBCardText className="text-muted">{userProfile.id}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">User Type</MDBTypography>
                        <MDBCardText className="text-muted">
                          {userProfile.type === 1 ? 'Admin' : 'User'}
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Password</MDBTypography>
                        <MDBCardText className="text-muted">{userProfile.password}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default UserProfile;
