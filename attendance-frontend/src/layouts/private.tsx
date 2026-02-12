import {Navigate, Outlet} from "react-router-dom"

function PrivateLayout() {
  const token = document.cookie || "test"; // TODO: Get actual token
  if (!token) {
    return <Navigate to="/" replace/>;
  }
  return (
    <div>
      <h1>Private</h1>
      <Outlet/>
    </div>
  )
}

export default PrivateLayout