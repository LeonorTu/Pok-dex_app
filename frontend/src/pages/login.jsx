import React from "react";
import background from "../assets/8k.jpg"
import LoginForm from "../components/LoginForm.jsx"
import RegistrationForm from "../components/RegistrationForm.jsx"

const Login = () => {

	return (
	<div className="h-screen bg-cover bg-center" style={{backgroundImage: `url(${background})`}}>
		<div className="flex flex-col justify-center items-center h-full">
			<div className="opacity-60 w-full max-w-md m-auto bg-gray-400 rounded p-5 overflow-auto">
				<LoginForm />
				<RegistrationForm  />
			</div>
		</div>
	</div>
	)
}

export default Login;