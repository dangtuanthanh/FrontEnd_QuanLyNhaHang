import React, { useEffect } from "react";
import { getCookie } from "./Cookie";
const GetData = (props) => {

  useEffect(() => {
    //const ss = getCookie(ss)
    fetch(props.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ss': getCookie('ss'),
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Gửi yêu cầu không thành công');
          }
          return response.json();
        })
        .then(data => {
          props.setData(data); // Gọi hàm setData từ props để cập nhật dữ liệu
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }, [props.url, props.setData]);

  return null; // Trả về null hoặc một phần tử trống
}

export default GetData;