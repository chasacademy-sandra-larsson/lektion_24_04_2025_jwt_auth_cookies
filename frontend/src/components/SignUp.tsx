import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type SignUpData = {
  email: string;
  password: string;
}


export const SignUp = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpData>();
  const navigate = useNavigate();


  const onSubmit = async (data: SignUpData) => {

    const response = await fetch("http://localhost:3000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });


    if (response.ok) {
      console.log("Användare skapad");
      navigate("/sign-in");
    } else {
      prompt("Användare skapades inte");

    }

  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        <button type="submit">Sign Up</button>
        <Link to="/sign-in">Already have an account? Sign in</Link>
      </form>
    </div>
  );
};