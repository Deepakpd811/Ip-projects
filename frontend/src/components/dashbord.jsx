import axios from "axios"
import { useEffect } from "react"

const Dashboard = ()=>{

  useEffect(()=>{
    axios
              .get("http://localhost:3000/student")
              .then((response) => {
                console.log("Recognition result:", response);
                setRoll(response.data.msg._label);
              })
              .catch((error) => {
                console.error("Error sending image to server:", error);
              });
  },[])
    return(
        <>
        
        <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
        </table>

        </>
    )
}

export default Dashboard