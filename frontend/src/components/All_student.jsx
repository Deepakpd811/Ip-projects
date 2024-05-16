import React from 'react'
import axios from "axios"
import { useEffect, useState } from "react"


const  All_student= ()=>{

        const [studata,Setstudata] = useState([{}]);
        useEffect(()=>{
          axios
          .get("http://localhost:3000/studentDetail")
          .then((response) => {
            // console.log("Recognition result:", response.data.marked);
            Setstudata(response.data.marked);
            
          })
          .catch((error) => {
            console.error("Error sending image to server:", error);
          });
        },[])
        // console.log(studata[0]);
        return(
          <>
              
              <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
        {studata.map((stu, index) => (
          <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{stu.studentId}</td>
              <td>{stu.name}</td>
              <td>{stu.date}</td>
          </tr>
      ))}
          {/* <tr>
            <th scope="row">1</th>
            <td>{studata[0].id}</td>
            <td>{studata[0].marked}</td>
            <td>{studata[0].date}</td>
          </tr>
           */}
        </tbody>
              </table>
      
              </>
          )
      }


export default All_student;



