import React, { useState, useEffect } from "react";
import { getCookie } from "./Cookie";
import { useNavigate } from 'react-router-dom';
function CheckLogin({ children,menu }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const url = 'https://vres.onrender.com/session'; // Đường dẫn API của bạn
    const data = {
      ss: getCookie("ss")
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success === true) {
          menu(result.menu)
          setIsAuthorized(true);
        } else {
          navigate(`/`);
          //window.location.href = "/";//Chuyển trang
        }
      })
      .catch(error => {
        console.log(error);
        //alert("Không thể kết nối tới máy chủ");
      });
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default CheckLogin;