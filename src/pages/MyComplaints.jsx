import { useEffect, useState } from "react";

function MyComplaints() {
const [complaints, setComplaints] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
fetch("http://localhost:8080/api/issues")
.then((response) => {
if (!response.ok) {
throw new Error("Failed to fetch complaints");
}
return response.json();
})
.then((data) => {
setComplaints(data);
setLoading(false);
})
.catch((err) => {
console.error(err);
setError("Unable to load complaints.");
setLoading(false);
});
}, []);

if (loading) {
return <p>Loading complaints...</p>;
}

if (error) {
return <p>{error}</p>;
}

return (
<div>
<h1>My Complaints</h1>

{complaints.length === 0 ? (  
    <p>No complaints found.</p>  
  ) : (  
    <table border="1" cellPadding="10">  
      <thead>  
        <tr>  
          <th>Complaint ID</th>  
          <th>Issue</th>  
          <th>Category</th>  
          <th>Location</th>  
          <th>Status</th>  
        </tr>  
      </thead>  

      <tbody>  
        {complaints.map((complaint) => (  
          <tr key={complaint.id}>  
            <td>  
              CIV{String(complaint.id).padStart(3, "0")}  
            </td>  

            <td>{complaint.title}</td>  

            <td>{complaint.category}</td>  

            <td>{complaint.location}</td>  

            <td>{complaint.status}</td>  
          </tr>  
        ))}  
      </tbody>  
    </table>  
  )}  
</div>

);
}

export default MyComplaints;